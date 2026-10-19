import prisma from "../../config/db.js";

export const QuizRepository = {
  // CREATE QUIZ
  createQuiz(data) {
    return prisma.quiz.create({ data });
  },

  // GET ALL
 getAllQuiz() {
  return prisma.quiz.findMany({

    include: {

      questions: {
        include: {
          options: true,
        },
      },

      // 🔥 ADD THIS
      _count: {
        select: {
          attempts: true,
        },
      },
    },
  });
},

  // GET BY ID
  getQuizById(id) {
    return prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });
  },

  // UPDATE
  updateQuiz(id, data) {
    return prisma.quiz.update({
      where: { id },
      data,
    });
  },

  // DELETE
  deleteQuiz(id) {
    return prisma.quiz.delete({
      where: { id },
    });
  },

  // ADD QUESTION
  addQuestion(data) {
    return prisma.quizQuestion.create({
      data: {
        question: data.question,
        quizId: data.quizId,
        options: {
          create: data.options,
        },
      },
      include: { options: true },
    });
  },
  // UPDATE QUESTION
updateQuestion(id, data) {
  return prisma.quizQuestion.update({
    where: { id },
    data,
    include: {
      options: true,
    },
  });
},

// DELETE QUESTION
deleteQuestion(id) {
  return prisma.quizQuestion.delete({
    where: { id },
  });
},
// GET QUESTION BY ID
getQuestionById(id) {
  return prisma.quizQuestion.findUnique({
    where: { id },
    include: {
      options: true,
    },
  });
},

getQuizForUser(id) {
  return prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          options: {
            select: {
              id: true,
              text: true,
            },
          },
        },
      },
    },
  });
},
getQuizAttempts(quizId) {
  return prisma.quizAttempt.findMany({

    where: {
      quizId: Number(quizId),
    },

    include: {

      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },

      quiz: true,
    },

    orderBy: {
      attemptedAt: "desc",
    },
  });
},

// repository to get the quiz attempt by user and quiz id
getUserQuizHistory(userId) {
  return prisma.quizAttempt.findMany({
    where: {
      userId: Number(userId),
    },

    include: {
      quiz: {
        select: {
          id: true,
          title: true,
          type: true,
          duration: true,
        },
      },
    },

    orderBy: {
      attemptedAt: "desc",
    },
  });
},
};