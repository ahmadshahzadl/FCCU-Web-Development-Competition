import { Announcement, IAnnouncement } from './Announcement.model';
import { NotFoundError, ValidationError } from '../../middleware/errorHandler';
import type { UserRole } from '../auth/types';

export interface CreateAnnouncementInput {
  title: string;
  content: string;
  type?: 'notice' | 'event' | 'cancellation' | 'request-update';
  priority?: 'high' | 'medium' | 'low';
  target: 'all' | 'roles' | 'users';
  targetRoles?: UserRole[];
  targetUserIds?: string[];
  relatedRequestId?: string;
}

export class AnnouncementService {
  // Create announcement
  async createAnnouncement(
    data: CreateAnnouncementInput,
    createdBy: string,
    createdByRole: UserRole
  ): Promise<IAnnouncement> {
    // Validate target configuration
    if (data.target === 'roles' && (!data.targetRoles || data.targetRoles.length === 0)) {
      throw new ValidationError('Target roles must be specified when target is "roles"');
    }

    if (data.target === 'users' && (!data.targetUserIds || data.targetUserIds.length === 0)) {
      throw new ValidationError('Target user IDs must be specified when target is "users"');
    }

    const announcement = await Announcement.create({
      title: data.title.trim(),
      content: data.content.trim(),
      type: data.type || 'notice',
      priority: data.priority || 'medium',
      target: data.target,
      targetRoles: data.targetRoles || [],
      targetUserIds: data.targetUserIds || [],
      createdBy: createdBy.toLowerCase(),
      createdByRole,
      relatedRequestId: data.relatedRequestId,
      readBy: [],
    });

    return announcement;
  }

  // Get announcements for a specific user
  async getUserAnnouncements(userId: string, userRole: UserRole): Promise<IAnnouncement[]> {
    const announcements = await Announcement.find({
      $or: [
        { target: 'all' },
        { target: 'roles', targetRoles: userRole },
        { target: 'users', targetUserIds: userId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to recent 50 announcements

    return announcements;
  }

  // Get unread announcements for a user
  async getUnreadAnnouncements(userId: string, userRole: UserRole): Promise<IAnnouncement[]> {
    const announcements = await Announcement.find({
      $and: [
        {
          $or: [
            { target: 'all' },
            { target: 'roles', targetRoles: userRole },
            { target: 'users', targetUserIds: userId },
          ],
        },
        {
          $or: [
            { readBy: { $exists: false } },
            { readBy: { $ne: userId } },
          ],
        },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return announcements;
  }

  // Get all announcements (admin/manager only)
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

  // Mark announcement as read
  async markAsRead(announcementId: string, userId: string): Promise<IAnnouncement> {
    const announcement = await Announcement.findById(announcementId);
    
    if (!announcement) {
      throw new NotFoundError('Announcement not found');
    }

    // Add user to readBy array if not already present
    if (!announcement.readBy?.includes(userId)) {
      announcement.readBy = announcement.readBy || [];
      announcement.readBy.push(userId);
      await announcement.save();
    }

    return announcement;
  }

  // Mark all announcements as read for a user
  async markAllAsRead(userId: string, userRole: UserRole): Promise<void> {
    const announcements = await Announcement.find({
      $and: [
        {
          $or: [
            { target: 'all' },
            { target: 'roles', targetRoles: userRole },
            { target: 'users', targetUserIds: userId },
          ],
        },
        {
          $or: [
            { readBy: { $exists: false } },
            { readBy: { $ne: userId } },
          ],
        },
      ],
    });

    // Update all announcements to include userId in readBy
    await Announcement.updateMany(
      {
        _id: { $in: announcements.map((a) => a._id) },
      },
      {
        $addToSet: { readBy: userId },
      }
    );
  }

  // Delete announcement (admin/manager only)
  async deleteAnnouncement(id: string): Promise<void> {
    const announcement = await Announcement.findByIdAndDelete(id);
    
    if (!announcement) {
      throw new NotFoundError('Announcement not found');
    }
  }

  // Get announcement count for user
  async getUnreadCount(userId: string, userRole: UserRole): Promise<number> {
    const count = await Announcement.countDocuments({
      $and: [
        {
          $or: [
            { target: 'all' },
            { target: 'roles', targetRoles: userRole },
            { target: 'users', targetUserIds: userId },
          ],
        },
        {
          $or: [
            { readBy: { $exists: false } },
            { readBy: { $ne: userId } },
          ],
        },
      ],
    });

    return count;
  }
}

// Service class is exported, instantiate where needed

