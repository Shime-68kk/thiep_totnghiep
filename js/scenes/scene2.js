/**
 * Scene 2: Formal Graduation Invitation Card Controller (Enhanced with GSAP)
 */

import { initMagneticButton } from "../effects/animations.js";

export class Scene2Controller {
  constructor(options = {}) {
    this.onBackToIntro = options.onBackToIntro || (() => {});
    this.btnBackIntro = document.getElementById("btn-back-intro");

    this.bindEvents();
    if (this.btnBackIntro) {
      initMagneticButton(this.btnBackIntro, 0.25);
    }
  }

  bindEvents() {
    if (this.btnBackIntro) {
      this.btnBackIntro.addEventListener("click", () => {
        this.onBackToIntro();
      });
    }
  }
}
