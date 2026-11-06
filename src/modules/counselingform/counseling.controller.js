import {
  createCounseling,
  getCounselings,
  getCounselingById,
  updateCounseling,
  deleteCounseling,
  generateCounselingReport,
  getCounselingsByCounselor,
} from "./counseling.services.js";
import PDFDocument from "pdfkit";

const LEFT_LOGO_URL =
  "https://res.cloudinary.com/dfm1xhhwx/image/upload/v1784782926/logo_white_pkzdz0.png";
const RIGHT_LOGO_URL =
  "https://res.cloudinary.com/dfm1xhhwx/image/upload/v1784783276/logo_ulbkag.png";

export const stripHtml = (html) => {
  if (html === undefined || html === null) return "";
  if (typeof html !== "string") return String(html);
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p\s*>/gi, "\n\n")
    .replace(/<\/div\s*>/gi, "\n")
    .replace(/<\/li\s*>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&bull;/gi, "•")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const formatMarksForReport = (marksData, fallbackSubjects = []) => {
  if (!marksData && (!fallbackSubjects || fallbackSubjects.length === 0)) return "-";

  let source = marksData;
  if (typeof source === "string") {
    try {
      source = JSON.parse(source);
    } catch {
      // ignore parse error if string is already formatted text
    }
  }

  if (source && typeof source === "object" && !Array.isArray(source)) {
    if (source.rawMarks !== undefined && source.rawMarks !== null) {
      source = source.rawMarks;
    }
  }

  const entries = [];

  const add = (sub, sc) => {
    const s = stripHtml(String(sub || "")).trim();
    const v = stripHtml(String(sc || "")).trim();
    if (!s) return;
    const ls = s.toLowerCase();
    if (
      ls.startsWith("_") ||
      ls === "rawmarks" ||
      ls === "totalpercentage" ||
      ls === "createdat" ||
      ls === "counselorname" ||
      ls === "createdbyid" ||
      ls === "creatortype" ||
      ls === "subjects"
    ) {
      return;
    }
    entries.push(`${s} - ${v || "-"}`);
  };

  // 1. If normalized subjects array exists, prefer it
  if (Array.isArray(fallbackSubjects) && fallbackSubjects.length > 0) {
    for (const item of fallbackSubjects) {
      if (item && item.subject) {
        add(item.subject, item.score);
      }
    }
    if (entries.length > 0) return entries.join("\n");
  }

  // 2. If source has subjects array
  if (source && Array.isArray(source.subjects) && source.subjects.length > 0) {
    for (const item of source.subjects) {
      if (item && item.subject) {
        add(item.subject, item.score);
      }
    }
    if (entries.length > 0) return entries.join("\n");
  }

  // 3. Array of objects or strings
  if (Array.isArray(source)) {
    for (const item of source) {
      if (!item) continue;
      if (typeof item === "object") {
        const sub = item.subject ?? item.subjectName ?? item.name ?? item.title ?? item.sub;
        const val = item.score ?? item.marks ?? item.mark ?? item.value ?? item.percentage;
        if (sub) add(sub, val);
        else {
          for (const [k, v] of Object.entries(item)) add(k, v);
        }
      } else if (typeof item === "string") {
        entries.push(stripHtml(item).trim());
      }
    }
    return entries.length > 0 ? entries.join("\n") : "-";
  }

  // 4. Object key-value pairs
  if (typeof source === "object" && source !== null) {
    for (const [key, val] of Object.entries(source)) {
      if (typeof val === "object" && val !== null) {
        const sub = val.subject ?? val.name ?? key;
        const score = val.score ?? val.marks ?? val.value ?? "";
        add(sub, score);
      } else {
        add(key, val);
      }
    }
    return entries.length > 0 ? entries.join("\n") : "-";
  }

  return "-";
};

export const CATEGORY_OPTIONS = [
  {
    key: "A",
    text: "(A) Passionate, having clear plan",
    keywords: ["passionate", "clear plan"],
  },
  {
    key: "B",
    text: "(B) Confused with many options",
    keywords: ["confused with many", "many options", "confused"],
  },
  {
    key: "C",
    text: "(C) No clear plan, but open for discussion",
    keywords: ["no clear plan", "open for discussion"],
  },
  {
    key: "D",
    text: "(D) Having a plan, which is practically not feasible",
    keywords: ["not feasible", "practically not feasible"],
  },
  {
    key: "E",
    text: "(E) Vague knowledge about Career options",
    keywords: ["vague knowledge", "vague"],
  },
];

export const resolveSelectedCategory = (categoryInput) => {
  if (categoryInput === undefined || categoryInput === null) return "-";
  const clean = stripHtml(String(categoryInput)).trim();
  if (!clean) return "-";

  const upper = clean.toUpperCase();

  // 1. Direct letter or letter-prefix match (e.g. "A", "(A)", "A)", "Option A", "Category A", "(A) ...")
  for (const opt of CATEGORY_OPTIONS) {
    if (
      upper === opt.key ||
      upper === `(${opt.key})` ||
      upper === `${opt.key})` ||
      upper.startsWith(`(${opt.key})`) ||
      upper.startsWith(`${opt.key})`) ||
      upper.startsWith(`${opt.key} -`) ||
      upper.startsWith(`${opt.key}.`) ||
      upper === `OPTION ${opt.key}` ||
      upper === `OPTION (${opt.key})` ||
      upper === `CATEGORY ${opt.key}` ||
      upper === `CATEGORY (${opt.key})`
    ) {
      return opt.text;
    }
  }

  // 2. Exact or normalized text match
  const normClean = upper.replace(/[^A-Z0-9]/g, "");
  for (const opt of CATEGORY_OPTIONS) {
    const normOpt = opt.text.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (normClean === normOpt || normClean.includes(normOpt) || normOpt.includes(normClean)) {
      return opt.text;
    }
  }

  // 3. Match by keywords
  const lower = clean.toLowerCase();
  for (const opt of CATEGORY_OPTIONS) {
    if (opt.keywords.some((kw) => lower.includes(kw))) {
      return opt.text;
    }
  }

  return clean;
};

export const createCounselingController = async (req, res) => {
  const result = await createCounseling(req.body, { staff: req.staff, admin: req.admin, institute: req.institute });
  res.status(result.success ? 201 : (result.statusCode || 400)).json(result);
};

export const getCounselingsController = async (req, res) => {
  const result = await getCounselings(
    { staff: req.staff, admin: req.admin, institute: req.institute },
    req.query
  );
  res.status(result.success ? 200 : (result.statusCode || 400)).json(result);
};

export const getInstituteCounselingReportsController = async (req, res) => {
  const result = await getCounselings({ institute: req.institute }, req.query);
  res.status(result.success ? 200 : (result.statusCode || 400)).json(result);
};

export const getMyCounselingReportsController = async (req, res) => {
  const result = await getCounselings({ staff: req.staff, admin: req.admin }, req.query);
  res.status(result.success ? 200 : (result.statusCode || 400)).json(result);
};

export const getCounselingsByCounselorController = async (req, res) => {
  const result = await getCounselingsByCounselor(req.params.counselorName, { staff: req.staff, admin: req.admin, institute: req.institute });
  res.status(result.success ? 200 : (result.statusCode || 400)).json(result);
};

export const getCounselingByIdController = async (req, res) => {
  const result = await getCounselingById(req.params.id, {
    staff: req.staff,
    admin: req.admin,
    institute: req.institute,
  });
  res.status(result.success ? 200 : (result.statusCode || 404)).json(result);
};

export const updateCounselingController = async (req, res) => {
  const result = await updateCounseling(req.params.id, req.body, { staff: req.staff, admin: req.admin, institute: req.institute });
  res.status(result.success ? 200 : (result.statusCode || 400)).json(result);
};

export const deleteCounselingController = async (req, res) => {
  const result = await deleteCounseling(req.params.id, { staff: req.staff, admin: req.admin, institute: req.institute });
  res.status(result.success ? 200 : (result.statusCode || 400)).json(result);
};

export const downloadCounselingReportController = async (req, res) => {
  try {
    const result = await generateCounselingReport(req.params.id, {
      staff: req.staff,
      admin: req.admin,
      institute: req.institute,
    });

    if (!result.success) {
      return res.status(result.statusCode || 404).json(result);
    }
 
    const data = result.data;
 
    let leftLogoBuf = null;
    let rightLogoBuf = null;
    try {
      const [leftBuffer, rightBuffer] = await Promise.all([
        fetch(LEFT_LOGO_URL).then((resp) => resp.arrayBuffer()),
        fetch(RIGHT_LOGO_URL).then((resp) => resp.arrayBuffer()),
      ]);
      leftLogoBuf = Buffer.from(leftBuffer);
      rightLogoBuf = Buffer.from(rightBuffer);
    } catch (err) {
      console.error("Logo fetch failed:", err?.message || err);
    }
 
    const doc = new PDFDocument({ size: "A4", margin: 40, bufferPages: true });
 
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Counseling_Report_${data.id}.pdf`
    );
 
    doc.pipe(res);
 
    // ===========================
    // LAYOUT CONSTANTS
    // ===========================
 
    const MARGIN = 40;
    const PAGE_WIDTH = doc.page.width;
    const PAGE_HEIGHT = doc.page.height;
    const TABLE_WIDTH = PAGE_WIDTH - MARGIN * 2; // 515
    const LEFT = MARGIN;
    const RIGHT = MARGIN + TABLE_WIDTH;
 
    const BLACK = "#000000";
    const GRAY = "#666666";
    const HIGHLIGHT = "#1d4ed8";
 
    const checkPageBreak = (needed) => {
      if (doc.y + needed > PAGE_HEIGHT - MARGIN - 20) {
        doc.addPage();
        doc.y = MARGIN;
      }
    };
 
    // ===========================
    // HEADER (logos + title)
    // ===========================
 
    if (leftLogoBuf) {
      try {
        doc.image(leftLogoBuf, LEFT, 20, { width: 70 });
      } catch {
        // ignore image error
      }
    }
    if (rightLogoBuf) {
      try {
        doc.image(rightLogoBuf, RIGHT - 70, 20, { width: 70 });
      } catch {
        // ignore image error
      }
    }
 
    doc
      .fillColor(BLACK)
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("MINI \u2013 CAREER COUNSELING", LEFT, 60, {
        width: TABLE_WIDTH,
        align: "center",
      });
 
    doc.y = 105;
 
    // ===========================
    // Generic two-column bordered row
    // ===========================
 
    const twoColRow = (label, value, labelWidth, opts = {}) => {
      const valueWidth = TABLE_WIDTH - labelWidth;
      const labelFont = opts.labelFont || "Helvetica-Bold";
      const valueFont = opts.valueFont || "Helvetica";
      const fontSize = opts.fontSize || 10;
 
      const cleanValue = typeof value === "string" ? stripHtml(value) : value;
      const displayString =
        cleanValue !== undefined && cleanValue !== null && String(cleanValue).trim().length > 0
          ? String(cleanValue).trim()
          : "-";

      doc.font(labelFont).fontSize(fontSize);
      const labelHeight = doc.heightOfString(label, { width: labelWidth - 10 });
      doc.font(valueFont).fontSize(fontSize);
      const valueHeight = doc.heightOfString(displayString, { width: valueWidth - 10 });
 
      const rowHeight =
        Math.max(labelHeight, valueHeight, opts.minHeight || 20) + 10;
 
      checkPageBreak(rowHeight);
 
      const y = doc.y;
 
      doc.rect(LEFT, y, labelWidth, rowHeight).stroke();
      doc.rect(LEFT + labelWidth, y, valueWidth, rowHeight).stroke();
 
      doc
        .font(labelFont)
        .fontSize(fontSize)
        .fillColor(BLACK)
        .text(label, LEFT + 5, y + 5, { width: labelWidth - 10 });
 
      doc
        .font(valueFont)
        .fontSize(fontSize)
        .fillColor(BLACK)
        .text(displayString, LEFT + labelWidth + 5, y + 5, {
          width: valueWidth - 10,
        });
 
      doc.y = y + rowHeight;
    };
 
    // ===========================
    // Student Information table
    // ===========================
 
    const LABEL_W1 = 160;
 
    twoColRow("Name of the Counselee", data.studentName, LABEL_W1);
    twoColRow("Class", data.class, LABEL_W1);
    twoColRow("Stream", data.stream, LABEL_W1);
    twoColRow("School", data.school, LABEL_W1);
    twoColRow(
      "Date",
      data.counselingDate
        ? new Date(data.counselingDate).toLocaleDateString()
        : "-",
      LABEL_W1
    );
    twoColRow("Phone number", data.phoneNumber, LABEL_W1);
    twoColRow("Gmail Id", data.email, LABEL_W1);
 
    doc.y += 12;
 
    // ===========================
    // PROBING STATEMENTS / RESPONSE table
    // ===========================
 
    const LABEL_W2 = 200;
 
    checkPageBreak(24);
    {
      const y = doc.y;
      const rowH = 22;
      doc.rect(LEFT, y, LABEL_W2, rowH).stroke();
      doc.rect(LEFT + LABEL_W2, y, TABLE_WIDTH - LABEL_W2, rowH).stroke();
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor(BLACK)
        .text("PROBING STATEMENTS", LEFT + 5, y + 6, {
          width: LABEL_W2 - 10,
        });
      doc.text("RESPONSE", LEFT + LABEL_W2 + 5, y + 6, {
        width: TABLE_WIDTH - LABEL_W2 - 10,
      });
      doc.y = y + rowH;
    }
 
    twoColRow("Occupation of Father", data.fatherOccupation, LABEL_W2);
    twoColRow("Occupation of Mother", data.motherOccupation, LABEL_W2);
    twoColRow(
      "No. of Sibling",
      data.siblingCount !== undefined && data.siblingCount !== null
        ? String(data.siblingCount)
        : "-",
      LABEL_W2
    );
 
    // Academic Marks / Latest Score
    const marksText = formatMarksForReport(data.marks, data.subjects);
 
    const scoreLabel = data.stream
      ? `Latest Score (${data.stream})`
      : "Latest Score";
    twoColRow(scoreLabel, marksText, LABEL_W2);
 
    // Total Percentage Row
    const rawTotalPercentage =
      data.totalPercentage ||
      (data.marks && typeof data.marks === "object"
        ? data.marks.totalPercentage || data.marks._totalPercentage
        : null);
 
    const cleanTotalPercentage =
      rawTotalPercentage !== undefined &&
      rawTotalPercentage !== null &&
      String(rawTotalPercentage).trim().length > 0
        ? (String(rawTotalPercentage).trim().endsWith("%")
            ? String(rawTotalPercentage).trim()
            : `${String(rawTotalPercentage).trim()}%`)
        : "-";
 
    twoColRow("Total Percentage", cleanTotalPercentage, LABEL_W2);
 
    // Dream career
    const careerText = [
      `Option 1 - ${data.dreamCareerOption1 || ""}`,
      `Option 2 - ${data.dreamCareerOption2 || ""}`,
      `Option 3 - ${data.dreamCareerOption3 || ""}`,
    ].join("\n");
 
    twoColRow("Student's Dream Career", careerText, LABEL_W2);
 
    twoColRow(
      "What do your parents want you to become?",
      data.parentsExpectation,
      LABEL_W2
    );
 
    // Category row - only display the selected option
    const categoryText = resolveSelectedCategory(data.category);
 
    twoColRow(
      "Which category does your counselee belong to?",
      categoryText,
      LABEL_W2
    );
 
    // Observation & Recommendation (strip HTML so tags like <p> don't print in PDF)
    {
      const label = "Observation & Recommendation/ Suggestion";
      const labelWidth = LABEL_W2;
      const valueWidth = TABLE_WIDTH - labelWidth;
      const rawText = data.observation || "";
      const text = stripHtml(rawText) || "No Observation Available";
 
      doc.font("Helvetica-Bold").fontSize(10);
      const labelHeight = doc.heightOfString(label, { width: labelWidth - 10 });
      doc.font("Helvetica").fontSize(10);
      const textHeight = doc.heightOfString(text, { width: valueWidth - 10 });
 
      const rowHeight = Math.max(labelHeight, textHeight, 80) + 10;
      checkPageBreak(rowHeight);
 
      const y = doc.y;
      doc.rect(LEFT, y, labelWidth, rowHeight).stroke();
      doc.rect(LEFT + labelWidth, y, valueWidth, rowHeight).stroke();
 
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(BLACK)
        .text(label, LEFT + 5, y + 5, { width: labelWidth - 10 });
 
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(BLACK)
        .text(text, LEFT + labelWidth + 5, y + 5, {
          width: valueWidth - 10,
          align: "justify",
        });
 
      doc.y = y + rowHeight;
    }
 
    doc.y += 15;
 
    // ===========================
    // Counselor / Psychometric footer table
    // ===========================
 
    twoColRow("Name of the CC", data.counselorName, LABEL_W1);
 
    {
      const col1 = 160;
      const col2 = (TABLE_WIDTH - col1) / 2;
      const col3 = TABLE_WIDTH - col1 - col2;
      const rowH = 26;
      checkPageBreak(rowH);
      const y = doc.y;
 
      doc.rect(LEFT, y, col1, rowH).stroke();
      doc.rect(LEFT + col1, y, col2, rowH).stroke();
      doc.rect(LEFT + col1 + col2, y, col3, rowH).stroke();
 
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(BLACK)
        .text("Psychometric Test", LEFT + 5, y + 8, { width: col1 - 10 });
 
      const isRecommended = !!data.psychometricRecommended;
 
      doc
        .font(isRecommended ? "Helvetica-Bold" : "Helvetica")
        .fillColor(isRecommended ? HIGHLIGHT : BLACK)
        .text(
          `${isRecommended ? "[X]" : "[ ]"} Recommended`,
          LEFT + col1 + 5,
          y + 8,
          { width: col2 - 10 }
        );
 
      doc
        .font(!isRecommended ? "Helvetica-Bold" : "Helvetica")
        .fillColor(!isRecommended ? HIGHLIGHT : BLACK)
        .text(
          `${!isRecommended ? "[X]" : "[ ]"} Not Recommended`,
          LEFT + col1 + col2 + 5,
          y + 8,
          { width: col3 - 10 }
        );
 
      doc.y = y + rowH;
    }
 
    doc.y += 30;
 
    // Signature line
    checkPageBreak(30);
    doc
      .strokeColor("#999999")
      .moveTo(RIGHT - 160, doc.y)
      .lineTo(RIGHT, doc.y)
      .stroke();
    doc
      .fontSize(9)
      .fillColor(GRAY)
      .text("Authorized Signature", RIGHT - 160, doc.y + 5, {
        width: 160,
        align: "center",
      });
 
    // Footer on all buffered pages
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.page.margins.bottom = 0;
      doc
        .fontSize(8)
        .fillColor(GRAY)
        .text(
          "Generated by Career Counseling Management System",
          LEFT,
          PAGE_HEIGHT - 25,
          { width: TABLE_WIDTH, align: "center", lineBreak: false }
        );
    }
 
    doc.end();
  } catch (error) {
    console.error("Download counseling report error:", error);
 
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to generate counseling report",
    });
  }
};
