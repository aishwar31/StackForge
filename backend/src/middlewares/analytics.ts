import { Request, Response, NextFunction } from 'express';
import Analytics from '../models/Analytics';

export const trackAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const device = req.headers['user-agent'] || 'unknown';
    const path = req.originalUrl;

    // We can use a free GeoIP service or library here if needed, but for now we leave it empty
    // e.g., const geo = geoip.lookup(ip);
    
    // Non-blocking save
    Analytics.create({
      ip,
      device,
      path,
      location: { country: 'Unknown', city: 'Unknown' }, // Placeholder
    }).catch((err) => console.error('Analytics tracking error:', err));

    next();
  } catch (error) {
    next(); // Ensure we don't break the request pipeline
  }
};
