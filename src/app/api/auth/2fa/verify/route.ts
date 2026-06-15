import { NextResponse } from "next/server";

import {

  clearPending2FA,

  getPending2FAUserId,

} from "@/lib/auth";

import { logAudit } from "@/lib/audit";

import { twoFactorVerifySchema } from "@/lib/validations";

import {

  getAvailable2FAMethods,

  getUserTwoFactorSecret,

  verifyTotpCode,

} from "@/lib/security/2fa";

import { verifyOtpCode } from "@/lib/security/2fa-otp";

import { finalize2FALogin } from "@/lib/security/login";

import { db } from "@/lib/db";



export async function POST(request: Request) {

  const userId = await getPending2FAUserId();

  if (!userId) {

    return NextResponse.json({ error: "No pending 2FA session" }, { status: 401 });

  }



  const body = await request.json();

  const parsed = twoFactorVerifySchema.safeParse(body);

  if (!parsed.success) {

    return NextResponse.json(

      { error: parsed.error.errors[0].message },

      { status: 400 }

    );

  }



  const user = await db.user.findUnique({

    where: { id: userId },

    select: {

      id: true,

      email: true,

      name: true,

      twoFactorEnabled: true,

      twoFactorSecret: true,

      twoFactorEmailEnabled: true,

      twoFactorAltEmailVerified: true,

      twoFactorSmsEnabled: true,

      twoFactorAltPhoneVerified: true,

    },

  });



  if (!user) {

    await clearPending2FA();

    return NextResponse.json({ error: "User not found" }, { status: 404 });

  }



  const { code, method } = parsed.data;

  const methods = getAvailable2FAMethods(user);



  if (!methods.includes(method)) {

    return NextResponse.json(

      { error: "This verification method is not available" },

      { status: 400 }

    );

  }



  let verified = false;



  if (method === "authenticator") {

    const secret = await getUserTwoFactorSecret(userId);

    verified = Boolean(secret && verifyTotpCode(secret, code));

  } else if (method === "email") {

    verified = await verifyOtpCode(userId, "EMAIL", code);

  } else {

    verified = await verifyOtpCode(userId, "SMS", code);

  }



  if (!verified) {

    await logAudit({

      action: "LOGIN_FAILED",

      userId: user.id,

      userEmail: user.email,

      userName: user.name,

      metadata: { reason: "invalid_2fa", method },

      request,

    });

    return NextResponse.json({ error: "Invalid verification code" }, { status: 401 });

  }



  await clearPending2FA();

  const result = await finalize2FALogin(userId, request);



  if (!result || result.status === "ip_blocked") {

    return NextResponse.json(

      { error: "Access denied from this IP address" },

      { status: 403 }

    );

  }



  if (result.status === "device_revoked") {

    return NextResponse.json(

      { error: "This device has been revoked" },

      { status: 403 }

    );

  }



  await logAudit({

    action: "TWO_FACTOR_VERIFIED",

    userId: user.id,

    userEmail: user.email,

    userName: user.name,

    metadata: { method },

    request,

  });



  return NextResponse.json({ success: true });

}

