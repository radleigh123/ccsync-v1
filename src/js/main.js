import '/js/utils/core.js';
import '/scss/styles.scss';
import { initAOS } from "/js/utils/animations.js";
import { setupNavigation } from "/js/utils/navigation.js";

const imageUrl = new URL('/assets/logo/icons8-sync-50.svg', import.meta.url).href;
console.log(imageUrl);

document.addEventListener("DOMContentLoaded", async () => {
  initAOS();
  await setupNavigation();
});