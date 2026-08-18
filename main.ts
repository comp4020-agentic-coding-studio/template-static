// Your prototype's TypeScript goes here. If the week's spec rules out
// JavaScript, delete this file and the script tag in index.html.
const intro = document.querySelector<HTMLElement>('[data-testid="intro"]');
if (intro) {
  intro.dataset.ready = "true";
}
