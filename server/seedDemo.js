const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");

// Models
const SchoolProfile = require("./models/SchoolProfile");
const Academic = require("./models/Academic");
const Course = require("./models/Course");
const Activity = require("./models/Activity");
const Facility = require("./models/Facility");
const Faculty = require("./models/Faculty");
const Gallery = require("./models/Gallery");
const News = require("./models/News");
const Notice = require("./models/Notice");
const Admission = require("./models/Admission");
const FeeStructure = require("./models/FeeStructure");
const Achievement = require("./models/Achievement");

const CONFIRM_FLAG = "--confirm";

const seedDemo = async () => {
  try {
    if (!process.argv.includes(CONFIRM_FLAG)) {
      console.log("\n⚠️  DEMO DATABASE SEED");
      console.log("--------------------------------------------");
      console.log("This will DELETE existing demo content from:");
      console.log("- SchoolProfile");
      console.log("- Academic");
      console.log("- Course");
      console.log("- Activity");
      console.log("- Facility");
      console.log("- Faculty");
      console.log("- Gallery");
      console.log("- News");
      console.log("- Notice");
      console.log("- Admission");
      console.log("- FeeStructure");
      console.log("- Achievement");
      console.log("--------------------------------------------");
      console.log("Admin accounts will NOT be touched.");
      console.log("\nRun this command to continue:");
      console.log("node seedDemo.js --confirm\n");
      process.exit(0);
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured.");
    }

    console.log("\nConnecting to MongoDB...");
    await connectDB();

    console.log("MongoDB connected successfully.\n");

    // --------------------------------------------------
    // CLEAR DEMO COLLECTIONS
    // --------------------------------------------------

    console.log("Clearing demo collections...");

    await Promise.all([
      SchoolProfile.deleteMany({}),
      Academic.deleteMany({}),
      Course.deleteMany({}),
      Activity.deleteMany({}),
      Facility.deleteMany({}),
      Faculty.deleteMany({}),
      Gallery.deleteMany({}),
      News.deleteMany({}),
      Notice.deleteMany({}),
      Admission.deleteMany({}),
      FeeStructure.deleteMany({}),
      Achievement.deleteMany({}),
    ]);

    console.log("Demo collections cleared.\n");

    // --------------------------------------------------
    // SCHOOL PROFILE
    // --------------------------------------------------

    console.log("Creating school profile...");

    await SchoolProfile.create({
      schoolName: "St. Xavier's International School",
      shortName: "St. Xavier's",

      logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=300&auto=format&fit=crop&q=80",

      tagline: "Where Learning Meets Character, Leadership & Innovation",

      establishedYear: "1998",
      board: "CBSE & International Baccalaureate (IB) Candidate",
      medium: "English Medium",

      address: "124 Academy Boulevard, Knowledge Park III",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110001",

      phone: "+91 98765 43210",
      alternatePhone: "+91 11 2345 6789",

      email: "admissions@xaviersint.edu.in",
      alternateEmail: "info@xaviersint.edu.in",

      whatsapp: "919876543210",

      officeHours: "Monday – Saturday: 8:00 AM – 4:00 PM",

      websiteUrl: "https://xaviersint.edu.in",

      googleMapsUrl: "https://maps.google.com/?q=New+Delhi",

      socialLinks: {
        facebook: {
          url: "https://facebook.com",
          isVisible: true,
        },
        twitter: {
          url: "https://twitter.com",
          isVisible: true,
        },
        instagram: {
          url: "https://instagram.com",
          isVisible: true,
        },
        youtube: {
          url: "https://youtube.com",
          isVisible: true,
        },
        linkedin: {
          url: "https://linkedin.com",
          isVisible: true,
        },
      },

      feeVisibility: true,

      heroSettings: {
        title: "Empowering Minds, Shaping Bright Futures",

        subtitle: "Where Learning Meets Character & Leadership",

        description:
          "A premier educational institution dedicated to academic excellence, holistic growth, and strong moral values.",

        image:
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80",

        primaryBtnText: "Admission Enquiry",
        primaryBtnLink: "/contact",

        secondaryBtnText: "Explore Our School",
        secondaryBtnLink: "/about",

        isVisible: true,
      },

      aboutSettings: {
        heading: "Nurturing Tomorrow's Visionaries",

        subheading: "Established in 1998",

        description:
          "Founded with a visionary commitment to offer benchmarked education, St. Xavier's International School has grown into a premier learning sanctuary.",

        history:
          "Over 28 years of academic excellence and holistic development.",

        vision:
          "To inspire curiosity, nurture critical thinking, and foster resilient global citizens.",

        mission:
          "Providing a modern, safe, and collaborative learning environment combining rigorous academic standards with sports and arts.",

        image:
          "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",

        coreValues: [
          "Integrity & Moral Leadership",
          "Academic Rigor & Inquiry",
          "Diversity & Cultural Inclusivity",
          "Environmental Stewardship",
        ],

        whyChooseUs: [
          {
            title: "Experienced Faculty",
            description:
              "95+ certified educators with master degrees and continuous international training.",
            icon: "GraduationCap",
            isVisible: true,
            order: 0,
          },
          {
            title: "Smart Classrooms",
            description:
              "Interactive HD touch panels, digital content suites, and climate-controlled rooms.",
            icon: "Sparkles",
            isVisible: true,
            order: 1,
          },
          {
            title: "Safe 25-Acre Campus",
            description:
              "24/7 CCTV surveillance, RFID gate access, and trained security personnel.",
            icon: "ShieldCheck",
            isVisible: true,
            order: 2,
          },
          {
            title: "Holistic Development",
            description:
              "Combines robotics, performing arts, sports leagues, and public speaking.",
            icon: "Trophy",
            isVisible: true,
            order: 3,
          },
        ],
      },

      homepageSections: {
        hero: true,
        highlights: true,
        about: true,
        whyChooseUs: true,
        academics: true,
        courses: true,
        activities: true,
        facilities: true,
        principalMessage: true,
        achievements: true,
        news: true,
        gallery: true,
        admissionCta: true,
        contactPreview: true,
        footer: true,
      },

      pageVisibility: {
        about: true,
        academics: true,
        courses: true,
        activities: true,
        facilities: true,
        faculty: true,
        admissions: true,
        feeStructure: true,
        gallery: true,
        news: true,
        notices: true,
        contact: true,
      },

      highlights: [
        {
          label: "Years of Excellence",
          value: "28+",
          icon: "Award",
          isVisible: true,
          order: 0,
        },
        {
          label: "Enrolled Students",
          value: "1,850+",
          icon: "Users",
          isVisible: true,
          order: 1,
        },
        {
          label: "Qualified Faculty",
          value: "95+",
          icon: "GraduationCap",
          isVisible: true,
          order: 2,
        },
        {
          label: "Activities & Sports",
          value: "35+",
          icon: "Trophy",
          isVisible: true,
          order: 3,
        },
      ],
    });

    // --------------------------------------------------
    // ACADEMICS
    // --------------------------------------------------

    console.log("Creating academics...");

    await Academic.insertMany([
      {
        category: "Pre-Primary",
        grades: "Nursery, LKG, UKG",
        description:
          "Play-based experiential curriculum nurturing sensory development and early literacy.",
        subjects: [
          "Phonics & Storytelling",
          "Number Magic",
          "Environmental Play",
          "Creative Arts & Music",
        ],
        methodology:
          "Activity-Centric Montessori & Reggio Emilia Inspired Learning",
        ageGroup: "3 to 5 Years",
        isVisible: true,
        order: 0,
      },
      {
        category: "Primary",
        grades: "Classes 1 – 5",
        description:
          "Comprehensive foundational academic program focused on critical thinking and STEM exposure.",
        subjects: [
          "English Literature",
          "Mathematics",
          "Environmental Science",
          "Second Language",
          "Computer & Robotics Lab",
        ],
        methodology: "Interactive Smart Board Lessons & Practical Experiments",
        ageGroup: "6 to 10 Years",
        isVisible: true,
        order: 1,
      },
      {
        category: "Middle",
        grades: "Classes 6 – 8",
        description:
          "Inquiry-based middle school framework encouraging analytical reasoning and research aptitude.",
        subjects: [
          "Advanced Mathematics",
          "Physics",
          "Chemistry",
          "Biology",
          "Social Sciences",
          "Third Language (French/German/Sanskrit)",
        ],
        methodology: "Project-Based Learning & Experiential Lab Work",
        ageGroup: "11 to 13 Years",
        isVisible: true,
        order: 2,
      },
      {
        category: "Secondary",
        grades: "Classes 9 – 10",
        description:
          "CBSE Secondary board preparation with intensive mock exams and Olympiad training.",
        subjects: [
          "Mathematics",
          "Science (Phy/Chem/Bio)",
          "Social Science",
          "English Language",
          "Artificial Intelligence",
        ],
        methodology:
          "NCERT Benchmark Modules & Continuous Comprehensive Assessment",
        ageGroup: "14 to 15 Years",
        isVisible: true,
        order: 3,
      },
      {
        category: "Senior Secondary",
        grades: "Classes 11 – 12",
        description:
          "Specialized stream education integrated with entrance exam coaching.",
        subjects: [
          "Physics/Accountancy/History",
          "Chemistry/Business Studies/Pol. Science",
          "Maths/Economics/Psychology",
          "Computer Science/IP/Physical Ed.",
        ],
        methodology: "Stream-Focused Mentorship & Competitive Exam Prep",
        ageGroup: "16 to 17 Years",
        isVisible: true,
        order: 4,
      },
    ]);

    // --------------------------------------------------
    // COURSES
    // --------------------------------------------------

    console.log("Creating courses...");

    await Course.insertMany([
      {
        title: "Robotics & Artificial Intelligence Lab",
        description:
          "Hands-on programming using LEGO Mindstorms, Arduino microcontrollers, and Python AI algorithms.",
        category: "Technology & AI",
        image:
          "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
        features: [
          "Sensory Robotics Kits",
          "Python Programming",
          "3D Printing Design",
        ],
        ageApplicability: "Classes 4 – 12",
        isActive: true,
        isVisible: true,
        order: 0,
      },
      {
        title: "Global Language Proficiency",
        description:
          "Immersive foreign language learning with certified modules.",
        category: "Languages",
        image:
          "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
        features: [
          "Native Accent Labs",
          "Cultural Exchange Programs",
          "International Certifications",
        ],
        ageApplicability: "Classes 6 – 12",
        isActive: true,
        isVisible: true,
        order: 1,
      },
      {
        title: "Model United Nations & Public Debate",
        description:
          "Develops diplomacy, research, public speaking and leadership skills.",
        category: "Leadership & Humanities",
        image:
          "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80",
        features: [
          "National MUN Simulations",
          "Policy Research",
          "Oratory Masterclasses",
        ],
        ageApplicability: "Classes 8 – 12",
        isActive: true,
        isVisible: true,
        order: 2,
      },
    ]);

    // --------------------------------------------------
    // ACTIVITIES
    // --------------------------------------------------

    console.log("Creating activities...");

    await Activity.insertMany([
      {
        title: "Inter-School Football & Cricket League",
        category: "Sports",
        description:
          "Professional grass pitches, net practice facilities, and certified coaches training students.",
        image:
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80",
        isFeatured: true,
        isVisible: true,
        order: 0,
      },
      {
        title: "Classical & Western Performing Arts Academy",
        category: "Cultural",
        description: "Dance, orchestra, rock band and theatrical productions.",
        image:
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
        isFeatured: true,
        isVisible: true,
        order: 1,
      },
    ]);

    // --------------------------------------------------
    // FACILITIES
    // --------------------------------------------------

    console.log("Creating facilities...");

    await Facility.insertMany([
      {
        title: "Interactive Smart Classrooms",
        description:
          "85-inch 4K touch displays, ergonomic desks and climate-controlled classrooms.",
        image:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
        isFeatured: true,
        isVisible: true,
        order: 0,
      },
      {
        title: "Olympic-Standard Sports Complex",
        description:
          "Swimming pool, football turf, basketball courts and indoor badminton arena.",
        image:
          "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&auto=format&fit=crop&q=80",
        isFeatured: true,
        isVisible: true,
        order: 1,
      },
    ]);

    // --------------------------------------------------
    // FACULTY
    // --------------------------------------------------

    console.log("Creating faculty...");

    await Faculty.insertMany([
      {
        name: "Dr. Evelyn Montgomery",
        role: "Principal & Director of Education",
        subject: "Educational Leadership & Physics",
        qualification: "Ph.D. in Education, M.Sc. Physics",
        experience: "24+ Years Experience",
        photo:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
        message:
          "Welcome to St. Xavier's International School. We foster academic curiosity alongside moral integrity and resilience.",
        isLeadership: true,
        isVisible: true,
        order: 0,
      },
      {
        name: "Prof. Rajesh Sharma",
        role: "Head of Senior Secondary",
        subject: "Physics & Applied Mathematics",
        qualification: "M.Tech, B.Ed",
        experience: "18+ Years Experience",
        photo:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=80",
        isLeadership: false,
        isVisible: true,
        order: 1,
      },
    ]);

    // --------------------------------------------------
    // ACHIEVEMENTS
    // --------------------------------------------------

    console.log("Creating achievements...");

    await Achievement.insertMany([
      {
        title: "1st Rank - National STEM Robotics Expo 2025",
        description:
          "Our senior robotics squad secured the Gold Medal for designing an autonomous AI disaster management drone.",
        category: "STEM",
        image:
          "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80",
        isVisible: true,
        order: 0,
      },
      {
        title: "100% Class 12 Board Results",
        description:
          "Overall school average stood at 89.4% with students scoring above 95%.",
        category: "Academic",
        image:
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
        isVisible: true,
        order: 1,
      },
    ]);

    // --------------------------------------------------
    // GALLERY
    // --------------------------------------------------

    console.log("Creating gallery...");

    await Gallery.insertMany([
      {
        title: "State-of-the-Art Science Research Wing",
        image:
          "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80",
        category: "Laboratories",
        isVisible: true,
        order: 0,
      },
      {
        title: "Annual Athletic Meet Track Event",
        image:
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80",
        category: "Sports",
        isVisible: true,
        order: 1,
      },
    ]);

    // --------------------------------------------------
    // NEWS
    // --------------------------------------------------

    console.log("Creating news...");

    await News.insertMany([
      {
        title: 'Annual Cultural Fest "Xavieriana 2026" Announced',
        description:
          "Three-day inter-school celebration featuring drama, music, art installations and guest lectures.",
        category: "Event",
        coverImage:
          "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
        isPublished: true,
        isVisible: true,
        order: 0,
      },
    ]);

    // --------------------------------------------------
    // NOTICES
    // --------------------------------------------------

    console.log("Creating notices...");

    await Notice.insertMany([
      {
        title: "Admissions Open for Session 2026–2027",
        description:
          "Online registration forms are live. Limited seats available.",
        isPublished: true,
        isVisible: true,
        isImportant: true,
        order: 0,
      },
    ]);

    // --------------------------------------------------
    // FEES
    // --------------------------------------------------

    console.log("Creating fee structure...");

    await FeeStructure.insertMany([
      {
        academicYear: "2026–2027",
        classGrade: "Pre-Primary (Nursery, LKG, UKG)",
        admissionFee: "₹ 25,000 (One-Time)",
        tuitionFee: "₹ 4,800 / Month",
        annualCharges: "₹ 12,000 / Year",
        otherCharges: "₹ 3,000 (Activity & Materials)",
        isVisible: true,
        order: 0,
      },
      {
        academicYear: "2026–2027",
        classGrade: "Primary (Classes 1 – 5)",
        admissionFee: "₹ 30,000 (One-Time)",
        tuitionFee: "₹ 5,800 / Month",
        annualCharges: "₹ 15,000 / Year",
        otherCharges: "₹ 4,000 (STEM Lab)",
        isVisible: true,
        order: 1,
      },
      {
        academicYear: "2026–2027",
        classGrade: "Secondary (Classes 9 – 10)",
        admissionFee: "₹ 40,000 (One-Time)",
        tuitionFee: "₹ 7,800 / Month",
        annualCharges: "₹ 20,000 / Year",
        otherCharges: "₹ 6,000 (Board Prep & Labs)",
        isVisible: true,
        order: 2,
      },
    ]);

    // --------------------------------------------------
    // ADMISSIONS
    // --------------------------------------------------

    console.log("Creating admission information...");

    await Admission.create({
      academicYear: "2026–2027",
      isAdmissionsOpen: true,
      statusMessage: "Admissions Open for Nursery through Class 11",

      processSteps: [
        {
          stepNumber: 1,
          title: "Enquiry & Prospectus",
          description: "Submit online form or visit campus admissions desk.",
        },
        {
          stepNumber: 2,
          title: "Campus Tour",
          description: "Interactive session with academic counsellors.",
        },
        {
          stepNumber: 3,
          title: "Document Verification",
          description: "Verify birth certificate and report card.",
        },
        {
          stepNumber: 4,
          title: "Seat Allotment & Fee Submission",
          description: "Secure seat upon fee submission.",
        },
      ],
    });

    console.log("\n============================================");
    console.log("✅ DEMO DATABASE SEED COMPLETED");
    console.log("============================================");
    console.log("School profile       ✓");
    console.log("Academics            ✓");
    console.log("Courses              ✓");
    console.log("Activities           ✓");
    console.log("Facilities           ✓");
    console.log("Faculty              ✓");
    console.log("Achievements        ✓");
    console.log("Gallery              ✓");
    console.log("News                 ✓");
    console.log("Notices              ✓");
    console.log("Fee structure        ✓");
    console.log("Admissions           ✓");
    console.log("--------------------------------------------");
    console.log("Admin accounts were NOT modified.");
    console.log("============================================\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ DEMO SEED FAILED");
    console.error(error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDemo();
