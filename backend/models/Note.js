const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String },
    tenantId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true }, 
}, { timestamps: true }); 

module.exports = mongoose.model('Note', noteSchema);
