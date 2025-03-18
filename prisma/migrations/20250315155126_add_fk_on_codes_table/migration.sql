/*
  Warnings:

  - You are about to drop the column `account_id` on the `codes` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "codes" DROP COLUMN "account_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "codes" ADD CONSTRAINT "codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
