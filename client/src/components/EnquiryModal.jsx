import React, { useState } from "react";
import { useSchool } from "../context/SchoolContext";
import api from "../services/api";
import { X, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const EnquiryModal = () => {
  const { enquiryModalOpen, closeEnquiryModal, profile } = useSchool();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    studentName: "",
    classInterested: "Nursery",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!enquiryModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      setErrorMsg("Please fill in all required fields marked with *");
      return;
    }

    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/enquiries", formData);
      if (res.data && res.data.success) {
        setSuccessMsg(
          res.data.message ||
            "Thank you! Your enquiry has been submitted successfully. The school will contact you soon.",
        );
        setFormData({
          name: "",
          phone: "",
          email: "",
          studentName: "",
          classInterested: "Nursery",
          message: "",
        });
      } else {
        setErrorMsg(res.data.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      setErrorMsg(
        err.response?.data?.message ||
          "Unable to submit your enquiry. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-navy-950 text-white p-6 relative">
          <button
            onClick={closeEnquiryModal}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-navy-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
            Admissions Desk
          </span>
          <h2 className="text-xl font-bold font-serif mt-1">
            Admission Enquiry Form
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Interested in enrolling your child at {profile.schoolName}? Submit
            your details below.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {successMsg ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Enquiry Submitted!
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                {successMsg}
              </p>
              <button
                onClick={() => {
                  setSuccessMsg("");
                  closeEnquiryModal();
                }}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 transition"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Robert Smith"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-navy-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-navy-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-navy-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Child's full name"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-navy-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Class Interested In
                </label>
                <select
                  name="classInterested"
                  value={formData.classInterested}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-navy-900 outline-none bg-white"
                >
                  <option value="Nursery">Nursery / Playgroup</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  <option value="Primary (Grade 1-5)">
                    Primary (Classes 1 – 5)
                  </option>
                  <option value="Middle (Grade 6-8)">
                    Middle (Classes 6 – 8)
                  </option>
                  <option value="Secondary (Grade 9-10)">
                    Secondary (Classes 9 – 10)
                  </option>
                  <option value="Sr. Secondary (Grade 11-12)">
                    Senior Secondary (Classes 11 – 12)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Your Message or Specific Questions *
                </label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please share any questions regarding admission process, campus visit, or bus facility..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:border-navy-900 outline-none resize-none"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white bg-gold-600 hover:bg-gold-700 transition shadow-gold disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
