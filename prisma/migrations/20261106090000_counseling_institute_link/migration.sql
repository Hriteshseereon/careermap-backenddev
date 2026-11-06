ALTER TABLE "CounselingForm" ADD COLUMN "instituteId" INTEGER;
ALTER TABLE "CounselingForm" ADD COLUMN "schoolInstitutionId" INTEGER;

ALTER TABLE "CounselingForm"
ADD CONSTRAINT "CounselingForm_instituteId_fkey"
FOREIGN KEY ("instituteId") REFERENCES "Institutes"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CounselingForm"
ADD CONSTRAINT "CounselingForm_schoolInstitutionId_fkey"
FOREIGN KEY ("schoolInstitutionId") REFERENCES "Institutions"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "CounselingForm_instituteId_idx" ON "CounselingForm"("instituteId");
CREATE INDEX "CounselingForm_schoolInstitutionId_idx" ON "CounselingForm"("schoolInstitutionId");
