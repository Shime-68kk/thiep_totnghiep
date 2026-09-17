/**
 * Effect Module: Canvas Confetti Cannon
 */

class ConfettiCannon {
  constructor(canvasId = "confetti-canvas") {
    this.canvas = document.getElementById(canvasId);
    this.ctx = null;
    this.particles = [];
    this.animationId = null;

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

  blast() {
    if (!this.canvas || !this.ctx) return;

    this.particles = [];
    const colors = ["#f59e0b", "#fde047", "#3b82f6", "#60a5fa", "#ec4899", "#a855f7", "#ffffff"];
    const totalParticles = 140;

    for (let i = 0; i < totalParticles; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: this.canvas.height / 2 + 50,
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

    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.animate();
  }

  animate() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let activeCount = 0;

    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;

      if (p.y > this.canvas.height * 0.4) {
        p.opacity -= 0.007;
      }

      if (p.opacity > 0 && p.y < this.canvas.height + 50) {
        activeCount++;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.opacity);
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

    if (activeCount > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.animationId = null;
    }
  }
}

export default ConfettiCannon;
