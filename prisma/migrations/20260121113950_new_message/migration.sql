/*
  Warnings:

  - You are about to drop the column `message` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `read_at` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `receiver_id` on the `messages` table. All the data in the column will be lost.
  - The `status` column on the `messages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ');

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "message",
DROP COLUMN "read_at",
DROP COLUMN "receiver_id",
ADD COLUMN     "attachments" TEXT,
ADD COLUMN     "sent_at" TIMESTAMP(3),
ADD COLUMN     "text" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "MessageType" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "MessageStatus";

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
