import { QuizRepository } from "./quiz.repository.js";
import prisma from "../../config/db.js";
// CREATE QUIZ
export const createQuiz = async (body) => {
  try {
    const quiz = await QuizRepository.createQuiz({
      title: body.title,
      type: body.type,
      duration: body.duration ? Number(body.duration) : null,

      // ✅ NEW FIELDS
      from: body.from ? new Date(body.from) : null,
      to: body.to ? new Date(body.to) : null,
    });

    return { success: true, data: quiz };
  } catch (error) {
    console.error("❌ createQuiz Error:", error);
    return { success: false, message: error.message };
  }
};
// ADD QUESTION
export const addQuestion = async (body) => {
  try {
    const { quizId, question, options, correctOption } = body;

    if (!quizId || !question || !options || options.length !== 4) {
      return { success: false, message: "Invalid input" };
    }

    // convert correct option
    const formattedOptions = options.map((opt, index) => ({
      text: opt,
      isCorrect: index === correctOption,
    }));

    const data = await QuizRepository.addQuestion({
      quizId: Number(quizId),
      question,
      options: formattedOptions,
    });

    return { success: true, data };
  } catch (error) {
    console.error("❌ addQuestion Error:", error);
    return { success: false, message: error.message };
  }
};

// GET ALL
export const getAllQuiz = async () => {
  try {
    const data = await QuizRepository.getAllQuiz();
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// GET BY ID
export const getQuizById = async (id) => {
  try {
    const data = await QuizRepository.getQuizById(Number(id));

    if (!data) {
      return { success: false, message: "Quiz not found" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// UPDATE
export const updateQuiz = async (id, body) => {
  try {
    const data = await QuizRepository.updateQuiz(Number(id), {
      title: body.title,
      type: body.type,
      duration: body.duration
        ? Number(body.duration)
        : undefined,

      // ✅ NEW FIELDS
      from:
        body.from !== undefined
          ? body.from
            ? new Date(body.from)
            : null
          : undefined,

      to:
        body.to !== undefined
          ? body.to
            ? new Date(body.to)
            : null
          : undefined,
    });

    return { success: true, data };
  } catch (error) {
    console.error("❌ updateQuiz Error:", error);
    return { success: false, message: error.message };
  }
};

// DELETE
export const deleteQuiz = async (id) => {
  try {
    await QuizRepository.deleteQuiz(Number(id));
    return { success: true, message: "Deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// update question 
export const updateQuestion = async (id, body) => {
  try {
    const { question, options, correctOption } = body;

    // validate
    if (!question || !options || options.length !== 4) {
      return { success: false, message: "Invalid input" };
    }

    // 🔥 delete old options first
    await prisma.quizOption.deleteMany({
      where: { questionId: Number(id) },
    });

    // create new options
    const formattedOptions = options.map((opt, index) => ({
      text: opt,
      isCorrect: index === correctOption,
    }));

    const updated = await QuizRepository.updateQuestion(Number(id), {
      question,
      options: {
        create: formattedOptions,
      },
    });

    return { success: true, data: updated };
  } catch (error) {
    console.error("❌ updateQuestion Error:", error);
    return { success: false, message: error.message };
  }
};

// delete question

export const deleteQuestion = async (id) => {
  try {
    await QuizRepository.deleteQuestion(Number(id));
    return { success: true, message: "Question deleted successfully" };
  } catch (error) {
    console.error("❌ deleteQuestion Error:", error);
    return { success: false, message: error.message };
  }
};

export const getQuestionById = async (id) => {
  try {
    const data = await QuizRepository.getQuestionById(Number(id));

    if (!data) {
      return { success: false, message: "Question not found" };
    }

    // 🔥 convert options → frontend friendly format
    const formatted = {
      id: data.id,
      question: data.question,
      options: data.options.map((opt) => opt.text),
      correctOption: data.options.findIndex((opt) => opt.isCorrect),
    };

    return { success: true, data: formatted };
  } catch (error) {
    console.error("❌ getQuestionById Error:", error);
    return { success: false, message: error.message };
  }
};

export const getQuizForUser = async (id) => {
  try {
    const data = await QuizRepository.getQuizForUser(Number(id));

    if (!data) {
      return { success: false, message: "Quiz not found" };
    }

    return { success: true, data };

  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const submitQuiz = async (body, userId) => {
  try {

    const { quizId, answers } = body;

    if (!quizId) {
      return {
        success: false,
        message: "quizId is required",
      };
    }

    const questions = await prisma.quizQuestion.findMany({
      where: {
        quizId: Number(quizId),
      },

      include: {
        options: true,
      },
    });

    let correct = 0;

    const answerData = [];

    questions.forEach((q) => {

      const userAnswer = answers.find(
        (a) => a.questionId === q.id
      );

      if (!userAnswer) return;

      const correctOption = q.options.find(
        (opt) => opt.isCorrect
      );

      const isCorrect =
        correctOption &&
        correctOption.id === userAnswer.selectedOption;

      if (isCorrect) {
        correct++;
      }

      answerData.push({
        questionId: q.id,
        selectedOptionId: userAnswer.selectedOption,
        isCorrect,
      });
    });

    const total = questions.length;
    const wrong = total - correct;

    // 🔥 SAVE ATTEMPT
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: Number(quizId),
        userId: Number(userId),

        totalQuestions: total,
        correctAnswers: correct,
        wrongAnswers: wrong,

        score: `${correct}/${total}`,

        answers: {
          create: answerData,
        },
      },
    });

    return {
      success: true,

      data: {
        attemptId: attempt.id,
        total,
        correct,
        wrong,
        score: `${correct}/${total}`,
      },
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

export const getQuizAttempts = async (quizId) => {

  try {

    const data =
      await QuizRepository.getQuizAttempts(quizId);

    return {
      success: true,
      totalUsers: data.length,
      data,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};

// repository to get quiz attempts by quiz id
export const getUserQuizHistory = async (userId) => {
  try {
    const data =
      await QuizRepository.getUserQuizHistory(userId);

    return {
      success: true,
      totalTests: data.length,
      data,
    };

  } catch (error) {

    return {
      success: false,
      message: error.message,
    };
  }
};