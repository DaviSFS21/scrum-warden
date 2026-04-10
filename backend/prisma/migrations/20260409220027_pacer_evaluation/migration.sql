-- CreateTable
CREATE TABLE "PacerEvaluation" (
    "id" TEXT NOT NULL,
    "sprintId" TEXT NOT NULL,
    "evaluatorId" TEXT NOT NULL,
    "evaluateeId" TEXT NOT NULL,
    "proactivity" INTEGER NOT NULL,
    "autonomy" INTEGER NOT NULL,
    "collaboration" INTEGER NOT NULL,
    "delivery" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PacerEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PacerEvaluation_sprintId_evaluatorId_evaluateeId_key" ON "PacerEvaluation"("sprintId", "evaluatorId", "evaluateeId");

-- AddForeignKey
ALTER TABLE "PacerEvaluation" ADD CONSTRAINT "PacerEvaluation_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PacerEvaluation" ADD CONSTRAINT "PacerEvaluation_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PacerEvaluation" ADD CONSTRAINT "PacerEvaluation_evaluateeId_fkey" FOREIGN KEY ("evaluateeId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

