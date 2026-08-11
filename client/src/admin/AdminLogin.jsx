import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSchool } from "../context/SchoolContext";
import api from "../services/api";
import {
  Lock,
  Mail,
  ShieldAlert,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const AdminLogin = () => {
  const { admin, login, isAuthenticated, refreshAdmin } = useAuth();
  const { profile } = useSchool();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expiredMsg, setExpiredMsg] = useState("");

  // Force Password Change Modal State
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");

  useEffect(() => {
    if (admin?.mustChangePassword) {
      setMustChangePassword(true);
    }
  }, [admin]);

  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      setExpiredMsg(
        "Your session has expired. Please log in again to continue.",
      );
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && !mustChangePassword) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, mustChangePassword, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setExpiredMsg("");

    try {
      const res = await login(email, password);
      if (res.data?.mustChangePassword) {
        setMustChangePassword(true);
        setPwdForm((prev) => ({ ...prev, currentPassword: password }));
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setPwdLoading(true);
    setPwdError("");

    try {
      const res = await api.put("/admin/change-password", pwdForm);
      if (res.data && res.data.success) {
        await refreshAdmin();
        setMustChangePassword(false);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setPwdError(err.response?.data?.message || "Failed to change password");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-navy-800/40 rounded-full blur-3xl pointer-events-none" />

      {/* Force Password Change Modal */}
      {mustChangePassword ? (
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6 relative z-10 border border-slate-200">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <KeyRound className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold font-serif text-slate-900">
              Change Temporary Password
            </h2>
            <p className="text-xs text-slate-600">
              For security compliance, please set a new personal password before
              accessing the CMS dashboard.
            </p>
          </div>

          {pwdError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pwdError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password (Min 8 chars) *
              </label>
              <div className="relative">
                <input
                  type={showNewPwd ? "text" : "password"}
                  required
                  minLength={8}
                  value={pwdForm.newPassword}
                  onChange={(e) =>
                    setPwdForm((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-navy-900"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showNewPwd ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPwd ? "text" : "password"}
                  required
                  minLength={8}
                  value={pwdForm.confirmNewPassword}
                  onChange={(e) =>
                    setPwdForm((prev) => ({
                      ...prev,
                      confirmNewPassword: e.target.value,
                    }))
                  }
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-navy-900"
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPwd ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pwdLoading}
              className="w-full py-3.5 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>
                {pwdLoading
                  ? "Updating Password..."
                  : "Save New Password & Continue"}
              </span>
            </button>
          </form>
        </div>
      ) : (
        /* Standard Admin Sign-In Card */
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6 relative z-10 border border-slate-100">
          <div className="text-center space-y-2">
            {profile.logo && (
              <img
                src={profile.logo}
                alt="Logo"
                className="w-14 h-14 object-contain mx-auto bg-white p-1 rounded-xl shadow-sm border border-slate-200"
              />
            )}
            <h1 className="text-2xl font-bold font-serif text-slate-900">
              {profile.schoolName}
            </h1>
            <p className="text-xs text-slate-500">
              Secure Content Management System Login
            </p>
          </div>

          {expiredMsg && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{expiredMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-navy-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-navy-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gold-600 hover:bg-gold-700 text-white font-semibold text-xs rounded-xl shadow-gold transition flex items-center justify-center gap-2"
            >
              <span>
                {loading ? "Authenticating..." : "Sign In to Dashboard"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
