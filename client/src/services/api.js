import axios from "axios";

const API_BASE_URL = "https://school-server-black.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// Interceptor to attach JWT token to request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("school_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor for handling 401 Session Expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes("/auth/login");
      if (!isAuthEndpoint && localStorage.getItem("school_admin_token")) {
        localStorage.removeItem("school_admin_token");
        if (
          window.location.pathname.startsWith("/admin") &&
          window.location.pathname !== "/admin/login"
        ) {
          window.location.href = "/admin/login?expired=true";
        }
      }
    }
    return Promise.reject(error);
  },
);

// Fallback institutional mock data if API server is not running
export const FALLBACK_PROFILE = {
  schoolName: "Talent Public School",
  shortName: "TPS",
  logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80",
  tagline: "Where Learning Meets Character & Global Leadership ",
  heroTitle: "Empowering Young Minds, Shaping Global Leaders",
  heroSubtitle:
    "A premier educational institution dedicated to academic rigor, character development, state-of-the-art STEM facilities, and holistic growth.",
  heroImage:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80",
  establishedYear: "1998",
  board: "CBSE & IB Candidate School",
  medium: "English",
  address: "Near Hanuman Temple, Azad Nagar",
  city: "Alirajpur",
  state: "Madhya Pradesh",
  pincode: "457887",
  phone: "+91 9876543210",
  alternatePhone: "+91 11 2345 6789",
  email: "[EMAIL_ADDRESS]",
  whatsapp: "919876543210",
  officeHours: "Monday – Saturday: 8:00 AM – 4:00 PM",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Talent+Public+School,+Alirajpur",
};

export default api;
