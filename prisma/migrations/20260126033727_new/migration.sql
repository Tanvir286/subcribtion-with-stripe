-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'CLIENT', 'EDITOR');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "type" "UserType" DEFAULT 'CLIENT';
