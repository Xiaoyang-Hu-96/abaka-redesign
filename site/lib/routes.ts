import * as content from "./content";
import * as navData from "./nav";
import { templatePages } from "./content";

/** Pages this prototype builds. */
export const builtRoutes = ["/", "/datasets", "/system", "/contact", "/sitemap", "/solutions/physical-ai", "/datasets/request"];

/** Pages rendered by the shared template (components/page/TemplatePage.tsx), one content entry each. */
export const templateRoutes = Object.keys(templatePages);

/** Every internal path that appears anywhere in the site's data (nav and copy), without query or hash. */
function collect(value: unknown, out: Set<string>) {
  if (typeof value === "string") {
    // pages only: skips protocol-relative URLs and files such as /logos/openai.svg
    if (value.startsWith("/") && !value.startsWith("//") && !/\.[a-z0-9]+$/i.test(value.split(/[?#]/)[0])) out.add(value.split(/[?#]/)[0] || "/");
    return;
  }
  if (Array.isArray(value)) return value.forEach((v) => collect(v, out));
  // plain data only: skips functions and icon components
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    Object.values(value).forEach((v) => collect(v, out));
  }
}
const linked = new Set<string>();
collect({ ...content, ...navData }, linked);
/** Every internal page the site links to, built or not. The sitemap must list each one. */
export const linkedRoutes = [...linked].sort();

/**
 * Linked pages that aren't built. They render the Coming soon page; any other unknown URL is still a real 404.
 * A link added to lib/nav.ts or lib/content.ts is covered automatically.
 */
export const unbuiltRoutes = [...linked].filter((p) => !builtRoutes.includes(p) && !templateRoutes.includes(p)).sort();
