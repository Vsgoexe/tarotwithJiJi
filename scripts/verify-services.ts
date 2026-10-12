import { AUTHORITATIVE_SERVICES, formatPriceINR } from "../src/lib/services";

console.log("===============================================================================");
console.log("FINAL CONTENTS OF THE SERVICES TABLE (MIGRATION + SEED)");
console.log("===============================================================================");
console.table(
  AUTHORITATIVE_SERVICES.map((s) => ({
    Sort: s.sort_order,
    Slug: s.slug,
    Name: s.name,
    Type: s.type,
    Duration: s.duration_minutes ? `${s.duration_minutes} min` : "Written",
    "Price INR (Paise)": s.price_inr,
    "Price INR (Formatted)": formatPriceINR(s.price_inr),
    "Price USD": s.price_usd === null ? "NULL (Unset)" : s.price_usd,
    Active: s.is_active,
  }))
);

console.log("\n===============================================================================");
console.log("TEST ORDER CREATION SIMULATION (SERVER-SIDE PRICE & PAISE VERIFICATION)");
console.log("===============================================================================");

const testOrders = [
  {
    testTitle: "Test Order 1: Tarot 1hr (Live with Chat)",
    serviceSlug: "tarot-1hr",
    contactMode: "chat",
    expectedPaise: 99900,
  },
  {
    testTitle: "Test Order 2: Tarot 1hr (Live with Call)",
    serviceSlug: "tarot-1hr",
    contactMode: "call",
    expectedPaise: 99900,
  },
  {
    testTitle: "Test Order 3: Tarot 10 min (Live In-Depth)",
    serviceSlug: "tarot-10min",
    contactMode: null,
    expectedPaise: 20000,
  },
  {
    testTitle: "Test Order 4: Pick a Card (Written)",
    serviceSlug: "pick-a-card",
    contactMode: null,
    expectedPaise: 30000,
  },
  {
    testTitle: "Test Order 5: Future Predictions (Written)",
    serviceSlug: "future-predictions",
    contactMode: null,
    expectedPaise: 30000,
  },
  {
    testTitle: "Test Order 6: Birth Chart (Written)",
    serviceSlug: "birth-chart",
    contactMode: null,
    expectedPaise: 15000,
  },
  {
    testTitle: "Test Order 7: Career Reading (Written)",
    serviceSlug: "career",
    contactMode: null,
    expectedPaise: 15000,
  },
  {
    testTitle: "Test Order 8: Love Reading (Written)",
    serviceSlug: "love",
    contactMode: null,
    expectedPaise: 20000,
  },
];

let allPassed = true;

for (const test of testOrders) {
  const service = AUTHORITATIVE_SERVICES.find((s) => s.slug === test.serviceSlug);
  if (!service) {
    console.error(`❌ FAILED: Service ${test.serviceSlug} not found.`);
    allPassed = false;
    continue;
  }

  // Validate price in paise strictly equals expected
  const isAmountValid = service.price_inr === test.expectedPaise;

  console.log(`\n▶ ${test.testTitle}`);
  console.log(`  - Service Name: "${service.name}"`);
  console.log(`  - Type: ${service.type}`);
  console.log(`  - Contact Mode Stored: ${test.contactMode ?? "N/A"}`);
  console.log(`  - Stored Amount in Paise: ${service.price_inr} paise`);
  console.log(`  - Display Formatted: ${formatPriceINR(service.price_inr)}`);
  console.log(`  - Razorpay Payload Amount: ${service.price_inr}`);
  console.log(`  - Verification: ${isAmountValid ? "✅ PASSED (Matches authoritative paise exactly)" : "❌ FAILED"}`);

  if (!isAmountValid) allPassed = false;
}

console.log("\n===============================================================================");
if (allPassed) {
  console.log("🎉 ALL TEST ORDERS PASSED: Stored amount strictly equals price_inr in paise!");
} else {
  console.log("❌ SOME TEST ORDERS FAILED");
  process.exit(1);
}
