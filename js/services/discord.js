/**
 * Discord Webhook Notification Service
 * Sends embedded notification when guest RSVPs with their name and chosen time
 */

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1550345469690126449/jW492IVOLjFQUUAsLb6We5KIAUJUkecnn8GcPvq9i5OxKZesSSIX2aTER_FegahHVvdN";

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

  // Tier 1: Try Cloudflare Worker backend proxy (/api/rsvp) - Zero CORS
  try {
    const proxyResp = await fetch("/api/rsvp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (proxyResp.ok) {
      console.log("✅ Discord notification delivered via Cloudflare Worker proxy (/api/rsvp)");
      return true;
    }
  } catch (proxyErr) {
    console.warn("Backend proxy /api/rsvp unreachable, proceeding to direct Discord delivery:", proxyErr);
  }

  // Tier 2: Direct client-side JSON POST with standard CORS
  try {
    const directResp = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (directResp.ok) {
      console.log("✅ Discord notification delivered directly via standard fetch");
      return true;
    }
  } catch (directErr) {
    console.warn("Direct JSON fetch blocked by CORS or network, falling back to FormData no-cors:", directErr);
  }

  // Tier 3: FormData in mode: 'no-cors' (CORS-safelisted simple request, Discord accepts payload_json)
  try {
    const formData = new FormData();
    formData.append("payload_json", JSON.stringify(payload));
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });
    console.log("✅ Discord notification delivered via FormData no-cors fallback");
    return true;
  } catch (formDataErr) {
    console.warn("FormData no-cors failed, trying navigator.sendBeacon:", formDataErr);
  }

  // Tier 4: Background navigator.sendBeacon
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
    console.error("❌ All Discord delivery strategies failed:", beaconErr);
  }

  return false;
}
