const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const roles = ["user", "admin", "manager"];

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name required"],
      trim: true,
      maxlength: [100, "Full name must be at most 100 characters"],
    },
    username: {
      type: String,
      required: [true, "Username required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be at most 30 characters"],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and dashes",
      ],
    },
    email: {
      type: String,
      required: [true, "Email required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Must be a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // exclude password from queries by default
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    profile: {
      fullName: {
        type: String,
        trim: true,
        maxlength: 100,
      },
      avatarUrl: {
        type: String,
        trim: true,
      },
      bio: {
        type: String,
        maxlength: 500,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hide password and __v in JSON output
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

// Indexes for username and email for faster lookup
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });

module.exports = mongoose.model("User", UserSchema);
