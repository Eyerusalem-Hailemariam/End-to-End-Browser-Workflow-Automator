import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    file: {
      filename: {
        type: String,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
  },
  { timestamps: true }
);

export default mongoose.models.Task ||
  mongoose.model("Task", TaskSchema);
