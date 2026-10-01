const recipient = "careers@nerdy.com";

async function sendWithResend(message) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.BENCH_FROM_EMAIL || "Nerdy Careers <careers@nerdy.com>",
      to: [recipient],
      subject: "Product Engineering bench submission",
      text: message,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend email failed: ${detail}`);
  }

  return true;
}

async function sendWithWebhook(message) {
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL;

  if (!webhookUrl) {
    return false;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: recipient,
      subject: "Product Engineering bench submission",
      message,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Email webhook failed: ${detail}`);
  }

  return true;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const message = String(body.message || "").trim();

    if (message.length < 20) {
      return Response.json(
        { error: "Please include a little more detail about what you built." },
        { status: 400 },
      );
    }

    const delivered =
      (await sendWithResend(message)) || (await sendWithWebhook(message));

    if (!delivered) {
      console.info("Bench submission captured for careers@nerdy.com", {
        recipient,
        message,
      });
    }

    return Response.json({ ok: true, deliveredTo: recipient });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Unable to send right now. Please try again shortly." },
      { status: 500 },
    );
  }
}
