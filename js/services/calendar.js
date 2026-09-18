/**
 * Calendar Integration Service
 * Generates Google Calendar URLs and downloadable Apple/Outlook .ics calendar files
 */

const EVENT_CONFIG = {
  title: "Lễ Tốt Nghiệp - Trần Tùng Lâm 🎓✨",
  location: "Hội trường C2 - Đại học Bách Khoa Hà Nội",
  year: 2026,
  month: "09",
  day: "27"
};

function formatTimeParts(chosenTime = "15:00") {
  const [hourStr = "15", minStr = "00"] = chosenTime.split(":");
  const h = hourStr.padStart(2, "0");
  const m = minStr.padStart(2, "0");
  return { h, m };
}

/**
 * 1. Generate Google Calendar Direct Event Link
 */
export function openGoogleCalendar({ guestName = "Bạn", chosenTime = "15:00" }) {
  const { h, m } = formatTimeParts(chosenTime);
  const startStr = `${EVENT_CONFIG.year}${EVENT_CONFIG.month}${EVENT_CONFIG.day}T${h}${m}00`;
  const endStr = `${EVENT_CONFIG.year}${EVENT_CONFIG.month}${EVENT_CONFIG.day}T170000`;

  const details = `Thân mời bạn ${guestName} đến tham dự Lễ Tốt Nghiệp của Trần Tùng Lâm (Tân Cử Nhân / Kỹ Sư)!\n\nKhung giờ hẹn đón tiếp: ${chosenTime} - Thứ Bảy, 27/09/2026.\nĐịa điểm: ${EVENT_CONFIG.location}.\nRất mong được đón tiếp và chụp ảnh kỷ niệm cùng bạn! 💕✨`;

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT_CONFIG.title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(EVENT_CONFIG.location)}&ctz=Asia/Ho_Chi_Minh`;

  window.open(url, "_blank");
}

/**
 * 2. Generate and Download Apple Calendar (.ics) file with 1-hour alarm reminder
 */
export function downloadAppleCalendarIcs({ guestName = "Bạn", chosenTime = "15:00" }) {
  const { h, m } = formatTimeParts(chosenTime);
  const dtStart = `${EVENT_CONFIG.year}${EVENT_CONFIG.month}${EVENT_CONFIG.day}T${h}${m}00`;
  const dtEnd = `${EVENT_CONFIG.year}${EVENT_CONFIG.month}${EVENT_CONFIG.day}T170000`;
  const nowUtc = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const description = `Thân mời bạn ${guestName} đến tham dự Lễ Tốt Nghiệp của Trần Tùng Lâm (Tân Cử Nhân / Kỹ Sư)!\\nKhung giờ hẹn: ${chosenTime} - Thứ Bảy, 27/09/2026.\\nĐịa điểm: ${EVENT_CONFIG.location}.`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tran Tung Lam//Graduation Invitation//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Ho_Chi_Minh",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0700",
    "TZOFFSETTO:+0700",
    "TZNAME:ICT",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:graduation-tran-tung-lam-${Date.now()}@thiep-totnghiep`,
    `DTSTAMP:${nowUtc}`,
    `DTSTART;TZID=Asia/Ho_Chi_Minh:${dtStart}`,
    `DTEND;TZID=Asia/Ho_Chi_Minh:${dtEnd}`,
    `SUMMARY:${EVENT_CONFIG.title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${EVENT_CONFIG.location}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Nhắc nhở: Lễ Tốt Nghiệp Trần Tùng Lâm sẽ diễn ra sau 1 tiếng nữa!",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = "le-tot-nghiep-tran-tung-lam.ics";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(downloadLink.href);
}
