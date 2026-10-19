import prisma from "../../config/db.js";

/**
 * Search Repository
 * Executes case-insensitive queries across all relevant database models using Prisma
 */
export const SearchRepository = {
  /**
   * Search Career Categories
   */
  async searchCategories(query, limit = 10) {
    return prisma.category.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { specialization: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        stream: {
          select: { id: true, name: true },
        },
      },
      take: limit,
      orderBy: { title: "asc" },
    });
  },

  /**
   * Search Career Subfields (Secondcategory)
   */
  async searchSecondCategories(query, limit = 10) {
    return prisma.secondcategory.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { specialization: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            streamId: true,
            stream: { select: { id: true, name: true } },
          },
        },
      },
      take: limit,
      orderBy: { name: "asc" },
    });
  },

  /**
   * Search Career Specializations (Subcategory)
   */
  async searchSubcategories(query, limit = 10) {
    return prisma.subcategory.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { specialization: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: {
          select: { id: true, title: true },
        },
        secondcategory: {
          select: { id: true, name: true },
        },
      },
      take: limit,
      orderBy: { title: "asc" },
    });
  },

  /**
   * Search Career Paths
   */
  async searchCareerPaths(query, limit = 10) {
    return prisma.careerPath.findMany({
      where: {
        OR: [
          { pathName: { contains: query, mode: "insensitive" } },
          { graduation: { contains: query, mode: "insensitive" } },
          { aftergraduation: { contains: query, mode: "insensitive" } },
          { afterpostgraduation: { contains: query, mode: "insensitive" } },
          { anyother: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: { select: { id: true, title: true } },
        secondcategory: { select: { id: true, name: true } },
        subcategory: { select: { id: true, title: true } },
        module: { select: { id: true, title: true } },
      },
      take: limit,
      orderBy: { id: "asc" },
    });
  },

  /**
   * Search Institutions / Colleges
   */
  async searchInstitutions(query, limit = 10) {
    return prisma.institutions.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { state: { contains: query, mode: "insensitive" } },
          { countruy: { contains: query, mode: "insensitive" } },
          { institute_type: { contains: query, mode: "insensitive" } },
          { about: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: { select: { id: true, title: true } },
        secondcategory: { select: { id: true, name: true } },
        subcategory: { select: { id: true, title: true } },
      },
      take: limit,
      orderBy: { is_top: "desc" },
    });
  },

  /**
   * Search Entrance Exams
   */
  async searchEntranceExams(query, limit = 10) {
    return prisma.entranceExam.findMany({
      where: {
        OR: [
          { examname: { contains: query, mode: "insensitive" } },
          { about: { contains: query, mode: "insensitive" } },
          { eligibility: { contains: query, mode: "insensitive" } },
          { mode: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: { select: { id: true, title: true } },
        secondcategory: { select: { id: true, name: true } },
        subcategory: { select: { id: true, title: true } },
      },
      take: limit,
      orderBy: { examname: "asc" },
    });
  },

  /**
   * Search Mentors (only active mentors)
   */
  async searchMentors(query, limit = 10) {
    return prisma.mentor.findMany({
      where: {
        status: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { designation: { contains: query, mode: "insensitive" } },
          { skill: { contains: query, mode: "insensitive" } },
          { education: { contains: query, mode: "insensitive" } },
          { placeof_word: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: { select: { id: true, title: true } },
        secondcategory: { select: { id: true, name: true } },
        subcategory: { select: { id: true, title: true } },
        reviews: {
          select: { rating: true },
        },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Search Scholarships
   */
  async searchScholarships(query, limit = 10) {
    return prisma.scholarship.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { type: { contains: query, mode: "insensitive" } },
          { eligibility: { contains: query, mode: "insensitive" } },
          { requirement: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: { select: { id: true, title: true } },
        secondcategory: { select: { id: true, name: true } },
        subcategory: { select: { id: true, title: true } },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Search Study Abroad Programs
   */
  async searchStudyAbroad(query, limit = 10) {
    return prisma.studyAbroad.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { country_name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { overview: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Search Masterclasses (only active masterclasses)
   */
  async searchMasterClasses(query, limit = 10) {
    return prisma.masterClass.findMany({
      where: {
        is_active: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Search Quizzes
   */
  async searchQuizzes(query, limit = 10) {
    return prisma.quiz.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { type: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Search Career Newsletters
   */
  async searchNewsletters(query, limit = 10) {
    return prisma.careernewsletter.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Search Academic Streams
   */
  async searchStreams(query, limit = 10) {
    return prisma.stream.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
      },
      take: limit,
      orderBy: { name: "asc" },
    });
  },
};
