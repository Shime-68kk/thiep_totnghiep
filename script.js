/**
 * Thiệp Mời Tốt Nghiệp - Scene 1 & Interactive Transitions
 * Logic xử lý: Hộp câu hỏi Có/Không, hiệu ứng co giãn nút, rung nhẹ,
 * 3 lần từ chối hiển thị sticker buồn, và hiệu ứng ăn mừng khi đồng ý.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const stepQuestion = document.getElementById("step-question");
  const stepDeclined = document.getElementById("step-declined");
  const stepAccepted = document.getElementById("step-accepted");
  const hintBadge = document.getElementById("hint-text");
  const hintMessage = document.getElementById("hint-message");

  const btnYes = document.getElementById("btn-yes");
  const btnNo = document.getElementById("btn-no");

  const btnViewAnyway = document.getElementById("btn-view-anyway");
  const btnOpenInvitation = document.getElementById("btn-open-invitation");
  const btnBackIntro = document.getElementById("btn-back-intro");

  const sceneIntro = document.getElementById("scene-intro");
  const sceneInvitation = document.getElementById("scene-invitation");

  // State
  let rejectCount = 0;
  const maxRejects = 3;

  // Scale configurations for subtle, aesthetic transitions
  const yesScales = [1.0, 1.16, 1.32];
  const noScales = [1.0, 0.88, 0.78];

  // Whimsical reaction messages after each decline
  const hintMessages = [
    "Thật sao? Đi với mình đi mà, có nhiều kỷ niệm và ảnh đẹp lắm ó! 🥺👉👈",
    "Năn nỉ lần nữa đó nha, bớt chút thời gian đến chung vui chụp cùng mình kiểu ảnh nha? 🥺🎓"
  ];

  // Helper: Trigger mobile haptic vibration
  function triggerHaptic(pattern = 50) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Silently ignore if blocked
      }
    }
  }

  // ==================== 1. XỬ LÝ KHI BẤM 'KHÔNG' ====================
  if (btnNo) {
    btnNo.addEventListener("click", (e) => {
      e.stopPropagation();
      rejectCount++;

      // Trigger gentle haptic vibration
      triggerHaptic(40);

      // Trigger gentle shake animation
      btnNo.classList.remove("gentle-shake");
      // Trigger reflow to restart CSS animation
      void btnNo.offsetWidth;
      btnNo.classList.add("gentle-shake");

      // Check if limit reached (3 times)
      if (rejectCount >= maxRejects) {
        // Lần thứ 3: Chấp nhận lời từ chối -> Chuyển sang màn hình Sticker Buồn & Lời cảm ơn
        triggerHaptic([60, 50, 60]);

        if (stepQuestion) stepQuestion.classList.add("hidden");
        if (stepDeclined) stepDeclined.classList.remove("hidden");
        return;
      }

      // Khi bấm lần 1 hoặc 2: Co giãn nút vừa phải và hiện thông điệp năn nỉ
      const currentYesScale = yesScales[rejectCount];
      const currentNoScale = noScales[rejectCount];

      if (btnYes) {
        btnYes.style.transform = `scale(${currentYesScale})`;
      }

      if (btnNo) {
        btnNo.style.setProperty("--no-scale", currentNoScale);
        btnNo.style.transform = `scale(${currentNoScale})`;
      }

      // Cập nhật câu nói năn nỉ đáng yêu
      if (hintBadge && hintMessage) {
        hintMessage.textContent = hintMessages[rejectCount - 1] || "";
        hintBadge.classList.remove("hidden");
      }
    });
  }

  // ==================== 2. XỬ LÝ KHI BẤM 'CÓ' ====================
  if (btnYes) {
    btnYes.addEventListener("click", (e) => {
      e.stopPropagation();

      // Rung phản hồi thành công rực rỡ
      triggerHaptic([80, 40, 80, 40, 120]);

      // Bắn pháo hoa giấy rực rỡ (Confetti)
      triggerConfettiCannon();

      // Chuyển sang màn hình Đồng Ý
      if (stepQuestion) stepQuestion.classList.add("hidden");
      if (stepAccepted) stepAccepted.classList.remove("hidden");
    });
  }

  // ==================== 3. CHUYỂN TIẾP VÀO THIỆP CHÍNH (CẢNH 2) ====================
  function showInvitationScene() {
    if (sceneIntro) {
      sceneIntro.style.opacity = "0";
      sceneIntro.style.transform = "translateY(-15px) scale(0.96)";
      
      setTimeout(() => {
        sceneIntro.classList.add("hidden");
        if (sceneInvitation) {
          sceneInvitation.classList.remove("hidden");
          sceneInvitation.style.opacity = "0";
          sceneInvitation.style.transform = "translateY(20px) scale(0.97)";

          // Trigger smooth fade-in
          setTimeout(() => {
            sceneInvitation.style.transition = "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
            sceneInvitation.style.opacity = "1";
            sceneInvitation.style.transform = "translateY(0) scale(1)";
          }, 40);
        }
      }, 350);
    }
  }

  // Từ màn hình từ chối: Bấm "Dù sao thì vẫn muốn xem thiệp nè"
  if (btnViewAnyway) {
    btnViewAnyway.addEventListener("click", () => {
      triggerHaptic(40);
      showInvitationScene();
    });
  }

  // Từ màn hình đồng ý: Bấm "Mở xem thiệp mời ngay"
  if (btnOpenInvitation) {
    btnOpenInvitation.addEventListener("click", () => {
      triggerHaptic(50);
      showInvitationScene();
    });
  }

  // Từ Cảnh 2: Bấm nút "Trở về màn hình tương tác" để thử lại
  if (btnBackIntro) {
    btnBackIntro.addEventListener("click", () => {
      resetIntroModal();
      if (sceneInvitation) sceneInvitation.classList.add("hidden");
      if (sceneIntro) {
        sceneIntro.classList.remove("hidden");
        sceneIntro.style.opacity = "1";
        sceneIntro.style.transform = "translateY(0) scale(1)";
      }
    });
  }

  // Hàm reset trạng thái câu hỏi về ban đầu
  function resetIntroModal() {
    rejectCount = 0;
    if (btnYes) btnYes.style.transform = "scale(1)";
    if (btnNo) {
      btnNo.style.removeProperty("--no-scale");
      btnNo.style.transform = "scale(1)";
      btnNo.classList.remove("gentle-shake");
    }
    if (hintBadge) hintBadge.classList.add("hidden");
    if (stepDeclined) stepDeclined.classList.add("hidden");
    if (stepAccepted) stepAccepted.classList.add("hidden");
    if (stepQuestion) stepQuestion.classList.remove("hidden");
  }

  // ==================== 4. STAR SPARKLES GENERATOR ====================
  function createStarSparkles() {
    const container = document.getElementById("particles-container");
    if (!container) return;

    const count = 35;
    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "star-sparkle";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.animationDuration = `${3 + Math.random() * 3}s`;
      container.appendChild(star);
    }
  }
  createStarSparkles();

  // ==================== 5. HIGH-PERFORMANCE CONFETTI CANNON ====================
  const confettiCanvas = document.getElementById("confetti-canvas");
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  if (confettiCanvas) {
    confettiCtx = confettiCanvas.getContext("2d");
    function resizeCanvas() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
  }

  function triggerConfettiCannon() {
    if (!confettiCanvas || !confettiCtx) return;

    confettiParticles = [];
    const colors = ["#f59e0b", "#fde047", "#3b82f6", "#60a5fa", "#ec4899", "#a855f7", "#ffffff"];
    const totalParticles = 140;

    for (let i = 0; i < totalParticles; i++) {
      confettiParticles.push({
        x: confettiCanvas.width / 2 + (Math.random() - 0.5) * 200,
        y: confettiCanvas.height / 2 + 50,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 18 - 8,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.38,
        opacity: 1,
        shape: Math.random() > 0.3 ? "rect" : "circle"
      });
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animateConfetti();
  }

  function animateConfetti() {
    if (!confettiCtx || !confettiCanvas) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    let activeParticles = 0;

    for (let p of confettiParticles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;

      if (p.y > confettiCanvas.height * 0.4) {
        p.opacity -= 0.007;
      }

      if (p.opacity > 0 && p.y < confettiCanvas.height + 50) {
        activeParticles++;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.globalAlpha = Math.max(0, p.opacity);
        confettiCtx.fillStyle = p.color;

        if (p.shape === "rect") {
          confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          confettiCtx.beginPath();
          confettiCtx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
          confettiCtx.fill();
        }

        confettiCtx.restore();
      }
    }

    if (activeParticles > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiAnimationId = null;
    }
  }

  // Quick URL preview state support (?test=reject1|reject2|declined|accepted|invitation)
  const urlParams = new URLSearchParams(window.location.search);
  const testState = urlParams.get("test");
  if (testState === "reject1") {
    if (btnNo) btnNo.click();
  } else if (testState === "reject2") {
    if (btnNo) { btnNo.click(); btnNo.click(); }
  } else if (testState === "declined") {
    if (btnNo) { btnNo.click(); btnNo.click(); btnNo.click(); }
  } else if (testState === "accepted") {
    if (btnYes) btnYes.click();
  } else if (testState === "invitation") {
    if (sceneIntro) sceneIntro.classList.add("hidden");
    if (sceneInvitation) {
      sceneInvitation.classList.remove("hidden");
      sceneInvitation.style.opacity = "1";
      sceneInvitation.style.transform = "none";
    }
  }
});
