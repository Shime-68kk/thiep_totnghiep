/**
 * Cloudflare Pages Functions / API Proxy for Discord Webhook
 * Route: POST /api/rsvp
 */

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1550345469690126449/jW492IVOLjFQUUAsLb6We5KIAUJUkecnn8GcPvq9i5OxKZesSSIX2aTER_FegahHVvdN";

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function onRequestPost(context) {
  try {
    const payload = await context.request.json();

    const discordResponse = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return new Response(
      JSON.stringify({ ok: discordResponse.ok, status: discordResponse.status }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
