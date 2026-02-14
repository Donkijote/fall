import { mountApp } from "@ui/App";

const appNode = document.querySelector<HTMLElement>("#app");

if (!appNode) {
  throw new Error("Missing #app element");
}

void mountApp(appNode);
