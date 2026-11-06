import "dotenv/config";
import { URL } from "url";

try {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log("DATABASE_URL is not set");
  } else {
    const parsed = new URL(dbUrl);
    console.log("DB Host:", parsed.host);
    console.log("DB Name:", parsed.pathname);
  }
} catch (e) {
  console.log("Error parsing DATABASE_URL:", e.message);
}

