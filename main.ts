// Your prototype's TypeScript goes here. This file exists so the lint
// sensor has something to check from day one. If the week's spec rules out
// JavaScript, delete this file and the script tag in index.html — the site
// you ship has to meet the spec, not the template's defaults.
const intro = document.querySelector<HTMLElement>('[data-testid="intro"]');
if (intro) {
  intro.dataset.ready = "true";
}
