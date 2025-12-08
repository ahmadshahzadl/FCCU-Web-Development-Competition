import { Request, IRequest } from './Request.model';
import { NotFoundError, ValidationError } from '../../middleware/errorHandler';

export class RequestService {
  // Get all requests with filters and pagination
  async getAllRequests(query: any, page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    // Exclude soft-deleted requests
    const activeRequestFilter = {
      deletedAt: { $exists: false },
    };
    const finalQuery = { ...query, ...activeRequestFilter };
    
    const requests = await Request.find(finalQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Request.countDocuments(finalQuery);

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
    const request = await Request.findOne({
      _id: id,
      deletedAt: { $exists: false }, // Exclude soft-deleted requests
    });
    
    if (!request) {
      throw new NotFoundError('Request not found');
    }
    
    return request;
  }

  // Create new request
  async createRequest(
    data: Partial<IRequest>,
    createdByUsername: string
  ): Promise<IRequest> {
    return await Request.create({
      ...data,
      createdBy: createdByUsername.toLowerCase(), // Audit: Track who created this request
    });
  }

  // Update request
  async updateRequest(
    id: string,
    updateData: Partial<IRequest>
  ): Promise<IRequest> {
    // First, get the current request to check if it's resolved
    const currentRequest = await Request.findById(id);

    if (!currentRequest) {
      throw new NotFoundError('Request not found');
    }

    // Check if request is already resolved and trying to change status
    if (currentRequest.status === 'resolved' && updateData.status && updateData.status !== 'resolved') {
      throw new ValidationError(
        'Your request is resolved. User can make another request if the problem is still not resolved.'
      );
    }

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
    // First, get the current request to check if it's resolved
    const currentRequest = await Request.findById(id);

    if (!currentRequest) {
      throw new NotFoundError('Request not found');
    }

    // Prevent changing status if request is already resolved
    if (currentRequest.status === 'resolved') {
      throw new ValidationError(
        'Your request is resolved. User can make another request if the problem is still not resolved.'
      );
    }

    const updateData: any = { status };
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (status === 'resolved') updateData.resolvedAt = new Date();

    return this.updateRequest(id, updateData);
  }

  // Delete request (soft delete with audit log)
  async deleteRequest(id: string, deletedByUsername: string): Promise<void> {
    const request = await Request.findById(id);

    if (!request) {
      throw new NotFoundError('Request not found');
    }

    // Check if already deleted
    if (request.deletedAt) {
      throw new NotFoundError('Request is already deleted');
    }

    // Soft delete: Mark as deleted with audit info
    await Request.findByIdAndUpdate(
      id,
      {
        deletedBy: deletedByUsername.toLowerCase(), // Audit: Track who deleted this request
        deletedAt: new Date(),
      },
      { new: true }
    );
  }

  // Get user requests
  async getUserRequests(userId: string): Promise<IRequest[]> {
    return await Request.find({
      studentId: userId,
      deletedAt: { $exists: false }, // Exclude soft-deleted requests
    }).sort({
      createdAt: -1,
    });
  }

  // Get total request count with optional filters
  async getRequestCount(query: any = {}): Promise<number> {
    // Exclude soft-deleted requests
    const activeRequestFilter = {
      deletedAt: { $exists: false },
    };
    const finalQuery = { ...query, ...activeRequestFilter };
    return await Request.countDocuments(finalQuery);
  }
}

