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
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
