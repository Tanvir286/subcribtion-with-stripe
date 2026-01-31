/*
  Warnings:

  - You are about to drop the column `trial_ends_at` on the `subscriptions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TrialStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELED');

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "trial_ends_at";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_trial" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "free_trials" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "plan" "PlanType" NOT NULL,
    "interval" "BillingInterval" NOT NULL,
    "status" "TrialStatus" NOT NULL,
    "current_period_start" TIMESTAMP(3) NOT NULL,
    "current_period_end" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "free_trials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "free_trials" ADD CONSTRAINT "free_trials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
