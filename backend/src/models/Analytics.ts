import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  ip: string;
  location: {
    country?: string;
    city?: string;
  };
  device: string;
  path: string;
  visitedAt: Date;
}

const AnalyticsSchema: Schema = new Schema({
  ip: { type: String, required: true },
  location: {
    country: { type: String },
    city: { type: String },
  },
  device: { type: String, required: true },
  path: { type: String, required: true },
  visitedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
