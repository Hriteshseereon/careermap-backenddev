-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "image" TEXT,
    "btn_text" TEXT,
    "position" TEXT,
    "markas_free" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);
