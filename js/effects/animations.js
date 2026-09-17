/**
 * GSAP Motion Orchestration & Micro-interactions
 * Professional Awwwards-level transitions and spring physics
 */

// Helper to ensure gsap is loaded
function getGSAP() {
  return window.gsap || null;
}

/**
 * 1. Magnetic hover physics on buttons (Desktop)
 */
export function initMagneticButton(buttonEl, power = 0.35) {
  const gsap = getGSAP();
  if (!gsap || !buttonEl || window.matchMedia("(pointer: coarse)").matches) return;

  const xTo = gsap.quickTo(buttonEl, "x", { duration: 0.35, ease: "power2.out" });
  const yTo = gsap.quickTo(buttonEl, "y", { duration: 0.35, ease: "power2.out" });

  buttonEl.addEventListener("mousemove", (e) => {
    const rect = buttonEl.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    xTo(x * power);
    yTo(y * power);
  });

  buttonEl.addEventListener("mouseleave", () => {
    xTo(0);
    yTo(0);
  });
}

/**
 * 2. Button 'Không' Rubber-band / Elastic Wiggle & Button 'Có' Pulse
 */
export function animateDeclineButton(btnNo, btnYes, currentNoScale, targetYesScale) {
  const gsap = getGSAP();
  if (!gsap) return;

  // Elastic Wiggle
  gsap.to(btnNo, {
    keyframes: [
      { x: -10, rotation: -3 },
      { x: 10, rotation: 3 },
      { x: -7, rotation: -2 },
      { x: 7, rotation: 2 },
      { x: 0, rotation: 0 }
    ],
    scale: currentNoScale,
    duration: 0.48,
    ease: "elastic.out(1, 0.3)"
  });

  // Pulse & scale 'Có'
  gsap.to(btnYes, {
    scale: targetYesScale,
    duration: 0.4,
    ease: "back.out(2)"
  });
}

/**
 * 3. Hint message blur & slide-up entrance
 */
export function animateHintText(hintBadge) {
  const gsap = getGSAP();
  if (!gsap || !hintBadge) return;

  hintBadge.classList.remove("hidden");
  gsap.fromTo(hintBadge,
    { opacity: 0, y: 15, filter: "blur(4px)" },
    { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power3.out" }
  );
}

/**
 * 4. Step Question ➔ Step Declined (Refusal after 3 clicks)
 */
export function animateTransitionToDeclined(stepQuestion, stepDeclined, stickerBox) {
  const gsap = getGSAP();
  if (!gsap) {
    if (stepQuestion) stepQuestion.classList.add("hidden");
    if (stepDeclined) stepDeclined.classList.remove("hidden");
    return;
  }

  const tl = gsap.timeline();

  tl.to(stepQuestion, {
    y: -20,
    opacity: 0,
    scale: 0.95,
    duration: 0.35,
    ease: "power2.in",
    onComplete: () => {
      stepQuestion.classList.add("hidden");
      stepDeclined.classList.remove("hidden");
    }
  })
  .fromTo(stickerBox,
    { scale: 0.3, opacity: 0, y: 35 },
    { scale: 1, opacity: 1, y: 0, duration: 0.75, ease: "back.out(1.7)" }
  )
  .from(stepDeclined.querySelectorAll(".declined-title, .declined-letter, .btn-view-anyway"), {
    opacity: 0,
    y: 18,
    stagger: 0.12,
    duration: 0.55,
    ease: "power3.out"
  }, "-=0.35");

  // Eternal subtle floating for the sticker
  gsap.to(stickerBox, {
    y: "-=8px",
    duration: 2.2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true
  });
}

/**
 * 5. Expanding Gold Shockwave Ripple
 */
export function triggerShockwave(x, y) {
  const gsap = getGSAP();
  if (!gsap) return;

  const ring = document.createElement("div");
  ring.className = "shockwave-ring";
  document.body.appendChild(ring);

  gsap.set(ring, { left: x, top: y, width: 20, height: 20, opacity: 0.8 });
  gsap.to(ring, {
    width: 680,
    height: 680,
    opacity: 0,
    duration: 0.9,
    ease: "power2.out",
    onComplete: () => ring.remove()
  });
}

/**
 * 6. Step Question ➔ Step Accepted (Joyful Celebration)
 */
export function animateTransitionToAccepted(stepQuestion, stepAccepted) {
  const gsap = getGSAP();
  if (!gsap) {
    if (stepQuestion) stepQuestion.classList.add("hidden");
    if (stepAccepted) stepAccepted.classList.remove("hidden");
    return;
  }

  const tl = gsap.timeline();

  tl.to(stepQuestion, {
    scale: 0.92,
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      stepQuestion.classList.add("hidden");
      stepAccepted.classList.remove("hidden");
    }
  })
  .from(stepAccepted.querySelector(".celebration-icon-box"), {
    scale: 0.2,
    rotation: -25,
    opacity: 0,
    duration: 0.65,
    ease: "back.out(2)"
  })
  .from(stepAccepted.querySelectorAll(".accepted-title, .accepted-subtitle, .btn-open-invitation"), {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.55,
    ease: "power3.out"
  }, "-=0.35");
}

/**
 * 7. Scene 1 ➔ Scene 2 Morphing & Card Unfolding
 */
export function animateCardUnfold(sceneIntro, sceneInvitation) {
  const gsap = getGSAP();
  if (!gsap) {
    if (sceneIntro) sceneIntro.classList.add("hidden");
    if (sceneInvitation) sceneInvitation.classList.remove("hidden");
    return;
  }

  const tl = gsap.timeline();

  tl.to(sceneIntro, {
    scale: 0.94,
    y: -22,
    opacity: 0,
    duration: 0.4,
    ease: "power2.inOut",
    onComplete: () => {
      sceneIntro.classList.add("hidden");
      sceneInvitation.classList.remove("hidden");
    }
  })
  .fromTo(sceneInvitation, 
    { scale: 0.9, opacity: 0, y: 30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.65, ease: "back.out(1.2)" }
  )
  .from(sceneInvitation.querySelectorAll(".invitation-header-badge, .invitation-main-title, .invitation-divider, .invitation-to-text, .graduate-name, .graduate-major"), {
    opacity: 0,
    y: 15,
    stagger: 0.08,
    duration: 0.5,
    ease: "power3.out"
  }, "-=0.3")
  .from(sceneInvitation.querySelectorAll(".detail-item"), {
    opacity: 0,
    y: 25,
    stagger: 0.12,
    duration: 0.55,
    ease: "power3.out"
  }, "-=0.2")
  .from(sceneInvitation.querySelectorAll(".invitation-quote, .btn-back-intro"), {
    opacity: 0,
    y: 15,
    duration: 0.4,
    ease: "power2.out"
  }, "-=0.1");
}

/**
 * 8. Return from Scene 2 back to Scene 1
 */
export function animateReturnToIntro(sceneInvitation, sceneIntro, onComplete) {
  const gsap = getGSAP();
  if (!gsap) {
    if (sceneInvitation) sceneInvitation.classList.add("hidden");
    if (sceneIntro) sceneIntro.classList.remove("hidden");
    if (onComplete) onComplete();
    return;
  }

  gsap.to(sceneInvitation, {
    scale: 0.95,
    opacity: 0,
    y: 20,
    duration: 0.35,
    ease: "power2.in",
    onComplete: () => {
      sceneInvitation.classList.add("hidden");
      if (onComplete) onComplete();
      sceneIntro.classList.remove("hidden");
      gsap.fromTo(sceneIntro,
        { scale: 0.94, opacity: 0, y: -15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  });
}
