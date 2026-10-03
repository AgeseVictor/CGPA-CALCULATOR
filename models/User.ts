import mongoose, { Schema, model, models } from 'mongoose';

export interface IUserDocument {
  name: string;
  email: string;
  password: string;
  savedResults: Array<{
    id?: string;
    semesterName?: string;
    scale: '4.0' | '5.0';
    semesters: Array<{
      id: string;
      name: string;
      courses: Array<{
        id: string;
        code: string;
        units: number;
        grade: string;
      }>;
    }>;
    updatedAt: Date;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema(
  {
    id: { type: String, required: true },
    code: { type: String, default: '' },
    units: { type: Number, default: 0 },
    grade: { type: String, default: 'A' },
  },
  { _id: false }
);

const SemesterSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    courses: [CourseSchema],
  },
  { _id: false }
);

const SavedResultSchema = new Schema(
  {
    id: { type: String },
    semesterName: { type: String },
    scale: { type: String, enum: ['4.0', '5.0'], default: '5.0' },
    semesters: [SemesterSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    savedResults: [SavedResultSchema],
  },
  { timestamps: true }
);

const User = models.User || model('User', UserSchema);

export default User;
