const mongoose = require('mongoose');

const schoolProfileSchema = new mongoose.Schema({
  schoolName: { type: String, required: true, default: "St. Xavier's International School" },
  shortName: { type: String, default: "St. Xavier's" },
  logo: { type: String, default: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80" },
  logoId: { type: String, default: "" },
  tagline: { type: String, default: "Where Learning Meets Character & Leadership" },
  establishedYear: { type: String, default: "1998" },
  board: { type: String, default: "CBSE & International Baccalaureate (IB) Candidate" },
  medium: { type: String, default: "English" },
  address: { type: String, default: "124 Academy Boulevard, Knowledge Park III" },
  city: { type: String, default: "New Delhi" },
  state: { type: String, default: "Delhi" },
  pincode: { type: String, default: "110001" },
  phone: { type: String, default: "+91 98765 43210" },
  alternatePhone: { type: String, default: "+91 11 2345 6789" },
  email: { type: String, default: "admissions@xaviersint.edu.in" },
  alternateEmail: { type: String, default: "info@xaviersint.edu.in" },
  whatsapp: { type: String, default: "919876543210" },
  defaultWhatsappMessage: { type: String, default: "Hello, I would like to enquire about admission." },
  officeHours: { type: String, default: "Monday – Saturday: 8:00 AM – 4:00 PM" },
  websiteUrl: { type: String, default: "https://xaviersint.edu.in" },
  googleMapsUrl: { type: String, default: "https://maps.google.com/?q=New+Delhi" },
  customGoogleMapsUrl: { type: String, default: "" },
  latitude: { type: Number },
  longitude: { type: Number },
  
  socialLinks: {
    facebook: { url: { type: String, default: "https://facebook.com" }, isVisible: { type: Boolean, default: true } },
    twitter: { url: { type: String, default: "https://twitter.com" }, isVisible: { type: Boolean, default: true } },
    instagram: { url: { type: String, default: "https://instagram.com" }, isVisible: { type: Boolean, default: true } },
    youtube: { url: { type: String, default: "https://youtube.com" }, isVisible: { type: Boolean, default: true } },
    linkedin: { url: { type: String, default: "https://linkedin.com" }, isVisible: { type: Boolean, default: true } }
  },

  feeVisibility: { type: Boolean, default: true },

  heroSettings: {
    title: { type: String, default: "Empowering Minds, Shaping Bright Futures" },
    subtitle: { type: String, default: "Where Learning Meets Character & Leadership" },
    description: { type: String, default: "A premier educational institution dedicated to academic excellence, holistic growth, and strong moral values." },
    image: { type: String, default: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80" },
    imageId: { type: String, default: "" },
    primaryBtnText: { type: String, default: "Admission Enquiry" },
    primaryBtnLink: { type: String, default: "/contact" },
    secondaryBtnText: { type: String, default: "Explore Our School" },
    secondaryBtnLink: { type: String, default: "/about" },
    isVisible: { type: Boolean, default: true }
  },

  aboutSettings: {
    heading: { type: String, default: "Nurturing Tomorrow's Visionaries" },
    subheading: { type: String, default: "Established in 1998" },
    description: { type: String, default: "Founded with a visionary commitment to offer benchmarked education, St. Xavier's International School has grown into a premier learning sanctuary." },
    history: { type: String, default: "Over 28 years of academic excellence and holistic development." },
    vision: { type: String, default: "To inspire curiosity, nurture critical thinking, and foster resilient global citizens." },
    mission: { type: String, default: "Providing a modern, safe, and collaborative learning environment." },
    image: { type: String, default: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80" },
    imageId: { type: String, default: "" },
    coreValues: [{ type: String }],
    whyChooseUs: [{
      title: String,
      description: String,
      icon: { type: String, default: "CheckCircle2" },
      isVisible: { type: Boolean, default: true },
      order: { type: Number, default: 0 }
    }]
  },

  homepageSections: {
    hero: { type: Boolean, default: true },
    highlights: { type: Boolean, default: true },
    about: { type: Boolean, default: true },
    whyChooseUs: { type: Boolean, default: true },
    academics: { type: Boolean, default: true },
    courses: { type: Boolean, default: true },
    activities: { type: Boolean, default: true },
    facilities: { type: Boolean, default: true },
    principalMessage: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    news: { type: Boolean, default: true },
    gallery: { type: Boolean, default: true },
    admissionCta: { type: Boolean, default: true },
    contactPreview: { type: Boolean, default: true },
    footer: { type: Boolean, default: true }
  },

  pageVisibility: {
    about: { type: Boolean, default: true },
    academics: { type: Boolean, default: true },
    courses: { type: Boolean, default: true },
    activities: { type: Boolean, default: true },
    facilities: { type: Boolean, default: true },
    faculty: { type: Boolean, default: true },
    admissions: { type: Boolean, default: true },
    feeStructure: { type: Boolean, default: true },
    gallery: { type: Boolean, default: true },
    news: { type: Boolean, default: true },
    notices: { type: Boolean, default: true },
    contact: { type: Boolean, default: true }
  },

  footerSettings: {
    description: { type: String, default: "Dedicated to nurturing intellectual curiosity, ethical values, and holistic leadership in every child." },
    copyrightText: { type: String, default: "All Rights Reserved." },
    showQuickLinks: { type: Boolean, default: true },
    showImportantLinks: { type: Boolean, default: true },
    showContactInfo: { type: Boolean, default: true },
    showSocialLinks: { type: Boolean, default: true }
  },

  contactFormSettings: {
    contactFormVisible: { type: Boolean, default: true },
    admissionEnquiryFormVisible: { type: Boolean, default: true }
  },

  highlights: [{
    label: String,
    value: String,
    icon: String,
    isVisible: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('SchoolProfile', schoolProfileSchema);
