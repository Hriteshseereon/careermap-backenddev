/*
  Warnings:

  - You are about to drop the column `budgetRange` on the `StudyAbroadConsult` table. All the data in the column will be lost.
  - You are about to drop the column `courseInterest` on the `StudyAbroadConsult` table. All the data in the column will be lost.
  - You are about to drop the column `preferredCountry` on the `StudyAbroadConsult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudyAbroadConsult" DROP COLUMN "budgetRange",
DROP COLUMN "courseInterest",
DROP COLUMN "preferredCountry",
ADD COLUMN     "annualTuitionBudget" TEXT,
ADD COLUMN     "boardUniversity" TEXT,
ADD COLUMN     "class10PercentageCGPA" TEXT,
ADD COLUMN     "class12PercentageCGPA" TEXT,
ADD COLUMN     "countryOfCitizenship" TEXT,
ADD COLUMN     "currentCityState" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "documentsAvailable" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "educationLoanRequired" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "englishTest" TEXT,
ADD COLUMN     "englishTestScoreDate" TEXT,
ADD COLUMN     "entranceExamScoreDate" TEXT,
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "highestQualification" TEXT,
ADD COLUMN     "intendedStudyLevel" TEXT,
ADD COLUMN     "mobileNumber" TEXT,
ADD COLUMN     "openToAlternativeUniversities" BOOLEAN,
ADD COLUMN     "otherEntranceExams" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "parentEmail" TEXT,
ADD COLUMN     "parentGuardianName" TEXT,
ADD COLUMN     "parentMobileNumber" TEXT,
ADD COLUMN     "parentOccupation" TEXT,
ADD COLUMN     "parentRelationship" TEXT,
ADD COLUMN     "passingYear" TEXT,
ADD COLUMN     "passportExpiryDate" TIMESTAMP(3),
ADD COLUMN     "passportStatus" TEXT,
ADD COLUMN     "preferredCareerDomain" TEXT,
ADD COLUMN     "preferredCountries" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "preferredCourseProgramme" TEXT,
ADD COLUMN     "preferredSpecialization" TEXT,
ADD COLUMN     "preferredUniversities" TEXT,
ADD COLUMN     "primaryFundingSource" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "reasonToStudyAbroad" TEXT,
ADD COLUMN     "scholarshipRequired" TEXT,
ADD COLUMN     "schoolCollegeUniversity" TEXT,
ADD COLUMN     "servicesRequired" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "topPriorities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "totalEducationBudget" TEXT,
ADD COLUMN     "whatsappNumber" TEXT;
