const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true }, // e.g., "acme", "globex"
    name: { type: String, required: true },               // e.g., "Acme Company"
    plan: { type: String, enum: ['free', 'pro'], default: 'free' }, // subscription plan
    noteLimit: { type: Number, default: 3 },             // max notes for free plan
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tenant', tenantSchema);
