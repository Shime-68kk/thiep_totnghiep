/**
 * Google Sheets Auto-Sync Service
 * Syncs guest RSVP directly into Trần Tùng Lâm's private Google Sheet
 * Auto-classifies into 4 big columns:
 * - 14:00 - 15:00
 * - 15:00 - 16:00
 * - 16:00 - 17:00
 * - Sau 17:00 / Khác
 */

const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyjqU4rzWHS5SLXJhNPXCbevOiZX9eXf4bvyPWhLWjuLmBzM85Z3dilYrh3cy9tQ2f8/exec";

/**
 * Dispatches guest name & chosen time to Google Sheet
 * Uses sendBeacon and mode: 'no-cors' fetch with text/plain to avoid CORS preflight delays
 */
export async function sendGoogleSheetsNotification(guestName, chosenTime) {
  try {
    const payload = JSON.stringify({
      name: guestName,
      time: chosenTime
    });

    // Method 1: navigator.sendBeacon (instant background OS delivery)
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "text/plain" });
      const sent = navigator.sendBeacon(GOOGLE_SHEETS_WEBHOOK_URL, blob);
      if (sent) {
        console.log("✅ Google Sheets RSVP dispatched via sendBeacon");
        return true;
      }
    }

    // Method 2: Fallback fetch with text/plain & mode: 'no-cors'
    fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain"
      },
      body: payload
    }).then(() => {
      console.log("✅ Google Sheets RSVP dispatched via fetch");
    }).catch((err) => {
      console.warn("⚠️ Google Sheets dispatch warning:", err);
    });

    return true;
  } catch (err) {
    console.warn("⚠️ Google Sheets dispatch error:", err);
    return false;
  }
}
