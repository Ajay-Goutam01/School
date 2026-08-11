const Admission = require('../models/Admission');

const getAdmissionDetails = async (req, res, next) => {
  try {
    let details = await Admission.findOne();
    if (!details) {
      details = await Admission.create({});
    }
    res.json({ success: true, data: details });
  } catch (err) {
    next(err);
  }
};

const updateAdmissionDetails = async (req, res, next) => {
  try {
    let details = await Admission.findOne();
    if (!details) {
      details = new Admission(req.body);
    } else {
      Object.assign(details, req.body);
    }
    await details.save();
    res.json({ success: true, data: details, message: 'Admission guidelines updated' });
  } catch (err) {
    next(err);
  }
};

const toggleAdmissionStatus = async (req, res, next) => {
  try {
    let details = await Admission.findOne();
    if (!details) {
      details = new Admission({ isAdmissionsOpen: req.body.isAdmissionsOpen });
    } else {
      details.isAdmissionsOpen = typeof req.body.isAdmissionsOpen === 'boolean'
        ? req.body.isAdmissionsOpen
        : !details.isAdmissionsOpen;
    }
    await details.save();
    res.json({ 
      success: true, 
      data: { isAdmissionsOpen: details.isAdmissionsOpen },
      message: `Admissions status changed to ${details.isAdmissionsOpen ? 'OPEN' : 'CLOSED'}`
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAdmissionDetails, updateAdmissionDetails, toggleAdmissionStatus };
