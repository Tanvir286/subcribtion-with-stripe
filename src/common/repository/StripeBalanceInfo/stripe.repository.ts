export function getStripePrice(plan: string, interval: string) {
  return {
    CORE: {
      MONTHLY: process.env.STRIPE_PRICE_CORE_MONTHLY,
      SEMIANNUAL: process.env.STRIPE_PRICE_CORE_SEMIANNUAL,
      ANNUAL: process.env.STRIPE_PRICE_CORE_ANNUAL,
    },
    GROWTH: {
      MONTHLY: process.env.STRIPE_PRICE_GROWTH_MONTHLY,
      SEMIANNUAL: process.env.STRIPE_PRICE_GROWTH_SEMIANNUAL,
      ANNUAL: process.env.STRIPE_PRICE_GROWTH_ANNUAL,
    },
    PLUS: {
      MONTHLY: process.env.STRIPE_PRICE_PLUS_MONTHLY,
      SEMIANNUAL: process.env.STRIPE_PRICE_PLUS_SEMIANNUAL,
      ANNUAL: process.env.STRIPE_PRICE_PLUS_ANNUAL,
    },
  }[plan][interval];
}
