export function getStripePrice(plan: string, interval: string) {
  return {
    CORE: {
      MONTHLY: 409,
      SEMIANNUAL:327,
      ANNUAL: 266
    },
    GROWTH: {
      MONTHLY: 582,
      SEMIANNUAL: 466,
      ANNUAL: 378
    },
    PLUS: {
      MONTHLY: 820,
      SEMIANNUAL: 656,
      ANNUAL: 533
    },
  }[plan][interval];
}
