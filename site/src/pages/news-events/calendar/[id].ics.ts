import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { buildIcs } from "../../../lib/ics";

/**
 * One .ics download per event that has a confirmed `start` date. Events
 * without one get no file and no "Add to calendar" link, by design: the
 * season's dates carry no year until HQ confirms them.
 */
export const getStaticPaths = (async () => {
  const events = await getCollection("events", (e) => Boolean(e.data.start));
  return events.map((entry) => ({ params: { id: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props, site }) => {
  const { entry } = props as { entry: Awaited<ReturnType<typeof getCollection<"events">>>[number] };
  const { title, start, end, location } = entry.data;
  const description = (entry.body ?? "")
    .replace(/[*_`#>]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
  const host = site?.host ?? "sgrho1922.org";
  const body = buildIcs({
    uid: `${entry.id}-${start}@${host}`,
    title: `${title} (Sigma Gamma Rho)`,
    start: start!,
    end,
    location,
    description,
    url: site
      ? new URL(`${import.meta.env.BASE_URL.replace(/\/$/, "")}/news-events/upcoming-events/`, site).href
      : undefined,
  });
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${entry.id}.ics"`,
    },
  });
};
