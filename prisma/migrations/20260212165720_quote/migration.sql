-- CreateTable
CREATE TABLE "quote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "region" TEXT,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "monthlyConsumptionKwh" DOUBLE PRECISION NOT NULL,
    "systemSizeKw" DOUBLE PRECISION NOT NULL,
    "downPayment" DOUBLE PRECISION DEFAULT 0,
    "systemPrice" DOUBLE PRECISION NOT NULL,
    "principalAmount" DOUBLE PRECISION NOT NULL,
    "riskBand" TEXT NOT NULL,
    "offers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quote_userId_idx" ON "quote"("userId");

-- AddForeignKey
ALTER TABLE "quote" ADD CONSTRAINT "quote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
