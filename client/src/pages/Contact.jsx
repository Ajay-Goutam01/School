import React, { useState, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import PageUnavailable from "../components/PageUnavailable";
import api from "../services/api";
import { useSchool } from "../context/SchoolContext";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Navigation,
} from "lucide-react";

const Contact = () => {
  const { profile, pageVisibility } = useSchool();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    studentName: "",
    classInterested: "Grade 1",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = `Contact Us | ${profile.schoolName}`;
  }, [profile]);

  if (pageVisibility.contact === false) {
    return <PageUnavailable pageTitle="Contact Us" />;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const res = await api.post("/enquiries", form);
      if (res.data && res.data.success) {
        setSuccess(true);
        setForm({
          name: "",
          email: "",
          phone: "",
          studentName: "",
          classInterested: "Grade 1",
          message: "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Automated WhatsApp URL
  const cleanWhatsapp = (profile.whatsapp || "").replace(/[^0-9]/g, "");
  const defaultMsg = encodeURIComponent(
    profile.defaultWhatsappMessage ||
      "Hello, I would like to enquire about admission.",
  );
  const whatsappUrl = `https://wa.me/${cleanWhatsapp.length === 10 ? "91" + cleanWhatsapp : cleanWhatsapp}?text=${defaultMsg}`;

  // Automated Google Maps URL
  const mapsUrl =
    profile.googleMapsUrl ||
    (profile.latitude && profile.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${profile.latitude},${profile.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${profile.address || ""}, ${profile.city || ""}, ${profile.state || ""} ${profile.pincode || ""}`)}`);

  return (
    <div>
      <Breadcrumb
        title="Contact Our Admissions Desk"
        subtitle="Have questions about admissions, curriculum, or campus visits? Reach out to our school administration."
        items={[{ label: "Contact Us" }]}
      />

      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-navy-950 text-white p-8 rounded-2xl shadow-xl space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-serif">
                    {profile.schoolName}
                  </h3>
                  <p className="text-xs text-gold-400 font-medium mt-1">
                    School Campus & Administrative Office
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm">
                  {profile.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">
                          Campus Address
                        </p>
                        <p className="text-slate-300 leading-normal">
                          {profile.address}, {profile.city}, {profile.state} -{" "}
                          {profile.pincode}
                        </p>
                      </div>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">
                          Telephone Numbers
                        </p>
                        <p className="text-slate-300">
                          {profile.phone}{" "}
                          {profile.alternatePhone &&
                            `| ${profile.alternatePhone}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {profile.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">
                          Official Email Desk
                        </p>
                        <p className="text-slate-300">
                          {profile.email}{" "}
                          {profile.alternateEmail &&
                            `| ${profile.alternateEmail}`}
                        </p>
                      </div>
                    </div>
                  )}

                  {profile.whatsapp && (
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">
                          WhatsApp Helpline
                        </p>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gold-400 hover:underline font-semibold flex items-center gap-1 mt-0.5"
                        >
                          <span>+{profile.whatsapp}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {profile.officeHours && (
                    <div className="flex items-start gap-3 border-t border-navy-800 pt-3">
                      <Clock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-white">
                          Visiting & Office Hours
                        </p>
                        <p className="text-slate-300">{profile.officeHours}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* LOCATION MAP CARD */}
              <div className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-3 text-center sm:text-left">
                <div className="flex items-center gap-2 text-navy-900">
                  <Navigation className="w-5 h-5 text-gold-600 shrink-0" />
                  <h4 className="font-bold font-serif text-base">
                    Find Us On Google Maps
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  Located at {profile.address}, {profile.city}. Click below to
                  open turn-by-turn navigation directly in Google Maps.
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold transition inline-flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 rounded-2xl shadow-subtle border border-slate-200 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-serif text-navy-900">
                    Send an Enquiry Message
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the form below and our admissions team will respond
                    within 24 hours.
                  </p>
                </div>

                {success && (
                  <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      Thank you! Your enquiry has been received. Our team will
                      contact you shortly.
                    </span>
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold flex items-center gap-2 border border-rose-200">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Parent / Guardian Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-navy-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-navy-900"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-navy-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Applying for Class
                      </label>
                      <select
                        name="classInterested"
                        value={form.classInterested}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-navy-900 bg-white"
                      >
                        <option value="Nursery / Kindergarten">
                          Nursery / Kindergarten
                        </option>
                        <option value="Primary (Classes 1 - 5)">
                          Primary (Classes 1 - 5)
                        </option>
                        <option value="Middle (Classes 6 - 8)">
                          Middle (Classes 6 - 8)
                        </option>
                        <option value="Secondary (Classes 9 - 10)">
                          Secondary (Classes 9 - 10)
                        </option>
                        <option value="Sr. Secondary (Classes 11 - 12)">
                          Sr. Secondary (Classes 11 - 12)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enquiry Message *
                    </label>
                    <textarea
                      rows={4}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Ask about admissions criteria, school bus routes, or campus visits..."
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-navy-900 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-gold-400" />
                    <span>
                      {loading ? "Submitting..." : "Submit Enquiry Message"}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
