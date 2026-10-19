import { SearchRepository } from "./search.repository.js";

/**
 * Normalizes an entity into a unified search item format with complete navigation metadata
 */
const formatCategory = (cat) => ({
  id: cat.id,
  title: cat.title,
  subtitle: cat.stream ? `${cat.stream.name} Stream` : "Career Category",
  description: cat.description || cat.specialization || "",
  image: cat.coverImage || cat.file || null,
  type: "category",
  group: "careers",
  badge: "Category",
  navigation: {
    path: `/career-library/category/${cat.id}`,
    url: `/career-library/category/${cat.id}`,
    type: "category",
    id: cat.id,
    streamId: cat.streamId,
    query: { streamId: cat.streamId },
  },
  metadata: {
    streamId: cat.streamId,
    streamName: cat.stream?.name || null,
  },
});

const formatSecondCategory = (sc) => ({
  id: sc.id,
  title: sc.name,
  subtitle: sc.category ? `${sc.category.title}` : "Career Subfield",
  description: sc.description || sc.specialization || "",
  image: sc.coverImage || sc.image || null,
  type: "secondcategory",
  group: "careers",
  badge: "Subfield",
  navigation: {
    path: `/career-library/second/${sc.id}`,
    url: `/career-library/second/${sc.id}?categoryId=${sc.categoryId}`,
    type: "secondcategory",
    id: sc.id,
    categoryId: sc.categoryId,
    streamId: sc.category?.streamId || null,
    query: {
      categoryId: sc.categoryId,
      streamId: sc.category?.streamId || null,
    },
  },
  metadata: {
    categoryId: sc.categoryId,
    categoryTitle: sc.category?.title || null,
  },
});

const formatSubcategory = (sub) => ({
  id: sub.id,
  title: sub.title,
  subtitle:
    [sub.category?.title, sub.secondcategory?.name]
      .filter(Boolean)
      .join(" • ") || "Career Specialization",
  description: sub.description || sub.specialization || "",
  image: sub.coverImage || sub.file || null,
  type: "subcategory",
  group: "careers",
  badge: "Specialization",
  navigation: {
    path: `/career-library/subcategory/${sub.id}`,
    url: `/career-library/subcategory/${sub.id}?categoryId=${sub.categoryId}&secondcategoryId=${sub.secondcategoryId}`,
    type: "subcategory",
    id: sub.id,
    categoryId: sub.categoryId,
    secondcategoryId: sub.secondcategoryId,
    query: {
      categoryId: sub.categoryId,
      secondcategoryId: sub.secondcategoryId,
    },
  },
  metadata: {
    categoryId: sub.categoryId,
    secondcategoryId: sub.secondcategoryId,
  },
});

const formatCareerPath = (cp) => ({
  id: cp.id,
  title: cp.pathName || "Career Path",
  subtitle:
    cp.graduation ||
    cp.aftergraduation ||
    cp.category?.title ||
    "Career Pathway",
  description: cp.aftergraduation || cp.afterpostgraduation || cp.anyother || "",
  image: null,
  type: "careerpath",
  group: "careerPaths",
  badge: "Career Path",
  navigation: {
    path: `/career-path/${cp.id}`,
    url: `/career-path/${cp.id}`,
    type: "careerpath",
    id: cp.id,
    categoryId: cp.categoryId,
    secondcategoryId: cp.secondcategoryId,
    subcategoryId: cp.subcategoryId,
    query: {
      categoryId: cp.categoryId,
      secondcategoryId: cp.secondcategoryId,
      subcategoryId: cp.subcategoryId,
    },
  },
  metadata: {
    module: cp.module?.title || null,
    graduation: cp.graduation,
  },
});

const formatInstitution = (inst) => ({
  id: inst.id,
  title: inst.name,
  subtitle:
    [inst.city, inst.state, inst.countruy].filter(Boolean).join(", ") ||
    inst.institute_type ||
    "Institution",
  description: inst.about || "",
  image: inst.logo || null,
  type: "institution",
  group: "institutions",
  badge: inst.institute_type || "College",
  navigation: {
    path: `/institutions/${inst.id}`,
    url: `/institutions/${inst.id}`,
    type: "institution",
    id: inst.id,
  },
  metadata: {
    city: inst.city,
    state: inst.state,
    country: inst.countruy,
    instituteType: inst.institute_type,
    isTop: inst.is_top,
    coursesOffered: inst.course_offered,
  },
});

const formatEntranceExam = (exam) => ({
  id: exam.id,
  title: exam.examname,
  subtitle: exam.eligibility || (exam.mode ? `Mode: ${exam.mode}` : "Entrance Exam"),
  description: exam.about || "",
  image: null,
  type: "entranceexam",
  group: "entranceExams",
  badge: "Entrance Exam",
  navigation: {
    path: `/entrance-exam/${exam.id}`,
    url: `/entrance-exam/${exam.id}`,
    type: "entranceexam",
    id: exam.id,
  },
  metadata: {
    mode: exam.mode,
    eligibility: exam.eligibility,
    issuedate: exam.issuedate,
    lastdate: exam.lastdate,
    examDate: exam.exam_date,
  },
});

const formatMentor = (mentor) => {
  const totalReviews = mentor.reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? mentor.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  return {
    id: mentor.id,
    title: mentor.name || "Mentor",
    subtitle: mentor.designation || mentor.skill || "Career Mentor",
    description: mentor.education || mentor.description || "",
    image: mentor.image || null,
    type: "mentor",
    group: "mentors",
    badge: mentor.rank || "Mentor",
    navigation: {
      path: `/mentors/${mentor.id}`,
      url: `/mentors/${mentor.id}`,
      type: "mentor",
      id: mentor.id,
    },
    metadata: {
      designation: mentor.designation,
      education: mentor.education,
      skill: mentor.skill,
      experience: mentor.experience,
      mentorFees: mentor.mentor_fees,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
    },
  };
};

const formatScholarship = (sch) => ({
  id: sch.id,
  title: sch.name,
  subtitle: sch.type || (sch.is_free ? "Free Scholarship" : "Scholarship Aid"),
  description: sch.eligibility || sch.description || "",
  image: sch.image || null,
  type: "scholarship",
  group: "scholarships",
  badge: sch.type || "Scholarship",
  navigation: {
    path: `/scholarships/${sch.id}`,
    url: `/scholarships/${sch.id}`,
    type: "scholarship",
    id: sch.id,
  },
  metadata: {
    isFree: sch.is_free,
    price: sch.price,
    deadline: sch.deadline,
    eligibility: sch.eligibility,
  },
});

const formatStudyAbroad = (sa) => ({
  id: sa.id,
  title: sa.title || sa.country_name || "Study Abroad Program",
  subtitle: sa.country_name ? `Study in ${sa.country_name}` : "International Education",
  description: sa.description || sa.overview || "",
  image: null,
  type: "studyabroad",
  group: "studyAbroad",
  badge: "Study Abroad",
  navigation: {
    path: `/study-abroad/${sa.id}`,
    url: `/study-abroad/${sa.id}`,
    type: "studyabroad",
    id: sa.id,
  },
  metadata: {
    countryName: sa.country_name,
    livingCost: sa.living_cost,
    tuitionCost: sa.tution_cost,
  },
});

const formatMasterClass = (mc) => ({
  id: mc.id,
  title: mc.title || "Masterclass",
  subtitle: mc.name ? `By ${mc.name}` : mc.category || "Masterclass Session",
  description: mc.category || "",
  image: mc.image || null,
  type: "masterclass",
  group: "masterclasses",
  badge: mc.is_free ? "Free Masterclass" : "Masterclass",
  navigation: {
    path: `/masterclass/${mc.id}`,
    url: `/masterclass/${mc.id}`,
    type: "masterclass",
    id: mc.id,
  },
  metadata: {
    speakerName: mc.name,
    category: mc.category,
    isFree: mc.is_free,
    time: mc.time,
  },
});

const formatQuiz = (q) => ({
  id: q.id,
  title: q.title,
  subtitle: q.type || (q.duration ? `${q.duration} mins` : "Self Assessment"),
  description: q.type || "",
  image: null,
  type: "quiz",
  group: "quizzes",
  badge: "Quiz & Assessment",
  navigation: {
    path: `/quiz/${q.id}`,
    url: `/quiz/${q.id}`,
    type: "quiz",
    id: q.id,
  },
  metadata: {
    duration: q.duration,
    type: q.type,
  },
});

const formatNewsletter = (nl) => ({
  id: nl.id,
  title: nl.title,
  subtitle: "Career Newsletter",
  description: nl.description || "",
  image: nl.image || null,
  type: "newsletter",
  group: "newsletters",
  badge: "Article",
  navigation: {
    path: `/newsletter/${nl.id}`,
    url: `/newsletter/${nl.id}`,
    type: "newsletter",
    id: nl.id,
    externalUrl: nl.url || null,
  },
  metadata: {
    externalUrl: nl.url,
  },
});

const formatStream = (stream) => ({
  id: stream.id,
  title: stream.name,
  subtitle: "Academic Stream",
  description: `Explore careers in ${stream.name}`,
  image: stream.image || null,
  type: "stream",
  group: "careers",
  badge: "Stream",
  navigation: {
    path: `/career-library?streamId=${stream.id}`,
    url: `/career-library?streamId=${stream.id}`,
    type: "stream",
    id: stream.id,
    query: { streamId: stream.id },
  },
  metadata: {},
});

/**
 * Global Search Service
 */
export const SearchService = {
  /**
   * Performs a comprehensive search across all models
   * @param {Object} params
   * @param {string} params.query - Search term
   * @param {string} [params.type='all'] - Filter by type or 'all'
   * @param {number} [params.limit=10] - Limit per category
   */
  async globalSearch({ query, type = "all", limit = 10 }) {
    try {
      const sanitized = (query || "").trim();

      if (!sanitized || sanitized.length < 1) {
        return {
          success: true,
          query: sanitized,
          total: 0,
          results: [],
          grouped: {
            careers: [],
            careerPaths: [],
            institutions: [],
            entranceExams: [],
            mentors: [],
            scholarships: [],
            studyAbroad: [],
            masterclasses: [],
            quizzes: [],
            newsletters: [],
          },
        };
      }

      const itemLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
      const searchAll = !type || type === "all";
      const types = type.toLowerCase().split(",").map((t) => t.trim());

      // Helper to check if a model should be searched
      const shouldSearch = (categoryKey) =>
        searchAll || types.includes(categoryKey.toLowerCase());

      // Run parallel queries across all database models
      const [
        streams,
        categories,
        secondCategories,
        subcategories,
        careerPaths,
        institutions,
        entranceExams,
        mentors,
        scholarships,
        studyAbroad,
        masterclasses,
        quizzes,
        newsletters,
      ] = await Promise.all([
        shouldSearch("career") || shouldSearch("stream")
          ? SearchRepository.searchStreams(sanitized, itemLimit)
          : [],
        shouldSearch("career") || shouldSearch("category")
          ? SearchRepository.searchCategories(sanitized, itemLimit)
          : [],
        shouldSearch("career") || shouldSearch("secondcategory")
          ? SearchRepository.searchSecondCategories(sanitized, itemLimit)
          : [],
        shouldSearch("career") || shouldSearch("subcategory")
          ? SearchRepository.searchSubcategories(sanitized, itemLimit)
          : [],
        shouldSearch("careerpath") || shouldSearch("career")
          ? SearchRepository.searchCareerPaths(sanitized, itemLimit)
          : [],
        shouldSearch("institution") || shouldSearch("college")
          ? SearchRepository.searchInstitutions(sanitized, itemLimit)
          : [],
        shouldSearch("entranceexam") || shouldSearch("exam")
          ? SearchRepository.searchEntranceExams(sanitized, itemLimit)
          : [],
        shouldSearch("mentor")
          ? SearchRepository.searchMentors(sanitized, itemLimit)
          : [],
        shouldSearch("scholarship")
          ? SearchRepository.searchScholarships(sanitized, itemLimit)
          : [],
        shouldSearch("studyabroad")
          ? SearchRepository.searchStudyAbroad(sanitized, itemLimit)
          : [],
        shouldSearch("masterclass")
          ? SearchRepository.searchMasterClasses(sanitized, itemLimit)
          : [],
        shouldSearch("quiz") || shouldSearch("assessment")
          ? SearchRepository.searchQuizzes(sanitized, itemLimit)
          : [],
        shouldSearch("newsletter")
          ? SearchRepository.searchNewsletters(sanitized, itemLimit)
          : [],
      ]);

      // Normalize all items
      const formattedCareers = [
        ...streams.map(formatStream),
        ...categories.map(formatCategory),
        ...secondCategories.map(formatSecondCategory),
        ...subcategories.map(formatSubcategory),
      ];
      const formattedCareerPaths = careerPaths.map(formatCareerPath);
      const formattedInstitutions = institutions.map(formatInstitution);
      const formattedEntranceExams = entranceExams.map(formatEntranceExam);
      const formattedMentors = mentors.map(formatMentor);
      const formattedScholarships = scholarships.map(formatScholarship);
      const formattedStudyAbroad = studyAbroad.map(formatStudyAbroad);
      const formattedMasterclasses = masterclasses.map(formatMasterClass);
      const formattedQuizzes = quizzes.map(formatQuiz);
      const formattedNewsletters = newsletters.map(formatNewsletter);

      // Grouped structure
      const grouped = {
        careers: formattedCareers,
        careerPaths: formattedCareerPaths,
        institutions: formattedInstitutions,
        entranceExams: formattedEntranceExams,
        mentors: formattedMentors,
        scholarships: formattedScholarships,
        studyAbroad: formattedStudyAbroad,
        masterclasses: formattedMasterclasses,
        quizzes: formattedQuizzes,
        newsletters: formattedNewsletters,
      };

      // Combined flat results array with relevance ordering
      const allResults = [
        ...formattedCareers,
        ...formattedInstitutions,
        ...formattedEntranceExams,
        ...formattedMentors,
        ...formattedScholarships,
        ...formattedCareerPaths,
        ...formattedStudyAbroad,
        ...formattedMasterclasses,
        ...formattedQuizzes,
        ...formattedNewsletters,
      ];

      // Sort by relevance (exact match first, starts-with second, contains third)
      const qLower = sanitized.toLowerCase();
      allResults.sort((a, b) => {
        const aTitle = (a.title || "").toLowerCase();
        const bTitle = (b.title || "").toLowerCase();

        const aExact = aTitle === qLower ? 0 : 1;
        const bExact = bTitle === qLower ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;

        const aStarts = aTitle.startsWith(qLower) ? 0 : 1;
        const bStarts = bTitle.startsWith(qLower) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;

        return 0;
      });

      return {
        success: true,
        query: sanitized,
        total: allResults.length,
        groupedTotal: {
          careers: formattedCareers.length,
          careerPaths: formattedCareerPaths.length,
          institutions: formattedInstitutions.length,
          entranceExams: formattedEntranceExams.length,
          mentors: formattedMentors.length,
          scholarships: formattedScholarships.length,
          studyAbroad: formattedStudyAbroad.length,
          masterclasses: formattedMasterclasses.length,
          quizzes: formattedQuizzes.length,
          newsletters: formattedNewsletters.length,
        },
        results: allResults,
        grouped,
      };
    } catch (error) {
      console.error("Global Search Error:", error);
      return {
        success: false,
        message: error.message || "Failed to perform global search",
      };
    }
  },

  /**
   * Fast lightweight suggestions for auto-complete dropdown
   */
  async getSuggestions({ query, limit = 8 }) {
    try {
      const sanitized = (query || "").trim();
      if (!sanitized || sanitized.length < 1) {
        return { success: true, query: sanitized, suggestions: [] };
      }

      const result = await this.globalSearch({
        query: sanitized,
        type: "all",
        limit: 3,
      });

      if (!result.success) {
        return result;
      }

      const topSuggestions = result.results.slice(0, Number(limit) || 8);

      return {
        success: true,
        query: sanitized,
        total: topSuggestions.length,
        suggestions: topSuggestions,
      };
    } catch (error) {
      console.error("Search Suggestions Error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch suggestions",
      };
    }
  },
};
