import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

const baseUrl = siteUrl.replace(/\/+$/, "");

/** Keep the exported sitemap aligned with the actual static routes. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/work/", "/about/", "/dojo/", "/lab/", "/services/", "/contact/"];
  const projectRoutes = projects.map((project) => `/work/${project.slug}/`);

  return [...routes, ...projectRoutes].map((path) => ({
    url: new URL(path, baseUrl).toString(),
  }));
}
