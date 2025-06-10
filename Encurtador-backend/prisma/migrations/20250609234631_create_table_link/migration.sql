-- CreateTable
CREATE TABLE "link" (
    "id" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "link_shortId_key" ON "link"("shortId");
