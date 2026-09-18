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
            value: `**${chosenTime}** (Thứ Bảy, 27/09)`,
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

  try {
    // Attempt standard JSON POST request
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return response.ok;
  } catch (err) {
    console.warn("Standard Discord webhook fetch blocked, attempting no-cors fallback:", err);
    try {
      // Fallback for strict browser CORS: no-cors simple request
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (fallbackErr) {
      console.error("Discord notification failed completely:", fallbackErr);
      return false;
    }
  }
}
