const Enquiry = require("../models/Enquiry");

// @desc    Submit public enquiry form
// @route   POST /api/enquiries
const submitEnquiry = async (req, res, next) => {
  try {
    const { name, phone, email, studentName, classInterested, message } =
      req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number, and message are required fields.",
      });
    }

    // Phone validation (digits check)
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    if (
      normalizedEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please enter a valid email address.",
        });
    }

    const enquiry = await Enquiry.create({
      name: name.trim(),
      phone: phone.trim(),
      email: normalizedEmail,
      studentName: studentName?.trim(),
      classInterested: classInterested?.trim(),
      message: message.trim(),
      status: "New",
    });

    res.status(201).json({
      success: true,
      data: enquiry,
      message:
        "Thank you! Your enquiry has been submitted successfully. The school will contact you soon.",
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all enquiries for admin
// @route   GET /api/enquiries
const getEnquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: enquiries });
  } catch (err) {
    next(err);
  }
};

// @desc    Update enquiry status / notes
// @route   PATCH /api/enquiries/:id
const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Enquiry record not found" });
    }

    if (status) enquiry.status = status;
    if (adminNotes !== undefined) enquiry.adminNotes = adminNotes;

    await enquiry.save();
    res.json({
      success: true,
      data: enquiry,
      message: "Enquiry updated successfully",
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry)
      return res
        .status(404)
        .json({ success: false, message: "Enquiry not found" });
    res.json({ success: true, message: "Enquiry deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};
