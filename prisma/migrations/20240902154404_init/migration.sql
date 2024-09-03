/*
  Warnings:

  - You are about to drop the `Dream` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Dream";

-- CreateTable
CREATE TABLE "analysis" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emotion" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "dream_id" INTEGER NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dream" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dream_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "analysis" ADD CONSTRAINT "Analysis_dream_id_fkey" FOREIGN KEY ("dream_id") REFERENCES "dream"("id") ON DELETE CASCADE ON UPDATE CASCADE;
