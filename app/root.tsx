import type { MetaFunction, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesUrl from "~/styles.css"

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "linklot",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => {
  return ([
    {
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css",
      rel:"stylesheet",
      integrity: "sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT",
      crossOrigin:"anonymous"
    },
    {
      href: stylesUrl,
      rel:"stylesheet",
    }
  ])
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container">
        <Outlet />
        </div>
        <ScrollRestoration />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8"
          crossOrigin="anonymous" />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
