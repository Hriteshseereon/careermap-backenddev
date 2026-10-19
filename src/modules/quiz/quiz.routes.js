import { Router } from "express";
import {
  createQuizController,
  addQuestionController,
  getAllQuizController,
  getQuizByIdController,
  updateQuizController,
  deleteQuizController,
   updateQuestionController,
  deleteQuestionController,
  getQuestionByIdController,
  getQuizForUserController,
  submitQuizController,
  getQuizAttemptsController,
   getUserQuizHistoryController
} from "./quiz.controller.js";
import { protectAdminOrStaff } from "../../middlewares/protectAdminOrStaff.js";
import {protectAuth} from "../../middlewares/protectAuth.js"
const router = Router();

router.post("/", protectAdminOrStaff, createQuizController);
router.post("/question", protectAdminOrStaff, addQuestionController);

// 🔥 USER ROUTES (PUT ABOVE)
router.get("/user/:id", getQuizForUserController);
router.post("/submit-quiz",protectAuth, submitQuizController);

// 🔹 QUESTION ROUTES
router.get("/question/:id", getQuestionByIdController);
router.put("/question/:id", protectAdminOrStaff, updateQuestionController);
router.delete("/question/:id", protectAdminOrStaff, deleteQuestionController);

// 🔹 GENERAL QUIZ ROUTES
router.get("/", getAllQuizController);
router.get(
  "/history",
  protectAuth,
  getUserQuizHistoryController
);
router.get("/:id", getQuizByIdController); // ✅ LAST
router.get(
  "/:quizId/attempts",
  protectAdminOrStaff,
  getQuizAttemptsController
);
router.put("/:id", protectAdminOrStaff, updateQuizController);
router.delete("/:id", protectAdminOrStaff, deleteQuizController);

export default router;