import '/js/utils/core.js';
import { initAOS } from "/js/utils/animations.js";
import { setupNavigation } from "/js/utils/navigation.js";

document.addEventListener("DOMContentLoaded", async () => {
  initAOS();
  await setupNavigation();
});