import { Form, useSearchParams, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useState } from "react";
import { db } from "~/utils/db.server";
import { login, register, createUserSession } from "~/utils/session.server";
import logoUrl from "../../public/logo.png";

type ActionData = {
  formError?: string;
  fields?: {
    fullName?: string | null;
    email: string;
    username?: string | null;
    password: string;
    loginType: string;
  };
  fieldErrors?: {
    fullName?: string | undefined;
    email: string | undefined;
    username?: string | undefined;
    password: string | undefined;
  };
};

function validateUrl(url: any, userOnboarded: Boolean) {
  console.log(url);
  let urls = ["/feed", "/"];
  if (!userOnboarded) {
    return "/featured";
  }
  if (urls.includes(url)) {
    return url;
  }
  return "/";
}

const validateFullName = (fullName: string) => {
  if (fullName.length < 3) {
    return "name too short- enter your full name";
  }
};

const validateEmail = (email: string) => {
  if (email.length < 3 || !email.toLowerCase().match(/^\S+@\S+\.\S+$/)) {
    return "invalid email";
  }
};

const validateUsername = (username: string) => {
  if (
    username.length < 3 ||
    username.length > 15 ||
    !username.match(
      /^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9 _.-]+)$/
    )
  ) {
    return "username can only contain numbers and letters and must be between 2 and 15 characters";
  }
};

const validatePassword = (password: string) => {
  if (password.length < 5) {
    return "password is too short";
  }
};

const badRequest = (data: ActionData) => {
  return json(data, { status: 404 });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const fullName = form.get("fullName");
  const password = form.get("password");
  const email = form.get("email");
  const redirectTo = form.get("redirectTo");

  if (typeof loginType !== "string") {
    return badRequest({ formError: "form submitted incorrectly" });
  }

  if (loginType === "login") {
    console.log(email);
    console.log(password);
    if (typeof email !== "string" || typeof password !== "string") {
      return badRequest({ formError: "email and/or password not submitted" });
    }
    const fieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    const fields = { loginType, email, password };
    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({ fields, fieldErrors });
    }
    const user = await login({ email, password });
    console.log(user);

    if (!user) {
      return badRequest({
        fields,
        formError: `Username/Password combination is incorrect`,
      });
    }
    return createUserSession(user.id, validateUrl(redirectTo, user.onboarded));
  }

  if (loginType === "register") {
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof fullName !== "string" ||
      typeof username !== "string"
    ) {
      return badRequest({ formError: "form not submitted correctly" });
    }
    const transformedUsername = username.replaceAll("@", "").toLowerCase();

    const fieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      fullName: validateFullName(fullName),
      username: validateUsername(transformedUsername),
    };
    const fields = { loginType, email, password, fullName, username };
    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({ fields, fieldErrors });
    }

    const userExists = await db.user.findFirst({
      where: { email },
    });
    const usernameExists = await db.user.findFirst({
      where: { username },
    });

    if (userExists) {
      return badRequest({
        fields,
        fieldErrors: {
          ...fieldErrors,
          email: `User with email ${email} already exists. Login or click forgot password`,
        },
      });
    }

    if (usernameExists) {
      return badRequest({
        fields,
        fieldErrors: {
          ...fieldErrors,
          username: `User with username ${username} already exists. Try another username`,
        },
      });
    }
    const newUser = await register({
      username: transformedUsername,
      fullName,
      password,
      email,
    });
    if (!newUser) {
      return badRequest({
        fields,
        formError: "Something went wrong trying to create new user",
      });
    }

    return createUserSession(
      newUser.id,
      validateUrl(redirectTo, newUser.onboarded)
    );
  }
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();
  const [loginType, setLoginType] = useState("register");
  const [displayInfo, setDisplayInfo] = useState(false);
  console.log("ACTION DATA");
  console.log(actionData);

  const handleLoginChange = (loginType: string) => {
    if (loginType === "login") {
      setLoginType("login");
    } else {
      setLoginType("register");
    }
  };

  return (
    <div className="mt-5">
      <div className="row">
        <div className="col d-flex flex-column justify-content-center align-items-center">
          <img style={{ height: "3.00rem" }} src={logoUrl} alt="linklot logo" />
          <h3 className="mb-0 mt-1" style={{ fontSize: "1.00rem" }}>
            Linklot
          </h3>
        </div>
      </div>
      <div className="row d-flex justify-content-center mt-5">
        <div className="col-md-4">
          <div className="w-100 bg-white border border-dark border-opacity-50">
            <Form method="post">
              <div className="border-bottom p-4">
                <div className="form-check form-check-inline">
                  <input
                    type="hidden"
                    name="redirectTo"
                    value={searchParams.get("redirectTo") ?? undefined}
                  />
                  <input
                    onChange={(e) => handleLoginChange("register")}
                    className="form-check-input"
                    type="radio"
                    id="inlineCheckbox2"
                    name="loginType"
                    value="register"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="inlineCheckbox2">
                    Create Account
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="inlineCheckbox1"
                    name="loginType"
                    onChange={(e) => handleLoginChange("login")}
                    value="login"
                  />
                  <label className="form-check-label" htmlFor="inlineCheckbox1">
                    Login
                  </label>
                </div>
              </div>
              <div className="p-4">
                <input
                  name="fullName"
                  className={
                    loginType === "register" ? "form-control" : "d-none"
                  }
                  type="text"
                  placeholder="full name"
                  aria-invalid={Boolean(actionData?.fieldErrors?.fullName)}
                  aria-errormessage={
                    actionData?.fieldErrors?.fullName
                      ? "username-error"
                      : undefined
                  }
                />
                {actionData?.fieldErrors?.fullName &&
                loginType === "register" ? (
                  <p className="text-danger" role="alert">
                    {actionData.fieldErrors.fullName}
                  </p>
                ) : null}
                <input
                  name="email"
                  className={
                    loginType === "register"
                      ? "form-control mt-3"
                      : "form-control"
                  }
                  type="text"
                  placeholder="email"
                  autoComplete="off"
                  aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                  aria-errormessage={
                    actionData?.fieldErrors?.email ? "email-error" : undefined
                  }
                />
                {actionData?.fieldErrors?.email ? (
                  <p className="text-danger" role="alert">
                    {actionData.fieldErrors.email}
                  </p>
                ) : null}
                <div
                  className={
                    loginType === "register" ? "input-group mt-3" : "d-none"
                  }
                >
                  <span
                    className="input-group-text rounded-0 input-border"
                    id="basic-addon1"
                  >
                    @
                  </span>
                  <input
                    name="username"
                    type="text"
                    className="form-control"
                    placeholder="desired username"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    aria-invalid={Boolean(actionData?.fieldErrors?.username)}
                    aria-errormessage={
                      actionData?.fieldErrors?.username
                        ? "username-error"
                        : undefined
                    }
                  />
                </div>
                {actionData?.fieldErrors?.username &&
                loginType === "register" ? (
                  <p className="text-danger" role="alert">
                    {actionData.fieldErrors.username}
                  </p>
                ) : null}

                <input
                  name="password"
                  className="form-control mt-3"
                  type="password"
                  placeholder="password"
                  aria-invalid={Boolean(actionData?.fieldErrors?.password)}
                  aria-errormessage={
                    actionData?.fieldErrors?.password
                      ? "password-error"
                      : undefined
                  }
                />
                {actionData?.fieldErrors?.password ? (
                  <p className="text-danger" role="alert">
                    {actionData.fieldErrors.password}
                  </p>
                ) : null}
                <button type="submit" className="ll-btn mt-4">
                  Submit
                </button>
                <button
                  type="submit"
                  className={
                    loginType === "login"
                      ? "ll-btn-link mt-4 d-block small"
                      : "d-none"
                  }
                >
                  forgot password
                </button>

                {actionData?.formError ? (
                  <p className="text-danger text-center mt-2">
                    {actionData.formError}
                  </p>
                ) : null}
              </div>
            </Form>
          </div>
        </div>
      </div>

      <div className={"row d-flex justify-content-center mb-5 mt-5"}>
        <div className="col-md-4 d-flex flex-column justify-content-center align-items-center">
          {displayInfo ? (
            <>
              <button
                className="ll-btn-link small"
                onClick={() => setDisplayInfo((prevState) => !prevState)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chevron-down me-1"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                  />
                </svg>
                what exactly is Linklot?
              </button>
              <div className="w-100 bg-white border border-dark border-opacity-50 p-4 mt-2">
                <p>Linklot is a social bookmarking app.</p>

                <p>
                  A post starts with a link, and each post is assigned to a lot. Lots are
                  just categories you come up with. For example, you can have a
                  MOVIE TRAILERS lot where you post movies you want to see. A
                  post contains a link, title, description, image/video, and a
                  lot. When you click on a post you are taken to the link in a
                  new tab.
                </p>
                <p>
                  The main feed is comprised of posts from lots that you follow.
                  Efficiently share and discover bits of the Internet without
                  any noise (there are no likes or comments for posts).
                </p>
                <p className="mb-0">Have fun!</p>
              </div>
            </>
          ) : (
            <button
              className="ll-btn-link small"
              onClick={() => setDisplayInfo((prevState) => !prevState)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-chevron-right me-1"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
              what exactly is Linklot?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
