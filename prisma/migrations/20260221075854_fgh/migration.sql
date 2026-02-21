-- CreateEnum
CREATE TYPE "COMType" AS ENUM ('LAUNCH', 'CORE', 'CREATOR', 'STUDIO');

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "type" "COMType" NOT NULL DEFAULT 'LAUNCH',
    "per_video" INTEGER NOT NULL DEFAULT 0,
    "unlimited_videos" BOOLEAN NOT NULL DEFAULT false,
    "branding" BOOLEAN NOT NULL DEFAULT false,
    "custom_thumbnail" BOOLEAN NOT NULL DEFAULT false,
    "seo_optimization" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);
