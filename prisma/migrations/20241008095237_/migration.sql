-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "genreId" TEXT;

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;
