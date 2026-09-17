/**
 * Main Application Orchestrator & Scene Router (GSAP Powered)
 * Modular Graduation Invitation System
 */

import ConfettiCannon from "./effects/confetti.js";
import { initStarSparkles } from "./effects/sparkles.js";
import { Scene1Controller } from "./scenes/scene1.js";
import { Scene2Controller } from "./scenes/scene2.js";
import { animateCardUnfold, animateReturnToIntro } from "./effects/animations.js";

class GraduationApp {
  constructor() {
    this.sceneIntro = document.getElementById("scene-intro");
    this.sceneInvitation = document.getElementById("scene-invitation");

    // Initialize Effects
    this.confettiCannon = new ConfettiCannon("confetti-canvas");
    initStarSparkles("particles-container", 35);

    // Initialize Scene Controllers
    this.scene1 = new Scene1Controller({
      confettiCannon: this.confettiCannon,
      onProceedToInvitation: () => this.showSceneInvitation()
    });

    this.scene2 = new Scene2Controller({
      onBackToIntro: () => this.showSceneIntro()
    });

    this.handleQueryParams();
  }

  showSceneInvitation() {
    if (!this.sceneIntro || !this.sceneInvitation) return;
    animateCardUnfold(this.sceneIntro, this.sceneInvitation);
  }

  showSceneIntro() {
    if (!this.sceneIntro || !this.sceneInvitation) return;
    animateReturnToIntro(this.sceneInvitation, this.sceneIntro, () => {
      this.scene1.reset();
    });
  }

  handleQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const testState = urlParams.get("test");

    if (testState === "reject1") {
      this.scene1.handleDecline();
    } else if (testState === "reject2") {
      this.scene1.handleDecline();
      this.scene1.handleDecline();
    } else if (testState === "declined") {
      if (this.scene1.stepQuestion) this.scene1.stepQuestion.classList.add("hidden");
      if (this.scene1.stepDeclined) this.scene1.stepDeclined.classList.remove("hidden");
    } else if (testState === "accepted") {
      if (this.scene1.stepQuestion) this.scene1.stepQuestion.classList.add("hidden");
      if (this.scene1.stepAccepted) this.scene1.stepAccepted.classList.remove("hidden");
    } else if (testState === "invitation") {
      if (this.sceneIntro) this.sceneIntro.classList.add("hidden");
      if (this.sceneInvitation) {
        this.sceneInvitation.classList.remove("hidden");
        this.sceneInvitation.style.opacity = "1";
        this.sceneInvitation.style.transform = "none";
      }
    }
  }
}

// Bootstrap Application
document.addEventListener("DOMContentLoaded", () => {
  window.graduationApp = new GraduationApp();
});
