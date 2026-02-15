import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())


const modules: any[] = [
  {
    resolve: "@medusajs/medusa/auth",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/auth-emailpass",
          id: "emailpass",
          options: {
            // Options if needed
          }
        },
      ],
    },
  },
  // Cloudflare R2 File Storage for product images
  {
    resolve: "@medusajs/medusa/file",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/file-s3",
          id: "s3",
          options: {
            file_url: process.env.S3_FILE_URL,
            access_key_id: process.env.S3_ACCESS_KEY_ID,
            secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
            region: process.env.S3_REGION || "auto",
            bucket: process.env.S3_BUCKET || "fittinglab-media",
            endpoint: process.env.S3_ENDPOINT,
            additional_client_config: {
              forcePathStyle: true,
            },
          },
        },
      ],
    },
  },
];

if (process.env.REDIS_URL) {
  modules.push(
    {
      resolve: "@medusajs/event-bus-redis",
      key: Modules.EVENT_BUS,
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/workflow-engine-redis",
      key: Modules.WORKFLOW_ENGINE,
      options: {
        redis: {
          url: process.env.REDIS_URL,
        },
      },
    },
    {
      resolve: "@medusajs/cache-redis",
      key: Modules.CACHE,
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    }
  );
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    path: "/dashboard",
  },
  modules,
})
