import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserSkill {
  name: string;
  category: "DSA" | "SystemDesign" | "CodeQuality" | "ProblemSolving" | "Communication";
  score: number; // 0 - 100
  assessedCount: number;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  role: "candidate" | "admin";
  avatar?: string;
  targetRole?: string;
  experienceLevel?: "junior" | "mid" | "senior" | "lead";
  skills: IUserSkill[];
  totalInterviews: number;
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSkillSchema = new Schema<IUserSkill>({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["DSA", "SystemDesign", "CodeQuality", "ProblemSolving", "Communication"],
    required: true,
  },
  score: { type: Number, default: 0, min: 0, max: 100 },
  assessedCount: { type: Number, default: 0 },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["candidate", "admin"], default: "candidate" },
    avatar: { type: String },
    targetRole: { type: String, default: "Full Stack Engineer" },
    experienceLevel: { type: String, enum: ["junior", "mid", "senior", "lead"], default: "mid" },
    skills: { type: [UserSkillSchema], default: [] },
    totalInterviews: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0, min: 0, max: 100 },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in development HMR
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
