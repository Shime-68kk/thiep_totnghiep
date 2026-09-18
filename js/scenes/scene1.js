/**
 * Scene 1: Interactive Question & Refusal Handler with RSVP & iOS Time Picker
 */

import {
  initMagneticButton,
  animateDeclineButton,
  animateHintText,
  animateTransitionToDeclined,
  triggerShockwave,
  animateTransitionToAccepted,
  animateTransitionToRSVP
} from "../effects/animations.js";
import { IOSTimePicker } from "../components/timePicker.js";
import { sendDiscordNotification } from "../services/discord.js";
import { sendGoogleSheetsNotification } from "../services/googleSheets.js";

export class Scene1Controller {
  constructor(options = {}) {
    this.onProceedToInvitation = options.onProceedToInvitation || (() => {});
    this.confettiCannon = options.confettiCannon || null;
    this.audioManager = options.audioManager || null;

    // DOM References - Steps
    this.stepQuestion = document.getElementById("step-question");
    this.stepDeclined = document.getElementById("step-declined");
    this.stepAccepted = document.getElementById("step-accepted");
    this.stepRsvp = document.getElementById("step-rsvp");
    this.stickerBox = document.querySelector(".sticker-box");
    this.hintBadge = document.getElementById("hint-text");
    this.hintMessage = document.getElementById("hint-message");

    // DOM References - Buttons
    this.btnYes = document.getElementById("btn-yes");
    this.btnNo = document.getElementById("btn-no");
    this.btnViewAnyway = document.getElementById("btn-view-anyway");
    this.btnOpenInvitation = document.getElementById("btn-open-invitation");

    // DOM References - RSVP Form
    this.guestNameInput = document.getElementById("guest-name-input");
    this.guestInputWrapper = document.getElementById("guest-input-wrapper");
    this.nameErrorMsg = document.getElementById("name-error-msg");
    this.btnSubmitRsvp = document.getElementById("btn-submit-rsvp");
    this.btnRsvpText = this.btnSubmitRsvp ? this.btnSubmitRsvp.querySelector(".btn-rsvp-text") : null;
    this.btnRsvpLoader = document.getElementById("rsvp-loader");

    // State
    this.rejectCount = 0;
    this.maxRejects = 3;
    this.guestName = "";
    this.chosenTime = "15:00";

    // Scale mappings
    this.yesScales = [1.0, 1.16, 1.32];
    this.noScales = [1.0, 0.88, 0.78];

    // Hint reaction text
    this.hintMessages = [
      "Thật sao? Đi với mình đi mà, có nhiều kỷ niệm và ảnh đẹp lắm ó! 🥺👉👈",
      "Năn nỉ lần nữa đó nha, bớt chút thời gian đến chung vui chụp cùng mình kiểu ảnh nha? 🥺🎓"
    ];

    // Initialize iOS Time Picker
    this.timePicker = new IOSTimePicker({
      container: document.getElementById("ios-time-picker"),
      initialHour: 15,
      initialMinute: 0,
      onTimeChange: (t) => {
        this.chosenTime = t.formatted;
      }
    });

    this.bindEvents();
    this.initMagneticPhysics();
  }

  initMagneticPhysics() {
    initMagneticButton(this.btnYes, 0.35);
    initMagneticButton(this.btnNo, 0.25);
    initMagneticButton(this.btnViewAnyway, 0.3);
    initMagneticButton(this.btnOpenInvitation, 0.35);
    initMagneticButton(this.btnSubmitRsvp, 0.25);
  }

  triggerHaptic(pattern = 50) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  bindEvents() {
    // Handle 'Không' button click
    if (this.btnNo) {
      this.btnNo.addEventListener("click", () => {
        if (this.audioManager && !this.audioManager.isPlaying && !this.audioManager.userManuallyPaused) {
          this.audioManager.play();
        }
        this.handleDecline();
      });
    }

    // Handle 'Có' button click
    if (this.btnYes) {
      this.btnYes.addEventListener("click", (e) => {
        if (this.audioManager && !this.audioManager.isPlaying && !this.audioManager.userManuallyPaused) {
          this.audioManager.play();
        }
        const rect = this.btnYes.getBoundingClientRect();
        const clickX = e.clientX || (rect.left + rect.width / 2);
        const clickY = e.clientY || (rect.top + rect.height / 2);
        this.handleAccept(clickX, clickY);
      });
    }

    // Transition from Declined screen to RSVP form
    if (this.btnViewAnyway) {
      this.btnViewAnyway.addEventListener("click", () => {
        this.triggerHaptic(40);
        animateTransitionToRSVP(this.stepDeclined, this.stepRsvp, () => {
          if (this.guestNameInput) this.guestNameInput.focus();
        });
      });
    }

    // Transition from Accepted screen to RSVP form
    if (this.btnOpenInvitation) {
      this.btnOpenInvitation.addEventListener("click", () => {
        this.triggerHaptic(50);
        animateTransitionToRSVP(this.stepAccepted, this.stepRsvp, () => {
          if (this.guestNameInput) this.guestNameInput.focus();
        });
      });
    }

    // Handle RSVP Form Submission
    if (this.btnSubmitRsvp) {
      this.btnSubmitRsvp.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleRsvpSubmit();
      });
    }

    // Clear error on input
    if (this.guestNameInput) {
      this.guestNameInput.addEventListener("input", () => {
        if (this.guestInputWrapper) this.guestInputWrapper.classList.remove("has-error");
        if (this.nameErrorMsg) this.nameErrorMsg.classList.add("hidden");
      });
    }
  }

  handleDecline() {
    this.rejectCount++;
    this.triggerHaptic(40);

    // Check if refused 3 times
    if (this.rejectCount >= this.maxRejects) {
      this.triggerHaptic([60, 50, 60]);
      animateTransitionToDeclined(this.stepQuestion, this.stepDeclined, this.stickerBox);
      return;
    }

    // Scale adjustments for try 1 and 2
    const currentYesScale = this.yesScales[this.rejectCount] || 1.32;
    const currentNoScale = this.noScales[this.rejectCount] || 0.78;

    // Trigger GSAP elastic wiggle on 'Không' and pulse on 'Có'
    animateDeclineButton(this.btnNo, this.btnYes, currentNoScale, currentYesScale);

    // Display hint reaction message with slide-up blur-in
    if (this.hintBadge && this.hintMessage) {
      this.hintMessage.textContent = this.hintMessages[this.rejectCount - 1] || "";
      animateHintText(this.hintBadge);
    }
  }

  handleAccept(clickX, clickY) {
    this.triggerHaptic([80, 40, 80, 40, 120]);

    // Shockwave ripple ring expanding across the screen
    if (clickX && clickY) {
      triggerShockwave(clickX, clickY);
    }

    // Fire celebratory confetti
    if (this.confettiCannon) {
      this.confettiCannon.blast();
    }

    // GSAP Transition to accepted card
    animateTransitionToAccepted(this.stepQuestion, this.stepAccepted);
  }

  handleRsvpSubmit() {
    const rawName = this.guestNameInput ? this.guestNameInput.value.trim() : "";
    if (!rawName) {
      this.triggerHaptic([100, 50, 100]);
      if (this.guestInputWrapper) this.guestInputWrapper.classList.add("has-error");
      if (this.nameErrorMsg) this.nameErrorMsg.classList.remove("hidden");
      if (this.guestNameInput) this.guestNameInput.focus();
      return;
    }

    this.guestName = rawName;
    const timeObj = this.timePicker ? this.timePicker.getTime() : { formatted: "15:00" };
    this.chosenTime = timeObj.formatted;

    // Loading State
    if (this.btnSubmitRsvp) this.btnSubmitRsvp.disabled = true;
    if (this.btnRsvpText) this.btnRsvpText.classList.add("hidden");
    if (this.btnRsvpLoader) this.btnRsvpLoader.classList.remove("hidden");

    this.triggerHaptic(60);

    // Blast celebratory confetti on form submission
    if (this.confettiCannon) {
      this.confettiCannon.blast();
    }

    // Completely non-blocking background dispatch for Discord & Google Sheets notifications
    setTimeout(() => {
      sendDiscordNotification(this.guestName, this.chosenTime);
      sendGoogleSheetsNotification(this.guestName, this.chosenTime);
    }, 60);

    // 0.8s smooth transition to Scene 2
    setTimeout(() => {
      if (this.btnSubmitRsvp) this.btnSubmitRsvp.disabled = false;
      if (this.btnRsvpText) this.btnRsvpText.classList.remove("hidden");
      if (this.btnRsvpLoader) this.btnRsvpLoader.classList.add("hidden");

      // Stop confetti canvas to immediately free mobile GPU for smooth card unfolding & scrolling
      if (this.confettiCannon) {
        this.confettiCannon.stop();
      }

      this.onProceedToInvitation({
        guestName: this.guestName,
        chosenTime: this.chosenTime
      });
    }, 800);
  }

  reset() {
    this.rejectCount = 0;
    if (window.gsap) {
      window.gsap.set(this.btnYes, { scale: 1, x: 0, y: 0 });
      window.gsap.set(this.btnNo, { scale: 1, x: 0, y: 0 });
    } else {
      if (this.btnYes) this.btnYes.style.transform = "scale(1)";
      if (this.btnNo) this.btnNo.style.transform = "scale(1)";
    }
    if (this.hintBadge) this.hintBadge.classList.add("hidden");
    if (this.stepDeclined) this.stepDeclined.classList.add("hidden");
    if (this.stepAccepted) this.stepAccepted.classList.add("hidden");
    if (this.stepRsvp) this.stepRsvp.classList.add("hidden");
    if (this.stepQuestion) {
      this.stepQuestion.classList.remove("hidden");
      if (window.gsap) window.gsap.set(this.stepQuestion, { opacity: 1, y: 0, scale: 1 });
    }
  }
}
