import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true,},
    gender: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role_name: { type: String, required: false },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Match user-entered password to hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
