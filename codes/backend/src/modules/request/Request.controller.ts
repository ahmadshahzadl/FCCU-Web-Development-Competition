import { Request, Response, NextFunction } from 'express';
import { RequestService } from './Request.service';
import { asyncHandler, ValidationError } from '../../middleware/errorHandler';

export class RequestController {
  private requestService: RequestService;

  constructor() {
    this.requestService = new RequestService();
  }

  getRequests = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { status, category, studentId, page = 1, limit = 10 } = req.query;

      const query: any = {};
      if (status) query.status = status;
      if (category) query.category = category;
      if (studentId) query.studentId = studentId;

      const result = await this.requestService.getAllRequests(
        query,
        Number(page),
        Number(limit)
      );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    }
  );

  getRequestById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const request = await this.requestService.getRequestById(id);

      res.status(200).json({
        success: true,
        data: request,
      });
    }
  );

  createRequest = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { category, description } = req.body;
      // Attachment is optional - will be undefined if no file is uploaded
      const attachmentUrl = req.file?.path;

      if (!category || !description) {
        throw new ValidationError('Category and description are required');
      }

      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      // Use authenticated user's information
      const studentId = req.user.id;
      const studentName = req.user.name || req.user.username;
      const createdByUsername = req.user.username;

      const newRequest = await this.requestService.createRequest(
        {
          category,
          description,
          studentName,
          studentId,
          attachmentUrl, // Optional - can be undefined
        },
        createdByUsername
      );

      res.status(201).json({
        success: true,
        data: newRequest,
      });
    }
  );

  updateRequest = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const updateData = req.body;

      const request = await this.requestService.updateRequest(id, updateData);

      res.status(200).json({
        success: true,
        data: request,
      });
    }
  );

  updateRequestStatus = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      if (!status) {
        throw new ValidationError('Status is required');
      }

      const request = await this.requestService.updateRequestStatus(
        id,
        status,
        adminNotes
      );

      res.status(200).json({
        success: true,
        data: request,
      });
    }
  );

  deleteRequest = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;

      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      await this.requestService.deleteRequest(id, req.user.username);

      res.status(200).json({
        success: true,
        message: 'Request deleted successfully',
      });
    }
  );

  getUserRequests = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { userId } = req.params;
      const requests = await this.requestService.getUserRequests(userId);

      res.status(200).json({
        success: true,
        data: requests,
      });
    }
  );

  getRequestCount = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { status, category, studentId } = req.query;

      const query: any = {};
      if (status) query.status = status;
      if (category) query.category = category;
      if (studentId) query.studentId = studentId;

      const count = await this.requestService.getRequestCount(query);

      res.status(200).json({
        success: true,
        data: {
          total: count,
        },
      });
    }
  );
}

