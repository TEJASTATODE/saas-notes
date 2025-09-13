const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema= new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // hashed
    role: { type: String, enum: ["admin", "member"], required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true } // link to tenant slug
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
}
);
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
