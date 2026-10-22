import { expect, test } from "@playwright/test";

// Každá stránka na třech šířkách: nesmí přetékat do strany a uloží se screenshot ke kontrole.
const ROUTES = ["/", "/dnes/", "/stezka/", "/trenink/", "/trenink/tracking/", "/profil/", "/predplatne/", "/lekce/vedeni-3/", "/case-study/"];
const WIDTHS = [360, 768, 1280];
const SHOTS = process.env.SHOTS_DIR;

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    for (const theme of ["dark", "light"] as const) {
      test(`${route} @${width} ${theme}`, async ({ page }) => {
        await page.addInitScript((t) => localStorage.setItem("ht-theme", t), theme);
        await page.setViewportSize({ width, height: 800 });
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, "stránka přetéká do strany").toBeLessThanOrEqual(1);
        if (SHOTS) {
          const name = `${route.replaceAll("/", "_") || "_"}${width}-${theme}.png`;
          await page.screenshot({ path: `${SHOTS}/${name}`, fullPage: true });
        }
      });
    }
  }
}
