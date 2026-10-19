import prisma from "../../config/db.js";
import { SearchService } from "../search/search.service.js";
import { assessmentService } from "../psychometricassesment/psychoassessment.service.js";
import { PORTAL_PAGES } from "./chatbot.knowledge.js";

/**
 * Tools the Career Bee assistant can call. Every tool returns PUBLIC catalogue
 * data only (titles, short snippets, dates, prices) - never paid page content,
 * other users' data or contact details. `get_my_status` only ever reads the
 * calling user's own record.
 */

const SNIPPET_LENGTH = 160;
const SEARCH_TYPES = [
  "all",
  "career",
  "careerpath",
  "institution",
  "entranceexam",
  "mentor",
  "scholarship",
  "studyabroad",
  "masterclass",
  "quiz",
  "newsletter",
];

const stripHtml = (value) =>
  String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const snippet = (value, length = SNIPPET_LENGTH) => {
  const text = stripHtml(value);
  return text.length > length ? `${text.slice(0, length - 1)}…` : text;
};

const toDate = (value) => (value ? new Date(value).toISOString().slice(0, 10) : null);

/** Public, front-end-navigable shape of a search item (same shape as /api/search results). */
export const toLinkItem = (item) => ({
  id: item.id,
  title: item.title,
  subtitle: snippet(item.subtitle, 80),
  type: item.type,
  group: item.group,
  badge: item.badge,
  image: item.image || null,
  navigation: item.navigation
    ? {
        path: item.navigation.path,
        url: item.navigation.url,
        type: item.navigation.type,
        id: item.navigation.id,
        categoryId: item.navigation.categoryId,
        secondcategoryId: item.navigation.secondcategoryId,
        subcategoryId: item.navigation.subcategoryId,
      }
    : undefined,
  streamId: item.streamId,
  categoryId: item.categoryId,
  secondCategoryId: item.secondCategoryId,
  subCategoryId: item.subCategoryId,
});

export const TOOL_DEFINITIONS = [
  {
    name: "search_portal",
    description:
      "Search CareerMap's live catalogue: careers (streams, categories, sub-categories), career paths, colleges/institutions, entrance exams, mentors, scholarships, study-abroad countries, masterclass videos, quizzes and career-insight articles. Returns titles and short public snippets. Use it whenever the user asks about a specific career, exam, college, scholarship, mentor or country, or asks what is available.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Short keyword query, e.g. 'data science', 'JEE', 'nursing', 'Canada'." },
        type: { type: "string", enum: SEARCH_TYPES, description: "Optional filter. Default 'all'." },
      },
      required: ["query"],
    },
  },
  {
    name: "list_plans",
    description:
      "List the current subscription plans with price (INR), validity in days and the modules each plan unlocks. Use for any question about plans, pricing or what is free/paid.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_modules",
    description: "List the portal modules and whether each is free for every user or needs a plan.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "list_upcoming_exams",
    description: "List entrance exams whose application last date or exam date is today or later, soonest first.",
    input_schema: {
      type: "object",
      properties: { limit: { type: "integer", minimum: 1, maximum: 15 } },
    },
  },
  {
    name: "list_open_scholarships",
    description: "List scholarships whose deadline is today or later (or has no deadline), soonest deadline first.",
    input_schema: {
      type: "object",
      properties: { limit: { type: "integer", minimum: 1, maximum: 15 } },
    },
  },
  {
    name: "get_my_status",
    description:
      "Get the logged-in user's own account status: first name, whether they are an institute-sponsored student, active plans with end dates, and whether they can take the psychometric test now (and why not). Only works when the user is logged in.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "suggest_page",
    description:
      "Add a button that takes the user to a page of the portal. Call it when you tell the user to open a section, at most twice per answer.",
    input_schema: {
      type: "object",
      properties: {
        page: { type: "string", enum: Object.keys(PORTAL_PAGES) },
      },
      required: ["page"],
    },
  },
];

const clampLimit = (value, fallback = 8, max = 15) =>
  Math.min(max, Math.max(1, Number.parseInt(value, 10) || fallback));

/**
 * Executes one tool call. `ctx` carries { userId, links, pages } - search hits
 * and page suggestions are collected there so they can be returned to the
 * client as buttons.
 */
export const runTool = async (name, input = {}, ctx) => {
  switch (name) {
    case "search_portal": {
      const query = String(input.query || "").trim().slice(0, 80);
      if (!query) return { results: [] };
      const type = SEARCH_TYPES.includes(input.type) ? input.type : "all";
      const response = await SearchService.globalSearch({ query, type, limit: 4 });
      const items = (response?.results || []).slice(0, 8);
      ctx.links.push(...items.map(toLinkItem));
      return {
        query,
        total: items.length,
        results: items.map((item) => ({
          kind: item.badge || item.type,
          title: item.title,
          subtitle: snippet(item.subtitle, 100),
          summary: snippet(item.description),
        })),
      };
    }

    case "list_plans": {
      const plans = await prisma.plans.findMany({
        select: {
          name: true,
          price: true,
          validity: true,
          plan_type: true,
          description: true,
          features: true,
          modules: { select: { title: true } },
        },
        orderBy: { price: "asc" },
        take: 20,
      });
      return {
        currency: "INR",
        plans: plans.map((plan) => ({
          name: plan.name,
          price: plan.price,
          validityDays: plan.validity,
          type: plan.plan_type,
          description: snippet(plan.description, 200),
          features: snippet(plan.features, 300),
          unlocks: plan.modules.map((m) => m.title),
        })),
      };
    }

    case "list_modules": {
      const modules = await prisma.module.findMany({
        select: { title: true, markas_free: true, freePreview: true },
        orderBy: { id: "asc" },
        take: 40,
      });
      return {
        modules: modules.map((m) => ({
          title: m.title,
          access: m.markas_free ? "free" : "needs a plan",
          freePreview: Boolean(m.freePreview) && !m.markas_free,
        })),
      };
    }

    case "list_upcoming_exams": {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const exams = await prisma.entranceExam.findMany({
        where: { OR: [{ lastdate: { gte: today } }, { exam_date: { gte: today } }] },
        select: { examname: true, lastdate: true, exam_date: true, mode: true },
        orderBy: [{ lastdate: "asc" }],
        take: clampLimit(input.limit),
      });
      return {
        exams: exams.map((e) => ({
          name: e.examname,
          applyBy: toDate(e.lastdate),
          examDate: toDate(e.exam_date),
          mode: e.mode,
        })),
      };
    }

    case "list_open_scholarships": {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const scholarships = await prisma.scholarship.findMany({
        where: { OR: [{ deadline: { gte: today } }, { deadline: null }] },
        select: { name: true, deadline: true, type: true },
        orderBy: [{ deadline: "asc" }],
        take: clampLimit(input.limit),
      });
      return {
        scholarships: scholarships.map((s) => ({
          name: s.name,
          type: s.type,
          deadline: toDate(s.deadline),
        })),
      };
    }

    case "get_my_status": {
      if (!ctx.userId) {
        return { loggedIn: false, note: "The user is not logged in. Ask them to log in to see their plan or test status." };
      }
      const now = new Date();
      const user = await prisma.users.findUnique({
        where: { id: Number(ctx.userId) },
        select: {
          firstName: true,
          isInstituteStudent: true,
          institute: { select: { name: true, status: true } },
          subscription: {
            where: { status: "active", endDate: { gte: now } },
            select: { endDate: true, plan: { select: { name: true } } },
            orderBy: { endDate: "desc" },
            take: 5,
          },
        },
      });
      if (!user) return { loggedIn: false };

      let psychometric = null;
      try {
        const access = await assessmentService.verifyUserAssessmentAccess(ctx.userId);
        psychometric = { canTakeNow: Boolean(access?.allowed), reason: access?.reason || null };
      } catch {
        psychometric = { canTakeNow: null };
      }

      return {
        loggedIn: true,
        firstName: user.firstName || null,
        instituteSponsored: Boolean(user.isInstituteStudent),
        instituteName: user.isInstituteStudent ? user.institute?.name || null : null,
        activePlans: user.subscription.map((s) => ({ plan: s.plan?.name, validUntil: toDate(s.endDate) })),
        psychometric,
      };
    }

    case "suggest_page": {
      const page = PORTAL_PAGES[input.page];
      if (!page) return { ok: false };
      if (!ctx.pages.some((p) => p.key === input.page) && ctx.pages.length < 3) {
        ctx.pages.push({ key: input.page, label: page.label, web: page.web, mobile: page.mobile });
      }
      return { ok: true };
    }

    default:
      return { error: `Unknown tool ${name}` };
  }
};
