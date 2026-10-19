import multer from "multer";

const storage = multer.memoryStorage();

// Upload size limit (default 200 MB per file - career-detail media can be video). Files are held in memory, so an
// unbounded size could exhaust the server's RAM.
const MAX_UPLOAD_MB = Number(process.env.UPLOAD_MAX_MB) || 200;

// Only types a browser would execute as a page/script are refused. Images (including SVG),
// PDFs, office documents, spreadsheets, video and audio keep working as before.
const BLOCKED_MIME_TYPES = new Set([
  "text/html",
  "application/xhtml+xml",
  "application/javascript",
  "application/x-javascript",
  "application/ecmascript",
  "text/javascript",
  "text/ecmascript",
]);

const fileFilter = (req, file, cb) => {
  const mime = String(file.mimetype || "").toLowerCase().split(";")[0].trim();
  if (BLOCKED_MIME_TYPES.has(mime)) {
    const error = new Error("This file type is not allowed");
    error.status = 400;
    return cb(error);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter,
});

export default upload;
