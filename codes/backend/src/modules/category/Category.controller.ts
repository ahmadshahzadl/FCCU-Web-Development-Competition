import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './Category.service';
import { asyncHandler, ValidationError } from '../../middleware/errorHandler';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAllCategories = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const includeInactive = req.query.includeInactive === 'true';
      const categories = await this.categoryService.getAllCategories(includeInactive);

      res.status(200).json({
        success: true,
        data: categories,
      });
    }
  );

  getCategoryById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const category = await this.categoryService.getCategoryById(id);

      res.status(200).json({
        success: true,
        data: category,
      });
    }
  );

  createCategory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { name, description, isActive } = req.body;

      if (!name || !name.trim()) {
        throw new ValidationError('Category name is required');
      }

      const newCategory = await this.categoryService.createCategory({
        name: name.trim(),
        description: description?.trim(),
        isActive: isActive !== undefined ? isActive : true,
      });

      res.status(201).json({
        success: true,
        data: newCategory,
        message: 'Category created successfully',
      });
    }
  );

  updateCategory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const { name, description, isActive } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (description !== undefined) updateData.description = description?.trim();
      if (isActive !== undefined) updateData.isActive = isActive;

      const updatedCategory = await this.categoryService.updateCategory(id, updateData);

      res.status(200).json({
        success: true,
        data: updatedCategory,
        message: 'Category updated successfully',
      });
    }
  );

  deleteCategory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      await this.categoryService.deleteCategory(id);

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
      });
    }
  );

  deactivateCategory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const category = await this.categoryService.deactivateCategory(id);

      res.status(200).json({
        success: true,
        data: category,
        message: 'Category deactivated successfully',
      });
    }
  );

  activateCategory = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const category = await this.categoryService.activateCategory(id);

      res.status(200).json({
        success: true,
        data: category,
        message: 'Category activated successfully',
      });
    }
  );
}

