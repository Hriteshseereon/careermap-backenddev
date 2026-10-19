import prisma from "../../config/db.js";

export const CLUSTER_CAREERS = {
  AGR: [
    "Agricultural Officer",
    "Plantation Manager",
    "Agricultural Scientist",
    "Horticulturist",
    "Floriculturist",
    "Dairy Farm Manager",
    "Food Technologist",
    "Poultry Farm Manager",
    "Livestock Officer",
    "Fisheries Officer",
    "Aquaculture Officer",
    "Agricultural Engineer",
    "Irrigation Engineer",
    "Food Processing Engineer",
    "Seed Technologist",
    "Agri-Business Manager",
    "Rural Development Officer",
    "Digital Agricultural Manager",
    "Organic Farming Officer",
    "Greenhouse Manager",
    "Supply Chain Manager"
  ],
  ENV: [
    "Environmental Scientist",
    "Environmental Engineer",
    "Waste Management Officer",
    "Water Resource Officer/Engineer",
    "Air Quality Analyst",
    "Environmental Health Officer",
    "Marine Biologist",
    "Forest Officer",
    "Biodiversity Officer",
    "Environmental Educator",
    "Renewable Energy Officer",
    "Environmental Auditor",
    "Disaster Management Personnel",
    "Urban Planner (Environment Focus)",
    "Pollution Control Officer",
    "Soil Conservationist",
    "Natural Resource Manager",
    "Wildlife Biologist",
    "Climate Change Analyst",
    "Wildlife Conservationist"
  ],
  AMC: [
    "Journalist",
    "News Anchor",
    "Reporter",
    "News Editor/News Analyst",
    "Content Writer/Developer",
    "Script Writer",
    "Film Director/Filmmaker",
    "Film Producer",
    "Video Editor",
    "Cinematographer",
    "Photographer",
    "Photojournalist",
    "Radio Jockey (RJ)",
    "Television Anchor",
    "Actor",
    "Voice Over Artist",
    "Corporate Communication Manager",
    "Digital Marketing Specialist",
    "Web Content Manager",
    "Graphic Designer",
    "Animator/ UI/UX Designer/VFX Artist",
    "Creative Director",
    "Podcast Producer",
    "Event Anchor/Emcee",
    "Choreographer",
    "Disc Jockey",
    "Musician",
    "Podcast Host",
    "Radio Jockey",
    "Voice Artist",
    "Author",
    "Editor",
    "Travel Blogger/Vlogger",
    "Social Media Manager",
    "Interpreter",
    "Translator"
  ],
  FIN: [
    "Accountant Executive",
    "Chartered Accountant (CA)",
    "Company Secretary (CS)",
    "Cost and Management Accountant (CMA)",
    "Certified Accounts professional",
    "Certified Financial Planner",
    "Certified Financial Analyst",
    "Actuary",
    "Investment Banker",
    "Banking Probationary Officer",
    "Share Market Consultant",
    "Insurance Advisor",
    "Finance Manager",
    "Economist"
  ],
  BIZ: [
    "Marketing Manager",
    "Sales Manager",
    "Human Resource (HR) Manager",
    "Office Administrator/HR Admin",
    "Operations Manager",
    "Supply Chain Manager",
    "Retail Manager",
    "E-commerce Manager",
    "Import-Export Manager",
    "Business Analyst",
    "Entrepreneur",
    "Market Research Analyst",
    "Customer Relationship Manager",
    "Real Estate Professional",
    "Brand Consultant/Strategist",
    "Startup Program/Ecosystem Manager",
    "Entrepreneur development officer"
  ],
  DES: [
    "Visual/Graphic Designer",
    "UI/UX Designer",
    "Web Designer",
    "Product Designer",
    "Fashion Designer",
    "Textile & Apparel Designer",
    "Furniture Designer",
    "Interior Designer",
    "Jewellery Designer",
    "2D/3D Animator",
    "VFX Artist",
    "Game Designer",
    "Illustrator",
    "Motion Graphics Designer",
    "Set/Scenic Designer",
    "Exhibition Designer",
    "Packaging Designer",
    "Advertising Designer",
    "Footwear Designer",
    "Architect",
    "Draftsman/CAD technician"
  ],
  EDU: [
    "Teacher",
    "Lecturer/Professor",
    "Special Educator",
    "Language Trainer",
    "Corporate Trainer",
    "Soft Skills Trainer",
    "Employablity Skills Trainer",
    "Technical (IT & Core) Trainer",
    "Skill Development Trainer",
    "Coaching Institute Faculty",
    "Research Scholar",
    "E Learning Developer",
    "Education Administrator",
    "Principal",
    "Training Manager",
    "Learning and Development (L&D) Manager",
    "Academic Researcher",
    "Librarian",
    "Career Counselor",
    "Study Abroad Counsellor"
  ],
  EMG: [
    "Data Analyst",
    "Data Scientist",
    "Artificial Intelligence (AI) Engineer",
    "Machine Learning Engineer",
    "Blockchain Developer",
    "Cybersecurity Analyst",
    "Cloud Engineer",
    "Internet of Things (IoT) Engineer",
    "Robotics Engineer",
    "Drone Pilot",
    "Drone Technician",
    "Prompt Engineer",
    "AR/VR Designer",
    "Human AI Interaction Designer",
    "App Developer",
    "Digital Content Creator",
    "Podcaster",
    "Influencer / Content Creator",
    "SEO Specialist",
    "Renewable Energy Engineer",
    "Electric Vehicle (EV) Engineer/ Technician",
    "Scientist/Researcher",
    "Fintech Engineer/Architect",
    "Digital Payment Architect",
    "Genetic Engineer",
    "Sports Analyst",
    "Esports Player",
    "Sports & Fiteness Nutritionist",
    "Career Counselor",
    "Sports Event Manager"
  ],
  GOV: [
    "Civil Servant (IAS, IPS, IFS) / Bureaucrat",
    "BDO",
    "DEO",
    "BMC Officer",
    "Tahasildar",
    "Passport Officer",
    "Banker",
    "Rural Development Officer",
    "Cyber Crime Officer",
    "Food Safety Officer",
    "Healthy Policy Officer ( CDMO)",
    "Lawyer / Advocate",
    "Judge",
    "Public Policy Consultant",
    "Revenue Officer",
    "Tax Officer (Income Tax, GST)",
    "Customs Officer",
    "Excise Inspect",
    "Intelligence Bureau Officer",
    "CBI Officer",
    "Social Welfare Officer",
    "Labour Officer",
    "Urban Development Officer",
    "Legal Assistant",
    "NCB Officer",
    "Corporate Lawyer",
    "Intellectual Property (IP) Lawyer",
    "Intelligence Officer"
  ],
  HLT: [
    "Doctor (MBBS)",
    "Doctor (AYUSH)",
    "Dentist",
    "Pharmacist",
    "Nurse",
    "Allied and Para Medical Professionals",
    "Physiotherapist",
    "Medical Laboratory Technician",
    "Radiologist",
    "X-ray Technician",
    "Pathologist",
    "Microbiologist",
    "Biochemist",
    "Biotechnologist",
    "Geneticist",
    "Immunologist",
    "Epidemiologist",
    "Nutritionist",
    "Dietitian",
    "Public Health Officer",
    "Veterinary Doctor",
    "Biomedical Scientist",
    "Neuroscientist",
    "Art Therapist",
    "Pharmacologist",
    "Test Developer / Psychometrician",
    "Clinical Psychologist",
    "Organizational Psychologist",
    "Health Psychologist",
    "Counselling Psychologist",
    "Community Health Worker",
    "Speech Therapist",
    "Occupational Therapist"
  ],
  HSP: [
    "Hotel/Resort Manager",
    "Restaurant/Cloud Kitchen /Catering Manager",
    "Baker",
    "Front Office/Guest Relations/Housekeeping Manager",
    "Tour/Travel Consultant",
    "Tour Guide",
    "Cabin Crew (Air Hostess/Flight Steward)",
    "Cruise Manager",
    "Bartender",
    "Butler",
    "Airline Ground Staff",
    "Culinary Artist/Chef",
    "Event Manager/Planner",
    "Wedding Planner",
    "Sports Manager",
    "Hospital Adminstrator"
  ],
  ITC: [
    "Software Developer/Engineer/Programmer",
    "Web Designer/Developer",
    "Mobile App Developer",
    "Game Designer/ Developer",
    "Data/Business Analyst",
    "Cloud/AWS/Azure Engineer",
    "Network/ System Engineer",
    "Data Scientist/Engineer",
    "AI/ML Engineer",
    "Cyber Security Analyst/ Engineer",
    "Robotics/Automation Engineer",
    "Fintech/Digital Banking Developer",
    "Prompt Engineer",
    "Generative AI Specialist",
    "Ethical Hacker",
    "IT/ Technical Support Engineer"
  ],
  PSF: [
    "Fashion Stylist",
    "Cosmetologist (Hair stylist/ Makeup Artist/Nail Artist)",
    "Spa/Massage Therapist",
    "Fitness/ Personal Trainer",
    "Yoga/Zumba/Aerobics Instructor",
    "Nutrition Coach",
    "Life Coach",
    "Career Coach",
    "Image Consultant",
    "Personal Assistant/Executive",
    "Fitness Trainer"
  ],
  SAF: [
    "Police Officer",
    "Defence Personnel (Army, Navy, Air Force)",
    "Paramilitary Personnel",
    "Agniveer",
    "Disaster Management/Recovery Officer",
    "Traffic Police",
    "Indian Coast Guard Officer",
    "Railway Safety/Protection Force (RPF) Officer",
    "Airport Security Officer",
    "Search and Rescue Officer",
    "Prison Officer / Jail Warden"
  ],
  SOC: [
    "Social Worker",
    "Community Development/Enagagement Officer",
    "Block Program Managers",
    "NGO Program Coordinator/ Manager (Nonprofit)",
    "Child Welfare/Protection/Rights Officer",
    "Women Welfare/Protection/Rights Officer",
    "Rehabilitation Officer/Worker",
    "Human Rights Officer",
    "Waste Management Coordinator",
    "Rural Development Officer",
    "Disability Support Worker",
    "Education Program Officer",
    "Mental Health Counsellor",
    "Adoption Counselor",
    "Substance Abuse Counselor",
    "Shelter Homes Manager",
    "Livelihood Development Officer",
    "Corporate Social Responsibility (CSR) Officer/Manager",
    "UN Program Officer",
    "Animal welfare/Shelter manager"
  ],
  SPT: [
    "Professional Athlete & Coach",
    "Professional Player",
    "Sports Coach/Trainer",
    "Physical Education Teacher",
    "Armed Forces Sports Instructor",
    "Sports Physiotherapist",
    "Sports Psychologist",
    "Sports Nutritionist",
    "Referee",
    "Umpire",
    "Sports Analyst",
    "Sports Anchor",
    "Sports Commentator",
    "Sports Journalist",
    "Martial Artist",
    "Sports Event Manager",
    "Sports Marketeer",
    "Strength and Conditioning Coach",
    "Sports Photographer/Videographer",
    "Esports Player"
  ],
  SEM: [
    "Physical Sciences",
    "Mathematics and Statistics",
    "Space Aviation",
    "Biological Sciences",
    "Chemical Sciences",
    "Environmental Sciences",
    "Core Engineering",
    "Advance Engineering",
    "Emerging Engineering",
    "Forensic Science"
  ],
  TRL: [
    "Merchant Navy officer",
    "Commercial/Cargo Pilot",
    "Loco Pilot",
    "Station Master",
    "Travelling Ticket Examiner",
    "Airport Operation/ Maintainance Manager",
    "Air Traffic Controller",
    "DGCA Compliance Officer",
    "Deck Officer",
    "Naval Architect",
    "Port/Dock Operations Manager",
    "Freight Manager (Import/Export)",
    "Shipping Documentation Officer",
    "Logistics/Supplychain Manager",
    "Metro Operation Manager",
    "Delivery/Courier Service Manager",
    "Cruise Ship Officer"
  ]
};

export const DEFAULT_CAREER_CLUSTERS = [
  {
    code: "AGR",
    name: "Agriculture",
    hollandCode: "RIC",
    description: "Focus on farming, crop production, agribusiness, animal husbandry, and agricultural sciences.",
    careers: CLUSTER_CAREERS.AGR,
    weights: {
      R: 3, I: 2, A: 0, S: 0, E: 1, C: 1,
      O: 1, Cn: 3, Ex: 0, Ag: 1, ES: 2,
      OC: 1, SE: 1, CO: 2, ST: 2,
      Mech: 3, Log: 2, Verb: 0, Spat: 1, Num: 2, Voc: 0
    }
  },
  {
    code: "ENV",
    name: "Environment",
    hollandCode: "IRS",
    description: "Environmental conservation, ecology, sustainability, forestry, and natural resource management.",
    careers: CLUSTER_CAREERS.ENV,
    weights: {
      R: 2, I: 3, A: 0, S: 1, E: 0, C: 1,
      O: 3, Cn: 2, Ex: 0, Ag: 1, ES: 1,
      OC: 2, SE: 0, CO: 1, ST: 3,
      Mech: 1, Log: 3, Verb: 2, Spat: 1, Num: 2, Voc: 1
    }
  },
  {
    code: "AMC",
    name: "Arts, Media & Communication",
    hollandCode: "AES",
    description: "Journalism, filmmaking, mass media, broadcasting, public relations, content creation, and literature.",
    careers: CLUSTER_CAREERS.AMC,
    weights: {
      R: 0, I: 1, A: 3, S: 1, E: 2, C: 0,
      O: 3, Cn: 1, Ex: 2, Ag: 1, ES: 1,
      OC: 3, SE: 2, CO: 0, ST: 1,
      Mech: 0, Log: 1, Verb: 3, Spat: 1, Num: 0, Voc: 3
    }
  },
  {
    code: "FIN",
    name: "Accounts & Finance",
    hollandCode: "CEI",
    description: "Accounting, chartered accountancy, investment banking, taxation, wealth management, and auditing.",
    careers: CLUSTER_CAREERS.FIN,
    weights: {
      R: 0, I: 1, A: 0, S: 0, E: 2, C: 3,
      O: 1, Cn: 3, Ex: 1, Ag: 0, ES: 2,
      OC: 0, SE: 2, CO: 3, ST: 0,
      Mech: 0, Log: 3, Verb: 1, Spat: 0, Num: 3, Voc: 1
    }
  },
  {
    code: "BIZ",
    name: "Business & Entrepreneurship",
    hollandCode: "ECS",
    description: "Startups, venture creation, corporate management, sales, marketing, and business strategy.",
    careers: CLUSTER_CAREERS.BIZ,
    weights: {
      R: 0, I: 1, A: 0, S: 1, E: 3, C: 2,
      O: 2, Cn: 2, Ex: 3, Ag: 1, ES: 2,
      OC: 2, SE: 3, CO: 0, ST: 0,
      Mech: 0, Log: 2, Verb: 2, Spat: 0, Num: 2, Voc: 1
    }
  },
  {
    code: "DES",
    name: "Creative & Design",
    hollandCode: "ARI",
    description: "UI/UX, graphic design, fashion, interior design, animation, architecture, and visual arts.",
    careers: CLUSTER_CAREERS.DES,
    weights: {
      R: 1, I: 1, A: 3, S: 0, E: 1, C: 0,
      O: 3, Cn: 1, Ex: 0, Ag: 1, ES: 0,
      OC: 3, SE: 1, CO: 0, ST: 0,
      Mech: 1, Log: 1, Verb: 1, Spat: 3, Num: 0, Voc: 0
    }
  },
  {
    code: "EDU",
    name: "Education & Training",
    hollandCode: "SAI",
    description: "Teaching, pedagogy, academic research, corporate coaching, educational leadership, and curriculum design.",
    careers: CLUSTER_CAREERS.EDU,
    weights: {
      R: 0, I: 1, A: 1, S: 3, E: 1, C: 1,
      O: 2, Cn: 2, Ex: 2, Ag: 3, ES: 1,
      OC: 0, SE: 0, CO: 1, ST: 3,
      Mech: 0, Log: 1, Verb: 3, Spat: 0, Num: 0, Voc: 3
    }
  },
  {
    code: "EMG",
    name: "Emerging & Niche Careers",
    hollandCode: "IEA",
    description: "AI prompt engineering, robotics ethics, gaming, space tech, quantum computing, and frontier domains.",
    careers: CLUSTER_CAREERS.EMG,
    weights: {
      R: 1, I: 3, A: 1, S: 0, E: 2, C: 0,
      O: 3, Cn: 2, Ex: 1, Ag: 0, ES: 1,
      OC: 3, SE: 2, CO: 0, ST: 0,
      Mech: 1, Log: 3, Verb: 1, Spat: 2, Num: 2, Voc: 0
    }
  },
  {
    code: "GOV",
    name: "Government, Law & Public Policy",
    hollandCode: "ESC",
    description: "Civil services, judiciary, constitutional law, public administration, policy analysis, and diplomacy.",
    careers: CLUSTER_CAREERS.GOV,
    weights: {
      R: 0, I: 1, A: 0, S: 2, E: 2, C: 3,
      O: 1, Cn: 3, Ex: 1, Ag: 1, ES: 2,
      OC: 0, SE: 2, CO: 3, ST: 1,
      Mech: 0, Log: 3, Verb: 3, Spat: 0, Num: 1, Voc: 3
    }
  },
  {
    code: "HLT",
    name: "Healthcare & Life Sciences",
    hollandCode: "ISR",
    description: "Medicine, surgery, nursing, biomedical research, biotechnology, pharmacy, and clinical diagnostics.",
    careers: CLUSTER_CAREERS.HLT,
    weights: {
      R: 1, I: 3, A: 0, S: 2, E: 0, C: 1,
      O: 1, Cn: 3, Ex: 0, Ag: 2, ES: 2,
      OC: 0, SE: 1, CO: 1, ST: 3,
      Mech: 0, Log: 3, Verb: 2, Spat: 1, Num: 2, Voc: 1
    }
  },
  {
    code: "HSP",
    name: "Hospitality",
    hollandCode: "ESC",
    description: "Hotel management, culinary arts, tourism, event management, airline operations, and guest experience.",
    careers: CLUSTER_CAREERS.HSP,
    weights: {
      R: 0, I: 0, A: 1, S: 2, E: 3, C: 2,
      O: 1, Cn: 2, Ex: 3, Ag: 2, ES: 2,
      OC: 1, SE: 2, CO: 1, ST: 0,
      Mech: 0, Log: 1, Verb: 2, Spat: 0, Num: 1, Voc: 2
    }
  },
  {
    code: "ITC",
    name: "IT & Computers",
    hollandCode: "ICR",
    description: "Software engineering, cloud architecture, cybersecurity, web development, data science, and IT systems.",
    careers: CLUSTER_CAREERS.ITC,
    weights: {
      R: 1, I: 3, A: 0, S: 0, E: 0, C: 2,
      O: 2, Cn: 3, Ex: 0, Ag: 0, ES: 1,
      OC: 2, SE: 1, CO: 1, ST: 0,
      Mech: 0, Log: 3, Verb: 1, Spat: 2, Num: 3, Voc: 0
    }
  },
  {
    code: "PSF",
    name: "Personal Services & Freelance",
    hollandCode: "SEA",
    description: "Consulting, freelance consulting, fitness training, styling, beauty, personal coaching, and independent services.",
    careers: CLUSTER_CAREERS.PSF,
    weights: {
      R: 1, I: 0, A: 2, S: 2, E: 2, C: 0,
      O: 2, Cn: 1, Ex: 2, Ag: 2, ES: 1,
      OC: 2, SE: 1, CO: 0, ST: 1,
      Mech: 0, Log: 0, Verb: 2, Spat: 1, Num: 0, Voc: 1
    }
  },
  {
    code: "SAF",
    name: "Public Safety",
    hollandCode: "RSE",
    description: "Police, armed forces, defense, disaster management, emergency services, and fire rescue.",
    careers: CLUSTER_CAREERS.SAF,
    weights: {
      R: 3, I: 0, A: 0, S: 2, E: 1, C: 1,
      O: 0, Cn: 3, Ex: 1, Ag: 1, ES: 3,
      OC: 0, SE: 1, CO: 3, ST: 2,
      Mech: 2, Log: 2, Verb: 1, Spat: 2, Num: 1, Voc: 0
    }
  },
  {
    code: "SOC",
    name: "Social Services & Nonprofit",
    hollandCode: "SEC",
    description: "NGO management, social work, human rights advocacy, mental health counseling, and community development.",
    careers: CLUSTER_CAREERS.SOC,
    weights: {
      R: 0, I: 1, A: 0, S: 3, E: 1, C: 1,
      O: 1, Cn: 1, Ex: 2, Ag: 3, ES: 2,
      OC: 0, SE: 0, CO: 1, ST: 3,
      Mech: 0, Log: 1, Verb: 2, Spat: 0, Num: 0, Voc: 2
    }
  },
  {
    code: "SPT",
    name: "Sports & Athletics",
    hollandCode: "RSE",
    description: "Professional sports, athletic coaching, sports physiology, sports management, and refereeing.",
    careers: CLUSTER_CAREERS.SPT,
    weights: {
      R: 3, I: 0, A: 0, S: 2, E: 1, C: 0,
      O: 0, Cn: 2, Ex: 2, Ag: 1, ES: 3,
      OC: 1, SE: 3, CO: 0, ST: 0,
      Mech: 1, Log: 1, Verb: 1, Spat: 2, Num: 0, Voc: 0
    }
  },
  {
    code: "SEM",
    name: "Science, Engineering & Mathematics",
    hollandCode: "IRC",
    description: "Mechanical, civil, electrical engineering, physics, mathematics, chemistry, data analytics, and deep scientific research.",
    careers: CLUSTER_CAREERS.SEM,
    weights: {
      R: 2, I: 3, A: 0, S: 0, E: 0, C: 1,
      O: 3, Cn: 2, Ex: 0, Ag: 0, ES: 1,
      OC: 2, SE: 1, CO: 1, ST: 1,
      Mech: 3, Log: 3, Verb: 1, Spat: 3, Num: 3, Voc: 0
    }
  },
  {
    code: "TRL",
    name: "Transport & Logistics",
    hollandCode: "CRE",
    description: "Supply chain management, logistics operations, aviation, maritime shipping, and fleet management.",
    careers: CLUSTER_CAREERS.TRL,
    weights: {
      R: 2, I: 0, A: 0, S: 0, E: 1, C: 3,
      O: 0, Cn: 3, Ex: 1, Ag: 1, ES: 2,
      OC: 0, SE: 1, CO: 3, ST: 0,
      Mech: 2, Log: 2, Verb: 1, Spat: 3, Num: 2, Voc: 0
    }
  }
];

export async function seedCareerClustersToDatabase() {
  const seeded = [];

  for (const item of DEFAULT_CAREER_CLUSTERS) {
    // 1. Upsert Cluster
    const cluster = await prisma.careerCluster.upsert({
      where: { code: item.code },
      update: {
        name: item.name,
        hollandCode: item.hollandCode,
        description: item.description
      },
      create: {
        code: item.code,
        name: item.name,
        hollandCode: item.hollandCode,
        description: item.description
      }
    });

    // 2. Upsert each facet weight
    for (const [facet, weight] of Object.entries(item.weights)) {
      await prisma.careerClusterWeight.upsert({
        where: {
          clusterId_facet: {
            clusterId: cluster.id,
            facet
          }
        },
        update: {
          weight: Number(weight)
        },
        create: {
          clusterId: cluster.id,
          facet,
          weight: Number(weight)
        }
      });
    }

    seeded.push(cluster);
  }

  return seeded;
}
