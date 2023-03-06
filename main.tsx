/** @jsx jsx */
import * as marked from "npm:marked@4.2.12";
import { Hono } from "npm:hono@3.0.3";
import { jsx } from "npm:hono@3.0.3/jsx";
import { extract } from "https://deno.land/std@0.178.0/encoding/front_matter/any.ts";
import { serve } from "https://deno.land/std@0.178.0/http/server.ts";

const hono = new Hono();

hono.get("/*", async (ctx) => {
  const url = new URL(ctx.req.url);
  const res = await fetch(`https://${url.pathname}`);
  const body = await res.text();
  const html = marked.parse(extract(body).body);
  const title = html.replace(/[\s\S]*<h1[\s\S]*?>([\s\S]*?)<\/h1>[\s\S]*/, "$1");
  return ctx.html(
    <html>
      <head>
        <title>{title}</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/sakura.css/css/sakura.css"
          type="text/css"
        />
      </head>
      <body>
        <article dangerouslySetInnerHTML={{ __html: html }} />
        <hr />
        <p>
          Rendered by{" "}
          <a href="https://github.com/tani/markup">markup.deno.dev</a>
        </p>
      </body>
    </html>,
  );
});

serve(hono.fetch);
