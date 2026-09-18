/**
 * Discord Webhook Notification Service
 * Sends embedded notification when guest RSVPs with their name and chosen time
 */

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1550345469690126449/jW492IVOLjFQUUAsLb6We5KIAUJUkecnn8GcPvq9i5OxKZesSSIX2aTER_FegahHVvdN";

/**
 * Safe fetch with strict timeout to prevent mobile network hang (e.g. ISP packet drops)
 */
function fetchWithTimeout(url, options = {}, timeoutMs = 2500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, {
    ...options,
    signal: controller.signal
  }).finally(() => {
    clearTimeout(timeoutId);
  });
}

export async function sendDiscordNotification(guestName, chosenTime) {
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const deviceType = isMobile ? "📱 Điện thoại (Mobile)" : "💻 Máy tính (Desktop)";
  const timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

  const payload = {
    username: "🎓 Thiệp Tốt Nghiệp - Trần Tùng Lâm",
    avatar_url: "https://cdn-icons-png.flaticon.com/512/3135/3135810.png",
    embeds: [
      {
        title: "🎉 CÓ KHÁCH XÁC NHẬN ĐẾN DỰ LỄ TỐT NGHIỆP!",
        description: `Bạn **${guestName}** vừa xác nhận tham gia lễ tốt nghiệp cùng Trần Tùng Lâm!`,
        color: 0xD4AF37, // Luxury Gold
        fields: [
          {
            name: "👤 Khách mời",
            value: `**${guestName}**`,
            inline: true
          },
          {
            name: "⏰ Giờ hẹn đến",
            value: `**${chosenTime}** (Thứ Bảy, 27/09/2026)`,
            inline: true
          },
          {
            name: "📱 Thiết bị",
            value: deviceType,
            inline: true
          },
          {
            name: "📍 Địa điểm",
            value: "Hội trường C2 - Đại học Bách Khoa Hà Nội",
            inline: false
          },
          {
            name: "🕒 Thời gian gửi",
            value: timestamp,
            inline: false
          }
        ],
        footer: {
          text: "Hệ thống thiệp mời tương tác • Trần Tùng Lâm 🎓"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  // Tier 1: Direct client-side JSON POST with standard CORS (Timeout 2.5s)
  try {
    const directResp = await fetchWithTimeout(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }, 2500);
    if (directResp.ok) {
      console.log("✅ Discord notification delivered directly via standard fetch");
      return true;
    }
  } catch (directErr) {
    // Proceed to Tier 3
  }

  // Tier 3: FormData in mode: 'no-cors' (CORS-safelisted simple request, Discord accepts payload_json)
  try {
    const formData = new FormData();
    formData.append("payload_json", JSON.stringify(payload));
    await fetchWithTimeout(DISCORD_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    }, 2500);
    console.log("✅ Discord notification delivered via FormData no-cors fallback");
    return true;
  } catch (formDataErr) {
    // Proceed to Tier 4
  }

  // Tier 4: Background navigator.sendBeacon (Instant non-blocking OS network pool)
  try {
    if (typeof navigator.sendBeacon === "function") {
      const beaconData = new FormData();
      beaconData.append("payload_json", JSON.stringify(payload));
      const queued = navigator.sendBeacon(DISCORD_WEBHOOK_URL, beaconData);
      if (queued) {
        console.log("✅ Discord notification enqueued via navigator.sendBeacon");
        return true;
      }
    }
  } catch (beaconErr) {
    console.warn("All Discord delivery strategies finished:", beaconErr);
  }

  return false;
}
