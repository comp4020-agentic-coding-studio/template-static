// Your prototype's TypeScript goes here. This file exists so the lint and
// format sensors have something to check from day one.
const intro = document.querySelector<HTMLElement>('[data-testid="intro"]');
if (intro) {
  intro.dataset.ready = "true";
}
