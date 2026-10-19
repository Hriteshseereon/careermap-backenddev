import {
  createQuiz,
  addQuestion,
  getAllQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
    updateQuestion,
  deleteQuestion,
    getQuestionById,
    submitQuiz,
    getQuizForUser,
    getQuizAttempts,
    getUserQuizHistory
} from "./quiz.service.js";

// CREATE
export const createQuizController = async (req, res) => {
  const result = await createQuiz(req.body);
  res.status(result.success ? 201 : 400).json(result);
};

// ADD QUESTION
export const addQuestionController = async (req, res) => {
  const result = await addQuestion(req.body);
  res.status(result.success ? 201 : 400).json(result);
};

// GET ALL
export const getAllQuizController = async (req, res) => {
  const result = await getAllQuiz();
  res.status(200).json(result);
};

// GET BY ID
export const getQuizByIdController = async (req, res) => {
  const result = await getQuizById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

// UPDATE
export const updateQuizController = async (req, res) => {
  const result = await updateQuiz(req.params.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
};

// DELETE
export const deleteQuizController = async (req, res) => {
  const result = await deleteQuiz(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};

// UPDATE QUESTION
export const updateQuestionController = async (req, res) => {
  const result = await updateQuestion(req.params.id, req.body);
  res.status(result.success ? 200 : 400).json(result);
};

// DELETE QUESTION
export const deleteQuestionController = async (req, res) => {
  const result = await deleteQuestion(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};

export const getQuestionByIdController = async (req, res) => {
  const result = await getQuestionById(req.params.id);
  res.status(result.success ? 200 : 404).json(result);
};

export const getQuizForUserController = async (req, res) => {
  const result = await getQuizForUser(req.params.id);
  res.status(result.success ? 200 : 400).json(result);
};

export const submitQuizController = async (req, res) => {

  const result = await submitQuiz(
    req.body,
    req.user.id // 🔥 from auth token
  );

  res.status(result.success ? 200 : 400).json(result);
};

export const getQuizAttemptsController = async (req, res) => {

  const result = await getQuizAttempts(
    req.params.quizId
  );

  res.status(result.success ? 200 : 400).json(result);
};

export const getUserQuizHistoryController =
async (req, res) => {

  const result =
    await getUserQuizHistory(req.user.id);

  res
    .status(result.success ? 200 : 400)
    .json(result);
};