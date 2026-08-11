import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Mail,
  Phone,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useSchool } from "../context/SchoolContext";

const AdminEnquiries = () => {
  const { profile } = useSchool();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get("/enquiries");
      if (res.data && res.data.success) {
        setEnquiries(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/enquiries/${id}`, { status });
      fetchEnquiries();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete enquiry record?")) return;
    try {
      await api.delete(`/enquiries/${id}`);
      fetchEnquiries();
    } catch (err) {
      alert("Failed to delete enquiry");
    }
  };

  // Filtered list
  const filtered = enquiries.filter((item) => {
    const matchesSearch =
      (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.phone || "").includes(search) ||
      (item.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.classInterested || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900">
          Parent Enquiry Inbox
        </h1>
        <p className="text-xs text-slate-500">
          Track and respond to admission enquiries submitted by prospective
          parents.
        </p>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-subtle border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search parent name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-navy-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none bg-white font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="New">New Enquiries</option>
            <option value="Contacted">Contacted</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* ENQUIRIES LIST */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">
          Loading enquiries...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
          No enquiries found matching your search.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const cleanPhone = (item.phone || "").replace(/[^0-9]/g, "");
            const waMsg = encodeURIComponent(
              profile.defaultWhatsappMessage ||
                "Hello, regarding your school admission enquiry...",
            );
            const waUrl = `https://wa.me/${cleanPhone.length === 10 ? "91" + cleanPhone : cleanPhone}?text=${waMsg}`;

            return (
              <div
                key={item._id}
                className="bg-white p-6 rounded-2xl shadow-subtle border border-slate-200 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.status === "New"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : item.status === "Contacted"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {item.status || "New"}
                    </span>
                    <h3 className="text-base font-bold font-serif text-navy-900">
                      {item.name}
                    </h3>
                    <span className="text-xs text-slate-400">
                      • Class: {item.classInterested || "N/A"}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 italic leading-relaxed">
                  "{item.message}"
                </p>

                {/* ACTION BUTTONS & QUICK CONTACT */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    {item.phone && (
                      <a
                        href={`tel:${item.phone}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-gold-600" />
                        <span>Call</span>
                      </a>
                    )}

                    {item.phone && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    {item.email && (
                      <a
                        href={`mailto:${item.email}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Mail className="w-3.5 h-3.5 text-navy-900" />
                        <span>Email</span>
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <select
                      value={item.status || "New"}
                      onChange={(e) =>
                        handleUpdateStatus(item._id, e.target.value)
                      }
                      className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg outline-none bg-white font-medium"
                    >
                      <option value="New">Mark New</option>
                      <option value="Contacted">Mark Contacted</option>
                      <option value="Resolved">Mark Resolved</option>
                    </select>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
