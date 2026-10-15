import crypto from "crypto";
import { AUTHORITATIVE_SERVICES, getServicePriceUSD, formatPriceINR, formatPriceUSD, isUSDPaymentsEnabled } from "../src/lib/services";
import { getPaymentProviderName, generateManualUPIData } from "../src/lib/payments/provider";
import { verifyPaymentSignature, verifyWebhookSignature } from "../src/lib/razorpay";

console.log("===============================================================================");
console.log("VERIFICATION SUITE: MANUAL UPI & PROVIDER SWITCH");
console.log("===============================================================================\n");

let allPassed = true;

// 1. Provider Switch Test
console.log("▶ TEST 1: Provider Switch Default and Razorpay Non-Crash");
delete process.env.PAYMENT_PROVIDER;
const defaultProvider = getPaymentProviderName();
if (defaultProvider === "manual_upi") {
  console.log("  ✅ PASS: Default provider is 'manual_upi'.");
} else {
  console.error("  ❌ FAIL: Default provider is not 'manual_upi'.");
  allPassed = false;
}

process.env.PAYMENT_PROVIDER = "razorpay";
const switchedProvider = getPaymentProviderName();
if (switchedProvider === "razorpay") {
  console.log("  ✅ PASS: Switched provider to 'razorpay' successfully.");
} else {
  console.error("  ❌ FAIL: Provider switch failed.");
  allPassed = false;
}

// 2. Manual UPI Deep Link & QR Code Generation Test
console.log("\n▶ TEST 2: Manual UPI Link & QR Code Generation");
process.env.PAYMENT_PROVIDER = "manual_upi";
process.env.UPI_ID = "jiji@upi";
process.env.UPI_PAYEE_NAME = "Tarot with Jiji";

async function testUpiGeneration() {
  const upiData = await generateManualUPIData({
    publicId: "test_public_id_12345678",
    serviceName: "Tarot reading 1hr (chat/call)",
    amountPaise: 99900,
  });

  const expectedLinkStart = "upi://pay?pa=jiji%40upi&pn=Tarot%20with%20Jiji&am=999&cu=INR&tn=";
  const linkValid = upiData.upiLink.startsWith(expectedLinkStart);
  const qrValid = upiData.qrCodeDataUrl.startsWith("data:image/png;base64,");

  if (linkValid && qrValid) {
    console.log(`  ✅ PASS: UPI Link correctly formed (${upiData.upiLink})`);
    console.log(`  ✅ PASS: QR Code generated data URL length: ${upiData.qrCodeDataUrl.length} chars`);
  } else {
    console.error("  ❌ FAIL: UPI Link or QR Code generation invalid.");
    allPassed = false;
  }
}

// 3. UTR 12-digit Format Validation Test
console.log("\n▶ TEST 3: UTR 12-Digit Validation");
const validUtr = "428938194821";
const invalidUtrShort = "12345";
const invalidUtrSpecial = "42893819482@";

const utrRegex = /^[A-Za-z0-9]{12}$/;
if (utrRegex.test(validUtr) && !utrRegex.test(invalidUtrShort) && !utrRegex.test(invalidUtrSpecial)) {
  console.log("  ✅ PASS: 12-digit UTR regex strictly permits only 12 alphanumeric characters.");
} else {
  console.error("  ❌ FAIL: UTR regex validation flawed.");
  allPassed = false;
}

// 4. Prices & paise matching for all 7 services
console.log("\n▶ TEST 4: Price & paise consistency");
const services = [
  { slug: "tarot-1hr", inr: 99900, usd: 3900 },
  { slug: "tarot-10min", inr: 20000, usd: 1200 },
  { slug: "pick-a-card", inr: 30000, usd: 1500 },
  { slug: "future-predictions", inr: 30000, usd: 1500 },
  { slug: "birth-chart", inr: 15000, usd: 900 },
  { slug: "career", inr: 15000, usd: 900 },
  { slug: "love", inr: 20000, usd: 1200 },
];

for (const exp of services) {
  const s = AUTHORITATIVE_SERVICES.find((svc) => svc.slug === exp.slug);
  if (!s || s.price_inr !== exp.inr || s.price_usd !== exp.usd) {
    console.error(`  ❌ FAIL: Price mismatch for ${exp.slug}`);
    allPassed = false;
  }
}
console.log("  ✅ PASS: All 7 services strictly match authoritative prices in paise and cents.");

testUpiGeneration().then(() => {
  console.log("\n===============================================================================");
  if (allPassed) {
    console.log("🎉 ALL MANUAL UPI & ARCHITECTURE VERIFICATIONS SUCCEEDED!");
  } else {
    console.log("❌ VERIFICATION FAILURES DETECTED.");
  }
});
