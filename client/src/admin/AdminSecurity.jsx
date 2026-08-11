import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  Loader2,
} from "lucide-react";

const AdminSecurity = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Helper for password strength score (0: Empty, 1: Weak, 2: Moderate, 3: Strong)
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "bg-slate-200" };
    if (pwd.length < 8)
      return {
        score: 1,
        label: "Weak (Min 8 chars required)",
        color: "bg-rose-500 text-rose-700",
      };

    const hasNumbers = /\d/.test(pwd);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pwd);
    const hasUppercase = /[A-Z]/.test(pwd);

    if (pwd.length >= 8 && hasNumbers && (hasSpecial || hasUppercase)) {
      return {
        score: 3,
        label: "Strong Password",
        color: "bg-emerald-500 text-emerald-700",
      };
    }

    return {
      score: 2,
      label: "Moderate Password",
      color: "bg-amber-500 text-amber-700",
    };
  };

  const strength = getPasswordStrength(form.newPassword);
  const isMatch =
    form.newPassword && form.confirmNewPassword
      ? form.newPassword === form.confirmNewPassword
      : true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (form.newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setErrorMsg("New password and confirmation password do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.put("/admin/change-password", form);

      if (res.data && res.data.success) {
        setSuccessMsg(
          res.data.message ||
            "Password updated successfully! Please use your new password for future logins.",
        );
        setForm({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          "Failed to change password. Please check your current password and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">
          Security Settings
        </h1>
        <p className="text-xs text-slate-500">
          Change your administrator password securely.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 border border-emerald-200 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold flex items-center gap-2.5 border border-rose-200 shadow-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-subtle border border-slate-200 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-900 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-serif text-navy-900">
              Password
            </h3>
            <p className="text-xs text-slate-500">
              Change your administrator password
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* CURRENT PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                required
                className="w-full pl-3.5 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-navy-900"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full pl-3.5 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-navy-900"
                placeholder="Enter new password (min 8 characters)"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* STRENGTH METER */}
            {form.newPassword && (
              <div className="mt-2 space-y-1.5">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength.score === 1
                        ? "w-1/3 bg-rose-500"
                        : strength.score === 2
                          ? "w-2/3 bg-amber-500"
                          : "w-full bg-emerald-500"
                    }`}
                  />
                </div>
                <p className={`text-[11px] font-semibold ${strength.color}`}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          {/* CONFIRM NEW PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmNewPassword"
                value={form.confirmNewPassword}
                onChange={handleChange}
                required
                minLength={6}
                className={`w-full pl-3.5 pr-10 py-2.5 text-xs border rounded-xl outline-none focus:ring-2 focus:ring-navy-900 ${
                  !isMatch
                    ? "border-rose-400 bg-rose-50/20"
                    : "border-slate-300"
                }`}
                placeholder="Re-enter new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {!isMatch && (
              <p className="text-[11px] font-semibold text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !isMatch}
              className="w-full sm:w-auto px-8 py-3 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-gold-400" />
              )}
              <span>
                {loading ? "Changing Password..." : "Change Password"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSecurity;
