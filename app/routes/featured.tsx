import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import {
  useLoaderData,
  Link,
  useActionData,
  useFetcher,
} from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";
import logoUrl from "../../public/logo.png";

type LoaderData = {
  featuredLots: {
    id: string;
    title: string;
    description: string | null;
    author: {
      username: string;
    };
    _count: {
      users: number;
      posts: number;
    };
  }[];
};

type ActionData = {
  formError?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const lotIds = form.get("lotIds");
  if (typeof lotIds !== "string") {
    return json({ formError: "form not submitted correctly" }, { status: 404 });
  }
  const lotIdsParsed = JSON.parse(lotIds);
  await db.user.update({
    where: {
      id: userId,
    },
    data: {
      lots: {
        connect: lotIdsParsed,
      },
    },
  });
  return redirect("/");
};

export const loader: LoaderFunction = async ({ request }) => {
  console.log("HELLO !!!!!!!!");
  await requireUserId(request);
  const url = new URL(request.url);
  let cursor = url.searchParams.get("cursor");

  console.log("CURSOR");
  console.log(cursor);

  const featuredLots = await db.lot.findMany({
    take: 15,
    skip: cursor === null ? undefined : 1,
    cursor:
      cursor === null
        ? undefined
        : {
            id: cursor,
          },
    where: {
      featured: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      author: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          users: true,
          posts: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log("FEATURED LOTS");
  console.log(featuredLots);

  const data: LoaderData = {
    featuredLots,
  };

  return json(data);
};

export default function Featured() {
  const data = useLoaderData<LoaderData>();
  const [featuredLots, setFeaturedLots] = useState(data.featuredLots);
  const [selectedLots, setSelectedLots] = useState<string[]>([]);
  const actionData = useActionData<ActionData>();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [divHeight, setDivHeight] = useState<null | number>(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const divEl = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher();
  const [cursor, setCursor] = useState("");

  console.log("DATA", data);
  console.log("fetcherData", fetcher.data);

  useEffect(() => {
    if (featuredLots) {
      const lastLot = featuredLots[featuredLots.length - 1];
      const lastLotId = lastLot.id;
      console.log("CURSOR");
      console.log(lastLotId);
      setCursor(lastLotId);
    }
  }, [featuredLots]);

  console.log("fd", fetcher.data);
  useEffect(() => {

    if (!shouldFetch || !divHeight) return;
    if (clientHeight + scrollPosition + 100 < divHeight) return;
    console.log("SHOULD BE FETCHING!");
    fetcher.load(`/featured?cursor=${cursor}`);
    setShouldFetch(false);
  }, [divHeight, shouldFetch, clientHeight, scrollPosition, cursor, fetcher]);

  useEffect(() => {
    console.log("YO")
    if (fetcher.data && fetcher.data.featuredLots.length === 0) {
      setShouldFetch(false);
      return;
    }
    if (fetcher.data && fetcher.data.featuredLots.length > 0 && fetcher.type === "done") {
        console.log("hi123")
        console.log(fetcher.type)
      setFeaturedLots((prevState) => {
        const lotsCopy = prevState.map((lot) => ({ ...lot }));
        return [...lotsCopy, ...fetcher.data.featuredLots];
      });
      setShouldFetch(true);
    }
  }, [fetcher.data, fetcher.type]);
  

// useEffect(() => {
//     if (!fetcher.data || fetcher.type !== "done") {
//       return;
//     }
  
//     if (fetcher.data.featuredLots.length === 0) {
//       setShouldFetch(false);
  
//       return;
//     }
  
//     setFeaturedLots((prevState) => {
//       const lotsCopy = prevState.map((lot) => ({ ...lot }));
  
//       return [...lotsCopy, ...fetcher.data.featuredLots];
//     });
  
//     setShouldFetch(true);
//   }, [fetcher.data, fetcher.type]);

  useEffect(() => {
    if (divEl.current !== null && divEl.current !== undefined) {
      setDivHeight(divEl?.current?.getBoundingClientRect().height);
    }
  }, [featuredLots.length]);

  useEffect(() => {
    const scrollListener = () => {
      setClientHeight(window.innerHeight);
      setScrollPosition(window.scrollY);
    };
    // Avoid running during SSR
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", scrollListener);
    }
    // Clean up
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", scrollListener);
      }
    };
  }, []);

  const handleLotClick = (lotId: string) => {
    let nextState: [] | string[];
    if (selectedLots.includes(lotId)) {
      nextState = selectedLots.filter((id) => id !== lotId);
    } else {
      nextState = [...selectedLots, lotId];
    }
    setSelectedLots(nextState);
  };

  return (
    <div>
      <nav className="navbar mb-4">
        <div className="container">
          <Link className="navbar-brand me-auto" to="/">
            <img src={logoUrl} alt="logo" width="30" height="24" />
          </Link>
          <button className="ll-btn-link small">logout</button>
        </div>
      </nav>

      <div className="row">
        <div className="col">
          <div className="bg-white border border-dark border-opacity-50 p-4">
            <div className="d-flex align-content-center">
              <h3 className="mb-0 d-inline">
                Follow Three Or More Lots (Categories)
              </h3>
              <form method="post" className="ms-auto" id="123">
                <button
                  type="submit"
                  className="ll-btn "
                  disabled={selectedLots.length < 3}
                >
                  Next
                </button>
                <input
                  type="hidden"
                  name="lotIds"
                  value={JSON.stringify(selectedLots)}
                />
              </form>
            </div>
            <span className="d-block mt-2">
              Remeber- lots are just categories made up by users. Follow three
              or more and then click next.
            </span>
            {actionData?.formError ? (
              <p className="text-danger">{actionData.formError}</p>
            ) : null}
          </div>
        </div>
      </div>

      <span className="bold-text d-block mt-4 mb-2">featured lots</span>

      <div className="row row-cols-1 row-cols-md-4 g-4" ref={divEl}>
        {featuredLots.map((lot) => {
          const following = selectedLots.includes(lot.id);
          return (
            <div className="col" key={lot.id}>
              <div className="card rounded-0" style={{ height: "180px" }}>
                <div className="card-body d-flex flex-column">
                  <div className="card-title mb-1">
                    <h5 className="text-uppercase p-0 m-0 title-light">
                      {lot.title}
                    </h5>
                    <div className="text-secondary d-block">
                      <small>{`@${lot.author.username}`}</small>{" "}
                      <small className="fw-bold"> |</small>{" "}
                      <small>{`${lot._count.posts} Links`}</small>{" "}
                      <small className="fw-bold"> |</small>{" "}
                      <small>{`${lot._count.users} Following`}</small>
                    </div>
                  </div>
                  <small className="card-text d-block mb-0">
                    {lot.description && lot.description.length > 120
                      ? `${lot.description.slice(0, 85)}...`
                      : lot.description}
                  </small>
                  <div className="d-grid gap-2 mt-auto">
                    <button
                      style={{ fontSize: "12px" }}
                      className={
                        following
                          ? "ll-btn text-center clicked"
                          : "ll-btn text-center"
                      }
                      onClick={() => handleLotClick(lot.id)}
                    >
                      {following ? "Unfollow" : "Follow"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
