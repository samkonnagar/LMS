import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    toUser: { type: Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("Notification", notificationSchema);
