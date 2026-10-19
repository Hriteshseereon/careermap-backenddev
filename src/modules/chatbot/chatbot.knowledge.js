/**
 * Static knowledge about the CareerMap portal used by the "Career Bee"
 * assistant. Live data (careers, colleges, exams, scholarships, mentors,
 * plans, the user's own status) is fetched through tools at answer time,
 * so this file only describes how the product works and where things are.
 *
 * Keep it factual: update it whenever a feature or a screen changes.
 */

/** Pages the assistant can point users to. Frontends map the keys to routes. */
export const PORTAL_PAGES = {
  dashboard: { label: "Dashboard", web: "/app/dashboard", mobile: "/(drawer)/(tabs)" },
  career_library: { label: "Career Archive", web: "/app/library", mobile: "/(drawer)/(tabs)/library" },
  assessment: { label: "Assessments", web: "/app/assessment", mobile: "/(drawer)/(tabs)/assessment" },
  psychometric_test: { label: "Psychometric Test", web: "/app/psychometric-test", mobile: "/(drawer)/(tabs)/assessment" },
  quiz: { label: "Personality Quiz", web: "/app/quiz", mobile: "/(drawer)/quiz" },
  entrance_exams: { label: "Entrance Exams", web: "/app/entrance-exam", mobile: "/(drawer)/entrance-exam" },
  institutes: { label: "Institutes", web: "/app/institutes", mobile: "/(drawer)/institute" },
  scholarships: { label: "Scholarships", web: "/app/scholarships", mobile: "/(drawer)/scholarship" },
  mentors: { label: "Book a Mentor", web: "/app/book-mentor", mobile: "/(drawer)/book-mentor" },
  masterclasses: { label: "Career & Personality Videos", web: "/app/learn", mobile: "/(drawer)/(tabs)/learn" },
  study_abroad: { label: "Study Abroad", web: "/app/abroad", mobile: "/(drawer)/abroad" },
  newsletter: { label: "Career Insights", web: "/app/newsletter", mobile: "/(drawer)/newsletter" },
  plans: { label: "Plans & Subscription", web: "/app/subscription", mobile: "/(drawer)/subscription" },
  notifications: { label: "Notifications", web: "/app/notifications", mobile: "/(drawer)/notifications" },
  profile: { label: "My Profile", web: "/app/profile", mobile: "/(drawer)/(tabs)/profile" },
  settings_help: { label: "Settings & Help", web: "/app/settings", mobile: "/(drawer)/settings" },
};

export const PORTAL_GUIDE = `
# About CareerMap
CareerMap is an Indian career-guidance platform for school and college students and their parents.
It is available as a website (user portal) and as a mobile app with the same features. The in-app assistant is called "Career Bee".

# Main sections (page key in brackets - use suggest_page with that key to link the user)
- Dashboard [dashboard]: the home screen after login; shows the modules, free and locked, and quick links.
- Career Archive / Career Library [career_library]: careers organised as Stream -> Category -> Sub-category -> Career details
  (what the job is, scope, salary ranges, career paths after graduation / post-graduation, related entrance exams and colleges).
  Some categories can be opened for a free 15-second preview; full access needs a plan that includes the Career Archive module.
- Assessments [assessment]:
  - Psychometric Test [psychometric_test] ("Career Compass"): a scientific test covering interests (RIASEC / Holland code), personality,
    aptitude and career-cluster fit. At the end the student gets a detailed report with their Holland code, top career clusters and
    match percentages, which can also be emailed. Every user's FIRST psychometric test is free. Retaking it needs a plan
    that includes the assessment (one completed test per plan purchase). Students whose school/college/institute has enrolled
    them with CareerMap can take it free at any time.
  - Personality Quiz [quiz]: shorter quizzes with an instant score.
- Entrance Exams [entrance_exams]: national and state entrance exams with eligibility, pattern, subjects, important dates and
  top institutions. Which exams are listed changes over time - use the tools to check before naming one.
- Institutes / Colleges [institutes]: directory of colleges and universities across India, filterable by location, type and courses.
- Scholarships [scholarships]: scholarships with eligibility, deadlines, requirements and how to apply. Some are open as free previews.
- Book a Mentor [mentors]: 1-on-1 paid sessions with career mentors. Pick a mentor, a date and an available time slot, then pay
  online (Razorpay) to confirm. After the session you can rate and review the mentor.
- Career & Personality Videos / Masterclasses [masterclasses]: expert video sessions; some are free, others need a plan.
- Study Abroad [study_abroad]: country guides (overview, visa & work rights, living and tuition costs, top universities,
  scholarships, requirements, popular courses) and a counselling request form for personal help.
- Career Insights / Newsletter [newsletter]: articles and updates about careers and education.
- Plans & Subscription [plans]: paid plans unlock modules for a validity period. Payment is online through Razorpay (UPI, cards,
  net banking).
- Notifications [notifications], My Profile [profile], Settings & Help [settings_help] (change password, raise a help & support ticket).

# Accounts
- Sign up: enter your mobile number, verify it with the one-time password (OTP), then fill in your profile (name, email, password, etc.).
- Log in: with mobile number + OTP, or with email + password.
- Forgot password: use "Forgot password" on the login screen; a reset link is emailed and is valid for a short time.
- Institute students: when an institute enrols a student, CareerMap emails the student their login email and password.
  They log in with email + password, complete their profile, and take the psychometric test free of cost.
  They should change their password after the first login (Settings).

# Free vs paid
- Free modules are open to every logged-in user. Locked modules show a purchase option.
- Some pages allow a one-time 15-second free preview before purchase.
- Prices, plan names and what each plan includes change over time - always use the list_plans tool, never guess.

# Support
- For account, payment or technical problems: Settings & Help -> Help & Support (raise a ticket), and the team replies by email.
- For a personal career discussion: book a mentor, or for study abroad use the counselling form on the Study Abroad page.
`;

/**
 * Lightweight FAQ used when the AI provider is not configured or unavailable,
 * so the assistant still gives useful, accurate answers.
 */
export const FALLBACK_FAQ = [
  {
    keywords: ["sign up", "signup", "register", "create account", "new account"],
    answer:
      "To sign up, enter your mobile number, verify it with the OTP you receive, and then complete your profile with your name, email and a password.",
    page: "dashboard",
  },
  {
    keywords: ["forgot password", "reset password", "change password", "password"],
    answer:
      "If you forgot your password, tap \"Forgot password\" on the login screen and follow the link sent to your email. To change it while logged in, open Settings.",
    page: "settings_help",
  },
  {
    keywords: ["login", "log in", "sign in", "otp"],
    answer:
      "You can log in with your mobile number and OTP, or with your email and password. Institute students use the email and password that were emailed to them.",
    page: "dashboard",
  },
  {
    keywords: ["psychometric", "career compass", "assessment", "aptitude", "holland", "riasec"],
    answer:
      "The Psychometric Test (Career Compass) measures your interests, personality and aptitude and gives you a detailed career report. Your first attempt is free; retakes are included in selected plans, and students enrolled by their institute can take it free.",
    page: "psychometric_test",
  },
  {
    keywords: ["institute student", "school paid", "college paid", "free test", "credentials"],
    answer:
      "If your school or institute enrolled you, check your email for your CareerMap login details. Log in with that email and password and take the psychometric test free of cost.",
    page: "psychometric_test",
  },
  {
    keywords: ["plan", "subscription", "price", "pricing", "pay", "payment", "upi", "razorpay", "buy"],
    answer:
      "Plans unlock the paid modules for a fixed validity period, and you can pay online with UPI, cards or net banking. Open Plans & Subscription to see the current plans and what each includes.",
    page: "plans",
  },
  {
    keywords: ["mentor", "counsellor", "counselor", "one on one", "1-on-1", "session"],
    answer:
      "To talk to a mentor, open Book a Mentor, choose a mentor, pick a date and time slot, and pay online to confirm the session.",
    page: "mentors",
  },
  {
    keywords: ["scholarship", "financial aid", "fee waiver"],
    answer:
      "The Scholarships section lists scholarships with eligibility, deadlines and how to apply.",
    page: "scholarships",
  },
  {
    keywords: ["exam", "jee", "neet", "cuet", "clat", "nift", "entrance"],
    answer:
      "The Entrance Exams section covers eligibility, exam pattern, subjects and important dates for major entrance exams.",
    page: "entrance_exams",
  },
  {
    keywords: ["college", "university", "institute", "institution"],
    answer:
      "The Institutes section is a directory of colleges and universities across India that you can filter by location and type.",
    page: "institutes",
  },
  {
    keywords: ["abroad", "foreign", "overseas", "visa", "ielts", "toefl"],
    answer:
      "The Study Abroad section has country guides covering costs, visas, universities and scholarships, plus a form to request personal counselling.",
    page: "study_abroad",
  },
  {
    keywords: ["video", "masterclass", "master class", "webinar"],
    answer:
      "Career & Personality Videos has expert masterclasses; some are free and others are part of a plan.",
    page: "masterclasses",
  },
  {
    keywords: ["help", "support", "complaint", "problem", "issue", "refund", "contact"],
    answer:
      "For help with your account or a payment, raise a ticket under Settings → Help & Support and the team will reply by email.",
    page: "settings_help",
  },
  {
    keywords: ["stream", "science", "commerce", "arts", "humanities", "career", "which career", "suit me"],
    answer:
      "To find careers that suit you, take the Psychometric Test and then explore the matching careers in the Career Archive, where they are grouped by stream and category.",
    page: "career_library",
  },
];

export const STARTER_PROMPTS = [
  "Which careers suit me?",
  "How do I prepare for JEE?",
  "Show me scholarships for engineering",
  "Is the psychometric test free for me?",
  "Which plan should I buy?",
  "How do I book a mentor?",
];
