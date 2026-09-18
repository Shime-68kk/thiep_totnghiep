/**
 * Effect Module: Canvas Confetti Cannon (Optimized for Mobile Performance)
 */

class ConfettiCannon {
  constructor(canvasId = "confetti-canvas") {
    this.canvas = document.getElementById(canvasId);
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.startTime = 0;
    this.maxDuration = 2200; // Hard max 2.2 seconds to prevent GPU drain

    if (this.canvas) {
      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();
      window.addEventListener("resize", () => this.resizeCanvas());
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.particles = [];
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  blast() {
    if (!this.canvas || !this.ctx) return;

    this.stop(); // Stop any ongoing loop before starting a new one
    this.resizeCanvas();
    this.startTime = performance.now();

    const isMobile = window.innerWidth <= 640;
    // Mobile: 38 particles (lightweight, zero lag), Desktop: 80 particles
    const totalParticles = isMobile ? 38 : 80;
    const colors = ["#f59e0b", "#fde047", "#3b82f6", "#60a5fa", "#ec4899", "#a855f7", "#ffffff"];

    this.particles = [];
    for (let i = 0; i < totalParticles; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 160,
        y: this.canvas.height / 2 + 30,
        vx: (Math.random() - 0.5) * (isMobile ? 12 : 15),
        vy: -Math.random() * (isMobile ? 14 : 17) - 7,
        size: Math.random() * 6 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.42,
        opacity: 1,
        shape: Math.random() > 0.35 ? "rect" : "circle"
      });
    }

    this.animate();
  }

  animate() {
    if (!this.ctx || !this.canvas) return;

    const elapsed = performance.now() - this.startTime;
    // Guarantee that loop terminates strictly after maxDuration
    if (elapsed > this.maxDuration) {
      this.stop();
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Global fade out after 1.4 seconds
    const globalAlphaMultiplier = elapsed > 1400 
      ? Math.max(0, 1 - (elapsed - 1400) / (this.maxDuration - 1400))
      : 1;

    let activeCount = 0;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;

      const currentAlpha = p.opacity * globalAlphaMultiplier;

      if (currentAlpha > 0.02 && p.y < this.canvas.height + 40) {
        activeCount++;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = currentAlpha;
        this.ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.restore();
      }
    }

    if (activeCount > 0 && elapsed < this.maxDuration) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.stop();
    }
  }
}

export default ConfettiCannon;
