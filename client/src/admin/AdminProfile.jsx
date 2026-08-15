import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useSchool } from "../context/SchoolContext";
import ImageUploader from "../components/ImageUploader";
import {
  Building,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  MapPin,
  ExternalLink,
  KeyRound,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

const AdminProfile = () => {
  const { fetchProfile, updateProfile } = useSchool();
  const [profileData, setProfileData] = useState({
    schoolName: "",
    shortName: "",
    logo: "",
    logoId: "",
    tagline: "",
    establishedYear: "",
    board: "",
    medium: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    alternatePhone: "",
    whatsapp: "",
    defaultWhatsappMessage: "Hello, I would like to enquire about admission.",
    email: "",
    alternateEmail: "",
    officeHours: "",
    websiteUrl: "",
    googleMapsUrl: "",
    customGoogleMapsUrl: "",
    latitude: "",
    longitude: "",
    socialLinks: {
      facebook: { url: "", isVisible: true },
      twitter: { url: "", isVisible: true },
      instagram: { url: "", isVisible: true },
      youtube: { url: "", isVisible: true },
      linkedin: { url: "", isVisible: true },
    },
    feeVisibility: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Password Change State
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdError, setPwdError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/school");
      if (res.data && res.data.success && res.data.data) {
        setProfileData((prev) => ({
          ...prev,
          ...res.data.data,
          socialLinks: {
            ...prev.socialLinks,
            ...res.data.data.socialLinks,
          },
        }));
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (key, field, val) => {
    setProfileData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [key]: {
          ...prev.socialLinks[key],
          [field]: val,
        },
      },
    }));
  };

  const handleToggleFeeVisibility = async () => {
    try {
      const res = await api.patch("/school/fee-visibility", {
        feeVisibility: !profileData.feeVisibility,
      });
      if (res.data && res.data.success) {
        setProfileData((prev) => ({
          ...prev,
          feeVisibility: res.data.data.feeVisibility,
        }));
        if (updateProfile) {
          updateProfile({ feeVisibility: res.data.data.feeVisibility });
        } else {
          fetchProfile();
        }
        setMsg(res.data.message);
      }
    } catch (err) {
      alert("Failed to toggle fee visibility");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    try {
      const res = await api.put("/school", profileData);
      if (res.data && res.data.success) {
        setProfileData((prev) => ({ ...prev, ...res.data.data }));
        setMsg("School profile settings saved successfully!");
        if (updateProfile) {
          updateProfile(res.data.data);
        } else {
          fetchProfile();
        }
      }
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdSaving(true);
    setPwdMsg("");
    setPwdError("");

    try {
      const res = await api.put("/auth/change-password", pwdForm);
      if (res.data && res.data.success) {
        setPwdMsg(res.data.message);
        setPwdForm({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (err) {
      setPwdError(err.response?.data?.message || "Failed to change password");
    } finally {
      setPwdSaving(false);
    }
  };

  // Helper computed Google Maps URL for testing
  const generatedMapUrl =
    profileData.customGoogleMapsUrl ||
    (profileData.latitude && profileData.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${profileData.latitude},${profileData.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${profileData.address || ""}, ${profileData.city || ""}, ${profileData.state || ""} ${profileData.pincode || ""}`)}`);

  if (loading)
    return (
      <div className="p-8 text-slate-500 text-xs">
        Loading profile settings...
      </div>
    );

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">
          School Profile & Information
        </h1>
        <p className="text-xs text-slate-500">
          Manage institutional name, address, Google Maps location, contact
          numbers, logo upload, and security.
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* FEE VISIBILITY TOGGLE BANNER */}
      <div className="bg-navy-950 text-white rounded-2xl p-6 shadow-xl border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              Website Control
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${profileData.feeVisibility ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}
            >
              {profileData.feeVisibility
                ? "FEE VISIBLE (ON)"
                : "FEE HIDDEN (OFF)"}
            </span>
          </div>
          <h3 className="text-lg font-bold font-serif">
            Show Fee Structure On Public Website
          </h3>
          <p className="text-xs text-slate-300">
            {profileData.feeVisibility
              ? "Public visitors can view detailed tuition fee breakdown tables on /fee-structure."
              : "Public visitors see a notice to contact the admissions office directly for fee details."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleFeeVisibility}
          className={`px-6 py-3 rounded-xl font-semibold text-xs transition flex items-center gap-2 shadow-lg ${
            profileData.feeVisibility
              ? "bg-rose-600 hover:bg-rose-700 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {profileData.feeVisibility ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          <span>
            {profileData.feeVisibility
              ? "Switch OFF (Hide Fees)"
              : "Switch ON (Show Fees)"}
          </span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-subtle border border-slate-200 p-6 space-y-6"
      >
        <h3 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3">
          Basic Information
        </h3>

        {/* LOGO IMAGE UPLOADER */}
        <ImageUploader
          label="School Logo Image File (ImageKit Upload)"
          value={profileData.logo}
          fileId={profileData.logoId}
          onChange={(url, fileId) =>
            setProfileData((prev) => ({ ...prev, logo: url, logoId: fileId }))
          }
          onRemove={() =>
            setProfileData((prev) => ({ ...prev, logo: "", logoId: "" }))
          }
          aspectRatio="aspect-square w-32 h-32"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              School Full Name *
            </label>
            <input
              type="text"
              name="schoolName"
              value={profileData.schoolName}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Short Name
            </label>
            <input
              type="text"
              name="shortName"
              value={profileData.shortName}
              onChange={handleChange}
              placeholder="e.g. St. Xavier's"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              name="tagline"
              value={profileData.tagline}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Established Year
            </label>
            <input
              type="text"
              name="establishedYear"
              value={profileData.establishedYear}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Board / Affiliation
            </label>
            <input
              type="text"
              name="board"
              value={profileData.board}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
        </div>

        {/* ADDRESS & AUTOMATED GOOGLE MAPS */}
        <h3 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3 pt-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gold-600" /> Address & Google Maps
          Location Automation
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            name="address"
            value={profileData.address}
            onChange={handleChange}
            placeholder="e.g. 124 Academy Boulevard, Knowledge Park III"
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              City
            </label>
            <input
              type="text"
              name="city"
              value={profileData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              State
            </label>
            <input
              type="text"
              name="state"
              value={profileData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={profileData.pincode}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
        </div>

        {/* MAP AUTOMATION TEST & OVERRIDES */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-900">
              Auto-Generated Google Maps Link
            </span>
            <a
              href={generatedMapUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Find Location on Map
            </a>
          </div>
          <p className="text-[11px] text-slate-500">
            Google Maps search URL is automatically created from your street
            address, city, state, and pincode above.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Optional Latitude Override
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={profileData.latitude || ""}
                onChange={handleChange}
                placeholder="e.g. 28.6139"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Optional Longitude Override
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={profileData.longitude || ""}
                onChange={handleChange}
                placeholder="e.g. 77.2090"
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none bg-white"
              />
            </div>
          </div>
        </div>

        <h3 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3 pt-4">
          Contact Numbers & WhatsApp Automation
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Primary Phone
            </label>
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Alternate Phone
            </label>
            <input
              type="text"
              name="alternatePhone"
              value={profileData.alternatePhone}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              WhatsApp Number
            </label>
            <input
              type="text"
              name="whatsapp"
              value={profileData.whatsapp}
              onChange={handleChange}
              placeholder="e.g. 919876543210"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Default WhatsApp Message Template
          </label>
          <input
            type="text"
            name="defaultWhatsappMessage"
            value={profileData.defaultWhatsappMessage}
            onChange={handleChange}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Primary Email
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Alternate Email
            </label>
            <input
              type="email"
              name="alternateEmail"
              value={profileData.alternateEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>
        </div>

        <h3 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3 pt-4">
          Social Media Links
        </h3>

        {["facebook", "instagram", "youtube", "linkedin", "twitter"].map(
          (soc) => (
            <div key={soc} className="flex items-center gap-3">
              <span className="w-24 text-xs font-bold capitalize text-slate-700">
                {soc}:
              </span>
              <input
                type="text"
                placeholder={`https://${soc}.com/...`}
                value={profileData.socialLinks?.[soc]?.url || ""}
                onChange={(e) => handleSocialChange(soc, "url", e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              />
              <button
                type="button"
                onClick={() =>
                  handleSocialChange(
                    soc,
                    "isVisible",
                    !profileData.socialLinks?.[soc]?.isVisible,
                  )
                }
                className={`px-3 py-1 text-xs font-semibold rounded ${
                  profileData.socialLinks?.[soc]?.isVisible
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {profileData.socialLinks?.[soc]?.isVisible ? "Show" : "Hide"}
              </button>
            </div>
          ),
        )}

        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl font-semibold text-xs text-white bg-gold-600 hover:bg-gold-700 transition shadow-gold flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save School Profile</span>
          </button>
        </div>
      </form>

      {/* SECURITY & ADMIN PASSWORD CHANGE SECTION */}
      <div className="bg-white rounded-2xl shadow-subtle border border-slate-200 p-6 space-y-6">
        <h3 className="text-base font-bold font-serif text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-navy-900" /> Admin Security &
          Password Management
        </h3>

        {pwdMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{pwdMsg}</span>
          </div>
        )}

        {pwdError && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{pwdError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={pwdForm.currentPassword}
              onChange={(e) =>
                setPwdForm((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                New Password (Min 8 chars) *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={pwdForm.newPassword}
                onChange={(e) =>
                  setPwdForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={pwdForm.confirmNewPassword}
                onChange={(e) =>
                  setPwdForm((prev) => ({
                    ...prev,
                    confirmNewPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwdSaving}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-navy-900 hover:bg-navy-800 transition flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{pwdSaving ? "Updating..." : "Update Password"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
