import { Category, ICategory } from './Category.model';
import { NotFoundError, ConflictError, ValidationError } from '../../middleware/errorHandler';
import { Request } from '../request/Request.model';

export class CategoryService {
  // Get all categories
  async getAllCategories(includeInactive: boolean = false): Promise<ICategory[]> {
    const query: any = {};
    if (!includeInactive) {
      query.isActive = true;
    }

    return await Category.find(query).sort({ name: 1 });
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<ICategory> {
    const category = await Category.findById(id);

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<ICategory> {
    const category = await Category.findOne({ slug });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  // Create new category
  async createCategory(data: {
    name: string;
    description?: string;
    isActive?: boolean;
  }): Promise<ICategory> {
    // Check if category with same name already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${data.name}$`, 'i') }, // Case-insensitive
    });

    if (existingCategory) {
      throw new ConflictError('Category with this name already exists');
    }

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Check if slug already exists
    const existingSlug = await Category.findOne({ slug });
    if (existingSlug) {
      throw new ConflictError('Category with similar name already exists');
    }

    return await Category.create({
      ...data,
      slug,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });
  }

  // Update category
  async updateCategory(
    id: string,
    updateData: {
      name?: string;
      description?: string;
      isActive?: boolean;
    }
  ): Promise<ICategory> {
    const category = await Category.findById(id);

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // If name is being updated, check for conflicts
    if (updateData.name && updateData.name !== category.name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${updateData.name}$`, 'i') },
        _id: { $ne: id },
      });

      if (existingCategory) {
        throw new ConflictError('Category with this name already exists');
      }

      // Generate new slug
      const newSlug = updateData.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      // Check if new slug exists
      const existingSlug = await Category.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });

      if (existingSlug) {
        throw new ConflictError('Category with similar name already exists');
      }

      updateData = { ...updateData, slug: newSlug } as any;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      throw new NotFoundError('Category not found');
    }

    return updatedCategory;
  }

  // Delete category
  async deleteCategory(id: string): Promise<void> {
    const category = await Category.findById(id);

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // Check if category is being used in any requests
    const requestCount = await Request.countDocuments({
      category: category.slug,
      deletedAt: { $exists: false },
    });

    if (requestCount > 0) {
      throw new ValidationError(
        `Cannot delete category. It is being used in ${requestCount} active request(s). Please deactivate it instead.`
      );
    }

    await Category.findByIdAndDelete(id);
  }

  // Deactivate category (soft delete alternative)
  async deactivateCategory(id: string): Promise<ICategory> {
    return this.updateCategory(id, { isActive: false });
  }

  // Activate category
  async activateCategory(id: string): Promise<ICategory> {
    return this.updateCategory(id, { isActive: true });
  }
}

