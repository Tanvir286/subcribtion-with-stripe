export default () => ({
  app: {
    name: process.env.APP_NAME,
    key: process.env.APP_KEY,
    url: process.env.APP_URL,
    client_app_url: process.env.CLIENT_APP_URL,
    port: parseInt(process.env.PORT, 10) || 3000,
  },

  fileSystems: {
    public: {},
    s3: {
      driver: 's3',
      key: process.env.AWS_ACCESS_KEY_ID,
      secret: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_DEFAULT_REGION,
      bucket: process.env.AWS_BUCKET,
      url: process.env.AWS_URL,
      endpoint: process.env.AWS_ENDPOINT,
    },
    gcs: {
      driver: 'gcs',
      projectId: process.env.GCP_PROJECT_ID,
      keyFile: process.env.GCP_KEY_FILE,
      apiEndpoint: process.env.GCP_API_ENDPOINT,
      bucket: process.env.GCP_BUCKET,
    },
  },

  database: {
    url: String(process.env.DATABASE_URL),
  },

  redis: {
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD || '',
    port: process.env.REDIS_PORT,
  },

  security: {
    salt: 10,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: process.env.JWT_EXPIRY,
  },

  mail: {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 587,
    user: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM_ADDRESS,
  },

  auth: {
    google: {
      app_id: process.env.GOOGLE_APP_ID,
      app_secret: process.env.GOOGLE_APP_SECRET,
      callback: process.env.GOOGLE_CALLBACK_URL,
    },
  },

  subscription: {
    trialDays: parseInt(process.env.SUBSCRIPTION_TRIAL_DAYS, 10) || 14,
    gracePeriodDays: parseInt(process.env.SUBSCRIPTION_GRACE_PERIOD_DAYS, 10) || 7,
    plans: {
      core: {
        name: 'Core',
        features: {
          maxVideos: parseInt(process.env.SUBSCRIPTION_CORE_MAX_VIDEOS, 10) || 10,
          maxStorage: parseInt(process.env.SUBSCRIPTION_CORE_MAX_STORAGE_GB, 10) || 50,
          supportLevel: process.env.SUBSCRIPTION_CORE_SUPPORT_LEVEL || 'basic',
        },
      },
      growth: {
        name: 'Growth',
        features: {
          maxVideos: parseInt(process.env.SUBSCRIPTION_GROWTH_MAX_VIDEOS, 10) || 50,
          maxStorage: parseInt(process.env.SUBSCRIPTION_GROWTH_MAX_STORAGE_GB, 10) || 200,
          supportLevel: process.env.SUBSCRIPTION_GROWTH_SUPPORT_LEVEL || 'priority',
        },
      },
      plus: {
        name: 'Plus',
        features: {
          maxVideos: parseInt(process.env.SUBSCRIPTION_PLUS_MAX_VIDEOS, 10) || -1, // -1 for unlimited
          maxStorage: parseInt(process.env.SUBSCRIPTION_PLUS_MAX_STORAGE_GB, 10) || 1000,
          supportLevel: process.env.SUBSCRIPTION_PLUS_SUPPORT_LEVEL || 'premium',
        },
      },
    },
  },

  payment: {
    stripe: {
      secret_key: process.env.STRIPE_SECRET_KEY,
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
      prices: {
        core: {
          monthly: process.env.STRIPE_PRICE_CORE_MONTHLY,
          semiannual: process.env.STRIPE_PRICE_CORE_SEMIANNUAL,
          annual: process.env.STRIPE_PRICE_CORE_ANNUAL,
        },
        growth: {
          monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY,
          semiannual: process.env.STRIPE_PRICE_GROWTH_SEMIANNUAL,
          annual: process.env.STRIPE_PRICE_GROWTH_ANNUAL,
        },
        plus: {
          monthly: process.env.STRIPE_PRICE_PLUS_MONTHLY,
          semiannual: process.env.STRIPE_PRICE_PLUS_SEMIANNUAL,
          annual: process.env.STRIPE_PRICE_PLUS_ANNUAL,
        },
      },
    },
    paypal: {
      client_id: process.env.PAYPAL_CLIENT_ID,
      secret: process.env.PAYPAL_SECRET,
      api: process.env.PAYPAL_API,
    },
  },

  /**
   * Storage directory
   */
  storageUrl: {
    rootUrl: './public/storage',
    rootUrlPublic: '/storage',
    // storage directory
    package: '/package',
    destination: '/destination',
    blog: '/blog',
    avatar: '/avatar',
    portfolio: '/portfolio',
    attachment: '/attachment',
    websiteInfo: '/website-info',
    // chat
    jobPhoto: 'job-photo/',
  },

  defaultUser: {
    system: {
      username: process.env.SYSTEM_USERNAME,
      email: process.env.SYSTEM_EMAIL,
      password: process.env.SYSTEM_PASSWORD,
    },
  },
});
