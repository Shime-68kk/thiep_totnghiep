/**
 * Scene 2: Formal Graduation Invitation Card Controller (Personalized & Calendar Integration)
 */

import { initMagneticButton } from "../effects/animations.js";
import { openGoogleCalendar, downloadAppleCalendarIcs } from "../services/calendar.js";

export class Scene2Controller {
  constructor(options = {}) {
    this.onBackToIntro = options.onBackToIntro || (() => {});
    
    // DOM Elements
    this.btnBackIntro = document.getElementById("btn-back-intro");
    this.guestNameEl = document.getElementById("invitation-guest-name");
    this.chosenTimeEl = document.getElementById("invitation-chosen-time");
    this.btnGoogleCal = document.getElementById("btn-add-google-cal");
    this.btnAppleCal = document.getElementById("btn-add-apple-cal");

    // State
    this.guestName = "BẠN THÂN YÊU";
    this.chosenTime = "15:00";

    this.bindEvents();
    this.initPhysics();
  }

  initPhysics() {
    if (this.btnBackIntro) initMagneticButton(this.btnBackIntro, 0.25);
    if (this.btnGoogleCal) initMagneticButton(this.btnGoogleCal, 0.2);
    if (this.btnAppleCal) initMagneticButton(this.btnAppleCal, 0.2);
  }

  updateData({ guestName = "BẠN THÂN YÊU", chosenTime = "15:00" } = {}) {
    this.guestName = guestName;
    this.chosenTime = chosenTime;

    if (this.guestNameEl) {
      this.guestNameEl.textContent = guestName.toUpperCase();
    }

    if (this.chosenTimeEl) {
      this.chosenTimeEl.textContent = chosenTime;
    }
  }

  bindEvents() {
    if (this.btnBackIntro) {
      this.btnBackIntro.addEventListener("click", () => {
        this.onBackToIntro();
      });
    }

    if (this.btnGoogleCal) {
      this.btnGoogleCal.addEventListener("click", () => {
        openGoogleCalendar({
          guestName: this.guestName,
          chosenTime: this.chosenTime
        });
      });
    }

    if (this.btnAppleCal) {
      this.btnAppleCal.addEventListener("click", () => {
        downloadAppleCalendarIcs({
          guestName: this.guestName,
          chosenTime: this.chosenTime
        });
      });
    }
  }
}
