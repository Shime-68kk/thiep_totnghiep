/**
 * Background Music Controller (BGM)
 * Handles audio playback, vinyl spin animation, and browser autoplay policies
 */

export class AudioManager {
  constructor(btnId = "btn-music-toggle", audioId = "bgm-audio") {
    this.btn = document.getElementById(btnId);
    this.audio = document.getElementById(audioId);
    this.isPlaying = false;
    this.userManuallyPaused = false;

    if (!this.btn || !this.audio) return;

    this.init();
  }

  init() {
    this.audio.volume = 0.45;

    // Toggle on button click
    this.btn.addEventListener("click", (e) => {
      this.togglePlay();
    });

    // Sync state with audio events
    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.btn.classList.add("playing");
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.btn.classList.remove("playing");
    });

    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
      this.btn.classList.remove("playing");
    });
  }

  togglePlay() {
    if (this.isPlaying) {
      this.userManuallyPaused = true;
      this.pause();
    } else {
      this.userManuallyPaused = false;
      this.play();
    }
  }

  play() {
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.btn.classList.add("playing");
        })
        .catch(() => {
          // Autoplay was prevented by browser policy
          this.isPlaying = false;
          this.btn.classList.remove("playing");
        });
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.btn.classList.remove("playing");
  }
}
