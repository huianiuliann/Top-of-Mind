import { createRoot, hydrateRoot } from "react-dom/client";
import { LangProvider } from "../i18n";
import "../index.css";

// Built pages arrive prerendered and hydrate; the dev server starts from an empty #root.
// The language comes from <html lang>, which the RO shells (ro/*.html) set to "ro": server and client must agree.
export function mount(Page) {
  const root = document.getElementById("root");
  if (!root) return;
  const lang = document.documentElement.lang === "ro" ? "ro" : "en";
  const app = (
    <LangProvider lang={lang}>
      <Page />
    </LangProvider>
  );
  if (root.hasChildNodes()) {
    hydrateRoot(root, app, {
      onRecoverableError: (e) => {
        window.__TOM_DEBUG__ && console.warn(e);
      },
    });
  } else {
    createRoot(root).render(app);
  }
}
