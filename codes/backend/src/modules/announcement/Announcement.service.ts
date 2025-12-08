import { Announcement, IAnnouncement } from './Announcement.model';
import { NotFoundError } from '../../middleware/errorHandler';

export class AnnouncementService {
  // Get all announcements
  async getAllAnnouncements(): Promise<IAnnouncement[]> {
    return await Announcement.find().sort({ createdAt: -1 });
  }

  // Get announcement by ID
  async getAnnouncementById(id: string): Promise<IAnnouncement> {
    const announcement = await Announcement.findById(id);
    
    if (!announcement) {
      throw new NotFoundError('Announcement not found');
    }
    
    return announcement;
  }
}

// Service class is exported, instantiate where needed

