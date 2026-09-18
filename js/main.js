/**
 * Main Application Orchestrator & Scene Router (GSAP Powered)
 * Modular Graduation Invitation System
 */

import ConfettiCannon from "./effects/confetti.js";
import { AudioManager } from "./effects/audio.js";
import { Scene1Controller } from "./scenes/scene1.js";
import { Scene2Controller } from "./scenes/scene2.js";
import { 
  animateCardUnfold, 
  animateReturnToIntro, 
  initCard3DTilt,
  animatePageEntrance 
} from "./effects/animations.js";

class GraduationApp {
  constructor() {
    this.sceneIntro = document.getElementById("scene-intro");
    this.sceneInvitation = document.getElementById("scene-invitation");
    this.introCard = document.getElementById("intro-card");
    this.invitationCard = document.querySelector(".invitation-card");

    // Initialize Audio & Confetti
    this.confettiCannon = new ConfettiCannon("confetti-canvas");
    this.audioManager = new AudioManager("btn-music-toggle", "bgm-audio");

    // Initialize Card 3D Depth Tilt on Desktop
    if (this.introCard) initCard3DTilt(this.introCard);
    if (this.invitationCard) initCard3DTilt(this.invitationCard);

    // Initialize Scene Controllers
    this.scene1 = new Scene1Controller({
      confettiCannon: this.confettiCannon,
      audioManager: this.audioManager,
      onProceedToInvitation: (data) => this.showSceneInvitation(data)
    });

    this.scene2 = new Scene2Controller({
      onBackToIntro: () => this.showSceneIntro()
    });

    const isCustomState = this.handleQueryParams();
    if (!isCustomState && this.introCard) {
      animatePageEntrance(this.introCard);
    }
  }

  showSceneInvitation(data = {}) {
    if (!this.sceneIntro || !this.sceneInvitation) return;
    this.scene2.updateData(data);
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
    } else if (testState === "rsvp") {
      if (this.scene1.stepQuestion) this.scene1.stepQuestion.classList.add("hidden");
      if (this.scene1.stepRsvp) this.scene1.stepRsvp.classList.remove("hidden");
    } else if (testState === "invitation") {
      if (this.sceneIntro) this.sceneIntro.classList.add("hidden");
      if (this.sceneInvitation) {
        this.scene2.updateData({
          guestName: urlParams.get("name") || "BẠN THÂN YÊU",
          chosenTime: urlParams.get("time") || "15:30"
        });
        this.sceneInvitation.classList.remove("hidden");
        this.sceneInvitation.style.opacity = "1";
        this.sceneInvitation.style.transform = "none";
      }
    }
    return !!testState;
  }
}

// Bootstrap Application
document.addEventListener("DOMContentLoaded", () => {
  window.graduationApp = new GraduationApp();
});
