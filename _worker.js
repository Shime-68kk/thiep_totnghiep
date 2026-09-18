/**
 * Cloudflare Worker Entry Point (Workers with Assets / Advanced Mode)
 * Proxies POST /api/rsvp to Discord Webhook and falls back to static assets
 */

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1550345469690126449/jW492IVOLjFQUUAsLb6We5KIAUJUkecnn8GcPvq9i5OxKZesSSIX2aTER_FegahHVvdN";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. API Route: /api/rsvp
    if (url.pathname === "/api/rsvp") {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }

      if (request.method === "POST") {
        try {
          const body = await request.json();

          const discordRes = await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          return new Response(
            JSON.stringify({ ok: discordRes.ok, status: discordRes.status }),
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
    }

    // 2. Default: Serve static assets
    if (env && env.ASSETS && typeof env.ASSETS.fetch === "function") {
      return env.ASSETS.fetch(request);
    }

    // If running in environment without ASSETS binding, pass through
    return fetch(request);
  },
};
