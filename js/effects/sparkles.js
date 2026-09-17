/**
 * Effect Module: Star Sparkles Particle Generator
 */

export function initStarSparkles(containerId = "particles-container", count = 35) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
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
