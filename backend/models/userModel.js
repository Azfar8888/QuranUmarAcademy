// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["SuperAdmin", "Admin", "Teacher", "Student"], default: "Student" },
//   twoFactorEnabled: { type: Boolean, default: false },
//   twoFactorSecret: { type: String },
//   assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Only for Teachers
//   notes: [
//     {
//       note: { type: String, required: true },
//       createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       createdAt: { type: Date, default: Date.now }
//     }
//   ]
// });

// // Hash password before saving
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Password Verification
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model("User", UserSchema);






// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["SuperAdmin", "Admin", "Teacher", "Student"], default: "Student" },
//   twoFactorEnabled: { type: Boolean, default: false },
//   twoFactorSecret: { type: String },
//   assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Only for Teachers
//   notes: [
//     {
//       note: { type: String, required: true },
//       createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       createdAt: { type: Date, default: Date.now }
//     }
//   ]
// });

// // Hash password before saving
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // Password Verification
// UserSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model("User", UserSchema);




const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: false },
  role: {
    type: String,
    enum: ["SuperAdmin", "Admin", "Teacher", "Student"],
    default: "Student"
  },
  twoFactorEnabled: { type: Boolean, default: false },
  assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  notes: [
    {
      note: { type: String, required: true },
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

// ✅ Automatically hash password before saving
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   console.log("🔐 Hashing password for:", this.email);
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });


// ✅ Password comparison method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
