/**
 * iOS Wheel Drum Time Picker Component
 * Authentic Apple Clock scroll-snap wheel with haptic feedback and momentum
 */

export class IOSTimePicker {
  constructor(options = {}) {
    this.container = options.container || document.getElementById("ios-time-picker");
    this.initialHour = options.initialHour || 15;
    this.initialMinute = options.initialMinute || 0;
    this.onTimeChange = options.onTimeChange || (() => {});

    this.hours = [14, 15, 16, 17];
    this.minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

    this.selectedHour = this.initialHour;
    this.selectedMinute = this.initialMinute;

    this.itemHeight = 44; // Standard iOS 44px item height

    this.hourDrum = null;
    this.minuteDrum = null;

    if (this.container) {
      this.init();
    }
  }

  init() {
    this.render();
    this.bindDrumScroll(this.hourDrum, this.hours, (val) => {
      this.selectedHour = val;
      this.onTimeChange(this.getTime());
    });
    this.bindDrumScroll(this.minuteDrum, this.minutes, (val) => {
      this.selectedMinute = val;
      this.onTimeChange(this.getTime());
    });

    // Set initial positions
    setTimeout(() => {
      this.setTime(this.selectedHour, this.selectedMinute, false);
    }, 50);
  }

  render() {
    this.container.innerHTML = `
      <div class="ios-picker-wrapper">
        <!-- Center Selection Highlight Lens -->
        <div class="picker-selection-lens"></div>

        <!-- Hours Drum Column -->
        <div class="picker-column">
          <div class="picker-drum" id="drum-hours" role="listbox" aria-label="Chọn giờ">
            <div class="picker-spacer"></div>
            ${this.hours.map(h => `<div class="picker-item" data-value="${h}" role="option">${h}</div>`).join("")}
            <div class="picker-spacer"></div>
          </div>
          <span class="picker-unit-label">Giờ</span>
        </div>

        <!-- Colon Separator -->
        <div class="picker-colon">:</div>

        <!-- Minutes Drum Column -->
        <div class="picker-column">
          <div class="picker-drum" id="drum-minutes" role="listbox" aria-label="Chọn phút">
            <div class="picker-spacer"></div>
            ${this.minutes.map(m => `<div class="picker-item" data-value="${m}" role="option">${m.toString().padStart(2, "0")}</div>`).join("")}
            <div class="picker-spacer"></div>
          </div>
          <span class="picker-unit-label">Phút</span>
        </div>
      </div>
    `;

    this.hourDrum = this.container.querySelector("#drum-hours");
    this.minuteDrum = this.container.querySelector("#drum-minutes");
  }

  bindDrumScroll(drumEl, valuesArray, onSelect) {
    if (!drumEl) return;

    let lastIndex = -1;
    let isTicking = false;

    const updateSelection = () => {
      const scrollTop = drumEl.scrollTop;
      const index = Math.round(scrollTop / this.itemHeight);
      const clampedIndex = Math.max(0, Math.min(valuesArray.length - 1, index));

      // Visual update of items (3D perspective scaling & opacity)
      const items = drumEl.querySelectorAll(".picker-item");
      items.forEach((item, i) => {
        const dist = Math.abs(i - clampedIndex);
        if (dist === 0) {
          item.classList.add("is-selected");
          item.style.transform = "scale(1.1) translateZ(0)";
          item.style.opacity = "1";
        } else if (dist === 1) {
          item.classList.remove("is-selected");
          item.style.transform = "scale(0.92) rotateX(" + (i < clampedIndex ? "22deg" : "-22deg") + ")";
          item.style.opacity = "0.62";
        } else {
          item.classList.remove("is-selected");
          item.style.transform = "scale(0.8) rotateX(" + (i < clampedIndex ? "38deg" : "-38deg") + ")";
          item.style.opacity = "0.28";
        }
      });

      // Haptic tick when active item changes
      if (clampedIndex !== lastIndex) {
        lastIndex = clampedIndex;
        if (navigator.vibrate) {
          try { navigator.vibrate(15); } catch (e) {}
        }
        onSelect(valuesArray[clampedIndex]);
      }
      isTicking = false;
    };

    drumEl.addEventListener("scroll", () => {
      if (!isTicking) {
        window.requestAnimationFrame(updateSelection);
        isTicking = true;
      }
    }, { passive: true });

    // Click on item to jump to it
    drumEl.addEventListener("click", (e) => {
      const item = e.target.closest(".picker-item");
      if (!item) return;
      const val = parseInt(item.dataset.value, 10);
      const idx = valuesArray.indexOf(val);
      if (idx !== -1) {
        drumEl.scrollTo({
          top: idx * this.itemHeight,
          behavior: "smooth"
        });
      }
    });

    // Mouse drag support for desktop
    let isDragging = false;
    let startY = 0;
    let startScrollTop = 0;

    drumEl.addEventListener("mousedown", (e) => {
      isDragging = true;
      startY = e.pageY;
      startScrollTop = drumEl.scrollTop;
      drumEl.style.scrollBehavior = "auto";
      drumEl.style.scrollSnapType = "none";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const deltaY = e.pageY - startY;
      drumEl.scrollTop = startScrollTop - deltaY;
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      drumEl.style.scrollSnapType = "y mandatory";
      drumEl.style.scrollBehavior = "smooth";
      const snappedIndex = Math.round(drumEl.scrollTop / this.itemHeight);
      drumEl.scrollTo({
        top: snappedIndex * this.itemHeight,
        behavior: "smooth"
      });
    });
  }

  setTime(hour, minute, smooth = true) {
    const hIdx = this.hours.indexOf(parseInt(hour, 10));
    const mIdx = this.minutes.indexOf(parseInt(minute, 10));

    if (hIdx !== -1) {
      this.selectedHour = this.hours[hIdx];
      if (this.hourDrum) {
        this.hourDrum.scrollTo({
          top: hIdx * this.itemHeight,
          behavior: smooth ? "smooth" : "auto"
        });
      }
    }

    if (mIdx !== -1) {
      this.selectedMinute = this.minutes[mIdx];
      if (this.minuteDrum) {
        this.minuteDrum.scrollTo({
          top: mIdx * this.itemHeight,
          behavior: smooth ? "smooth" : "auto"
        });
      }
    }
  }

  getTime() {
    const h = this.selectedHour.toString().padStart(2, "0");
    const m = this.selectedMinute.toString().padStart(2, "0");
    return {
      hour: h,
      minute: m,
      formatted: `${h}:${m}`
    };
  }
}
