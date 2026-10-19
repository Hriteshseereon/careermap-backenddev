import "dotenv/config";
import cors from "cors";
import express, { application } from 'express';
import cookieParser from "cookie-parser";
 import userRoutes from "./modules/user/user.routes.js";
 import authRoutes from "./modules/auth/auth.routes.js";
 import adminAuthRoutes from "./modules/adminauth/adminauth.routes.js";
 import streamRoutes from "./modules/stream/stream.routes.js";
 import instituteRoutes from "./modules/institution/institution.routes.js";
 import categoryRoutes from "./modules/category/category.routes.js";
 import secondcategoryRoutes from "./modules/secondarycategory/secondcategory.routes.js";
 import subcategoryRoutes from "./modules/subcategory/subcategory.routes.js";
 import moduleRoutes from "./modules/modul/module.routes.js";
 import pathTypeRoutes from "./modules/pathtype/pathtype.routes.js";
 import entranceExamRoutes from "./modules/entranceexam/entranceexam.routes.js";
 import detailsRoutes from "./modules/details/details.routes.js";
 import careerPathRoutes from "./modules/careerpath/careerpath.routes.js"
 import mentorRoutes from "./modules/mentor/mentor.routes.js"
 import scholarshipRoutes from "./modules/scholarship/scholarship.routes.js"
 import plansRoutes    from  "./modules/plans/plans.routes.js"
 import quizRoutes   from "./modules/quiz/quiz.routes.js"
  import masterClassRoute from "./modules/masterclass/masterclass.routes.js"
  import studyAbroadRoute from "./modules/studyabroad/studyabroad.routes.js"
  import notificationRoute from "./modules/notification/notification.routes.js"
  import loginhistoryRoute from "./modules/loginhistory/userLoginHistory.routes.js"
import helpAndSupportRoute from "./modules/helpsupport/helpandsupport.routes.js"
import mentorBookingRoute from "./modules/mentorBooking/mentorBooking.routes.js"
import moduleAccessRoute from "./modules/moduleAccess/moduleAccess.routes.js"
import adminDashboardRoutes from "./modules/adminDashboard/adminDashboard.routes.js"
import coinselingFormRoutes from "./modules/counselingform/counseling.routes.js"
import roleCreationRoutes  from "./modules/role/role.routes.js"
import staffRoutes from "./modules/staff/staff.routes.js"
import permissionRoutes from "./modules/permission/permission.routes.js"
import instituteCreateRoutes from "./modules/institute/institute.routes.js"
import studentAddRoutes from "./modules/instituteStudent/instituteStudent.routes.js"
import adminnotificationRoutes from "./modules/adminnotification/adminnotification.routes.js"
import institutionImportRoutes from "./modules/institution/institutionImport.routes.js"
import mentorReviewRoutes from "./modules/mentorreview/mentorReview.routes.js"
import assessmentRoutes from "./modules/assessment/assessment.routes.js"
import newsleeterRoutes from "./modules/careernewsletter/careernewsletter.routes.js"
import searchRoutes from "./modules/search/search.routes.js"
import psychometricAssessmentRoutes from "./modules/psychometricassesment/psychoassesment.routes.js"
//  user portal routes imported here
import userportalRoutes from "./modules/userportal/routes/userPortal.routes.js"
import paymentRoutes from "./modules/userportal/routes/payment.routes.js"
import mentoravailabilityRoute from "./modules/userportal/routes/mentor.routes.js"
import careerlibraryRoutes from "./modules/userportal/routes/careerLibrary.routes.js"
import chatbotRoutes from "./modules/chatbot/chatbot.routes.js"
import helmet from "helmet";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
const app = express();

// Behind Render's proxy: use the real client IP (needed by the chatbot rate limiter).
// TRUST_PROXY = number of proxy hops (default 1), or "true"/"false", or an IP/subnet list.
const parseTrustProxy = (value) => {
  if (value === undefined || value === "") return 1;
  if (/^\d+$/.test(String(value).trim())) return Number(value);
  if (String(value).trim().toLowerCase() === "true") return true;
  if (String(value).trim().toLowerCase() === "false") return false;
  return String(value);
};
app.set("trust proxy", parseTrustProxy(process.env.TRUST_PROXY));

// Security headers. Cross-origin resource policy stays permissive because the
// web portal, admin portal and mobile app load API responses from other origins.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8081",
   "http://localhost:5174",
  "http://localhost:5175",
  "https://careermap-user-portal.vercel.app",
  "https://careermap-admin-portal.vercel.app",
  // NOTE (security review): temporary ngrok tunnel origin. Remove it once it is no longer needed.
  "https://unregarded-shameka-forensically.ngrok-free.dev"
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin"));
    }
  },
  credentials: true
}));
app.get('/', (req, res) => {
  res.send('app is running......');
});
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/streams", streamRoutes);
app.use("/api/institutes", instituteRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/secondarycategories", secondcategoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/modules",moduleRoutes);
app.use("/api/path",pathTypeRoutes);
app.use("/api/details",detailsRoutes);
app.use("/api/entranceexam",entranceExamRoutes);
app.use("/api/careerpath",careerPathRoutes);
app.use("/api/mentor",mentorRoutes);
app.use("/api/scholarship",scholarshipRoutes);
app.use("/api/plans",plansRoutes);
app.use("/api/quiz",quizRoutes);
app.use("/api/masterclass",masterClassRoute);
app.use("/api/studyabroad",studyAbroadRoute);
app.use("/api/notification",notificationRoute);
app.use("/api/helpandsupport",helpAndSupportRoute);
app.use("/api/mentor-booking",mentorBookingRoute);
app.use("/api/institutcreate",instituteCreateRoutes);
app.use("/api/student",studentAddRoutes);
app.use("/api/mentorreview",mentorReviewRoutes)
app.use(
  "/api/module-access",moduleAccessRoute);
  app.use("/api/admin",adminDashboardRoutes);
  app.use('/api/counseling',coinselingFormRoutes);
  app.use('/api/role',roleCreationRoutes);
  app.use('/api/staff',staffRoutes);
  app.use('/api/permissions',permissionRoutes);
app.use('/api/adminnotification',adminnotificationRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/newsletter",newsleeterRoutes);
app.use(
  "/api/institutions/import",
  institutionImportRoutes
);
app.use("/api/psychometric-assessment", psychometricAssessmentRoutes);
// user portal api 
app.use("/api/search", searchRoutes);
app.use("/api/user/search", searchRoutes);
app.use("/api/user",userportalRoutes);
app.use("/api/user/payment",paymentRoutes);
app.use("/api/mentor",mentoravailabilityRoute);
app.use("/api/careerlibrary",careerlibraryRoutes)
app.use("/api/userhistory",loginhistoryRoute);
app.use("/api/chatbot", chatbotRoutes);

// JSON 404 for unknown routes and one central error handler (Express 5 forwards async errors here).
app.use(notFoundHandler);
app.use(errorHandler);
export default app;