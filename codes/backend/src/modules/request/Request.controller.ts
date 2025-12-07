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
      const { category, description, studentName, studentId } = req.body;
      const attachmentUrl = req.file?.path;

      if (!category || !description) {
        throw new ValidationError('Category and description are required');
      }

      const newRequest = await this.requestService.createRequest({
        category,
        description,
        studentName,
        studentId,
        attachmentUrl,
      });

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
      await this.requestService.deleteRequest(id);

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
}

