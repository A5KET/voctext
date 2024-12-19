-- CreateEnum
CREATE TYPE "TranscriptionRequestStatus" AS ENUM ('PROCESSING', 'FAILED', 'COMPLETED');

-- CreateTable
CREATE TABLE "TranscriptionRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "fileName" TEXT,
    "status" "TranscriptionRequestStatus" NOT NULL DEFAULT 'PROCESSING',
    "error" TEXT,
    "transcriptionId" TEXT,

    CONSTRAINT "TranscriptionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transcription" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transcription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TranscriptionRequest" ADD CONSTRAINT "TranscriptionRequest_transcriptionId_fkey" FOREIGN KEY ("transcriptionId") REFERENCES "Transcription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
