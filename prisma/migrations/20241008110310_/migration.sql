/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Artist` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `Artist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "coverImage",
DROP COLUMN "profileImage",
ADD COLUMN     "coverImageId" TEXT,
ADD COLUMN     "profileImageId" TEXT;

-- CreateTable
CREATE TABLE "_MediaUploadArtists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MediaUploadArtists_AB_unique" ON "_MediaUploadArtists"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaUploadArtists_B_index" ON "_MediaUploadArtists"("B");

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_profileImageId_fkey" FOREIGN KEY ("profileImageId") REFERENCES "MediaUpload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "MediaUpload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaUploadArtists" ADD CONSTRAINT "_MediaUploadArtists_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaUploadArtists" ADD CONSTRAINT "_MediaUploadArtists_B_fkey" FOREIGN KEY ("B") REFERENCES "MediaUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;
