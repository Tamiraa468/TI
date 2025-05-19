import mongoose from "mongoose";

const employSchema = new mongoose.Schema(
  {
    last_name: { type: String, required: true },
    first_name: { type: String, required: true },
    gender: {
      type: String,
      enum: ["Эрэгтэй", "Эмэгтэй"],
      required: true,
    },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, },
    role_name: { type: String, required: true },
  },
  { timestamps: true }
);

const Employee = mongoose.model("employ-registration", employSchema);

export default Employee;
