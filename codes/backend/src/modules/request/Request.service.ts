import { Request, IRequest } from './Request.model';
import { NotFoundError } from '../../middleware/errorHandler';

export class RequestService {
  // Get all requests with filters and pagination
  async getAllRequests(query: any, page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const requests = await Request.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Request.countDocuments(query);

    return {
      data: requests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get request by ID
  async getRequestById(id: string): Promise<IRequest> {
    const request = await Request.findById(id);
    
    if (!request) {
      throw new NotFoundError('Request not found');
    }
    
    return request;
  }

  // Create new request
  async createRequest(data: Partial<IRequest>): Promise<IRequest> {
    return await Request.create(data);
  }

  // Update request
  async updateRequest(
    id: string,
    updateData: Partial<IRequest>
  ): Promise<IRequest> {
    const request = await Request.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!request) {
      throw new NotFoundError('Request not found');
    }

    return request;
  }

  // Update request status
  async updateRequestStatus(
    id: string,
    status: string,
    adminNotes?: string
  ): Promise<IRequest> {
    const updateData: any = { status };
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (status === 'resolved') updateData.resolvedAt = new Date();

    return this.updateRequest(id, updateData);
  }

  // Delete request
  async deleteRequest(id: string): Promise<void> {
    const request = await Request.findByIdAndDelete(id);

    if (!request) {
      throw new NotFoundError('Request not found');
    }
  }

  // Get user requests
  async getUserRequests(userId: string): Promise<IRequest[]> {
    return await Request.find({ studentId: userId }).sort({
      createdAt: -1,
    });
  }
}

