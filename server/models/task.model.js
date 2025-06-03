const mongoose = require("mongoose");

const { Schema } = mongoose;

// Define enums for priority and status for data consistency
const PRIORITY = ["low", "medium", "high", "urgent"];
const STATUS = ["pending", "in-progress", "completed", "archived"];

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: STATUS,
      default: "pending",
    },
    priority: {
      type: String,
      enum: PRIORITY,
      default: "medium",
    },
    category: {
      type: String,
      trim: true,
      default: "general",
      maxlength: 50,
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (v) {
          // Due date must be in future if provided
          return !v || v > new Date();
        },
        message: (props) => `Due date (${props.value}) must be a future date`,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // optional reference for multi-user apps
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deleted: {
      type: Boolean,
      default: false, // soft delete flag
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field example: isOverdue
TaskSchema.virtual("isOverdue").get(function () {
  return this.dueDate && this.dueDate < new Date() && !this.completed;
});

// Index for fast querying by user and status
TaskSchema.index({ createdBy: 1, status: 1, priority: -1 });

// Pre-save middleware to trim title and description automatically
TaskSchema.pre("save", function (next) {
  if (this.title) this.title = this.title.trim();
  if (this.description) this.description = this.description.trim();
  next();
});

module.exports = mongoose.model("Task", TaskSchema);
