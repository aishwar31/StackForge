import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  summary: string;
  coverImage?: string;
  tags: string[];
  seoMetadata: {
    title: string;
    description: string;
  };
  published: boolean;
  comments: {
    user: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    summary: { type: String },
    coverImage: { type: String },
    tags: [{ type: String }],
    seoMetadata: {
      title: { type: String },
      description: { type: String },
    },
    published: { type: Boolean, default: false },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
