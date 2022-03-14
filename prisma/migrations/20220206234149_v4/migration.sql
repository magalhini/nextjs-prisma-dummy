-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "refresh_token_expires_in" INTEGER;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
