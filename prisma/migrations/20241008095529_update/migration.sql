-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "AgreeToContentPolicy" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "AgreeToTermsPolicy" BOOLEAN NOT NULL DEFAULT true;
