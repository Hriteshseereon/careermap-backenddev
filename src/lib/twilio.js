// lib/twilio.js
import twilio from "twilio";

// The client is created on first use so the server can boot without Twilio
// credentials when OTP_DELIVERY=response (the default).
let client = null;
const getClient = () => {
  if (!client) {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return client;
};

export const sendOTPViaTwilio = async (mobile) => {
  return getClient().verify.v2
    .services(process.env.TWILIO_VERIFY_SID)
    .verifications.create({
      to: mobile,
      channel: "sms",
    });
};

export const verifyOTPViaTwilio = async (mobile, code) => {
  try {
    const res = await getClient().verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: mobile,
        code,
      });

    return { valid: res.status === "approved", status: res.status };
  } catch (error) {
    // Error 20404: resource not found = expired, already used, or too many attempts
    if (error.code === 20404) {
      return {
        valid: false,
        status: "expired_or_used",
        message: "OTP has expired or was already used. Please request a new one.",
      };
    }
    throw error; // re-throw unexpected errors
  }
};
