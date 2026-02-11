const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  blood_type: { type: String, required: true },
  date_of_birth: { type: String, required: true },
  gender: { type: String, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  address: { type: String, required: true },
  is_alcoholic: { type: Boolean, default: false },
  is_smoker: { type: Boolean, default: false },
  medical_conditions: String,
  last_donation_date: String,
  willing_to_donate: { type: Boolean, default: true },
  emergency_contact: { type: String, required: true },
  relation: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  blood_bank_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBank' },
  donation_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: Date
});

const bloodBankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  license_number: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

const bloodRequestSchema = new mongoose.Schema({
  requester_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requester_name: { type: String, required: true },
  donor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donor_name: { type: String, required: true },
  blood_type: { type: String, required: true },
  urgency: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: Date
});

const bloodCampSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organizer: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  contact: { type: String, required: true },
  description: String,
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
});

const campRegistrationSchema = new mongoose.Schema({
  camp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodCamp', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'confirmed' },
  registered_at: { type: Date, default: Date.now }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  BloodBank: mongoose.model('BloodBank', bloodBankSchema),
  BloodRequest: mongoose.model('BloodRequest', bloodRequestSchema),
  BloodCamp: mongoose.model('BloodCamp', bloodCampSchema),
  CampRegistration: mongoose.model('CampRegistration', campRegistrationSchema)
};
