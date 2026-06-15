type SmsPayload = {
  to: string;
  body: string;
};

export async function sendSms({ to, body }: SmsPayload) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !from) {
    console.log("\n📱 SMS (dev mode — no Twilio configured)");
    console.log(`   To: ${to}`);
    console.log(`   Body: ${body}\n`);
    return { success: true, dev: true };
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const params = new URLSearchParams({ To: to, From: from, Body: body });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SMS delivery failed: ${text.slice(0, 200)}`);
  }

  return { success: true, dev: false };
}
