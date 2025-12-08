import { Request, Response, NextFunction } from "express";
import { UserService } from "./User.service";
import { asyncHandler, ValidationError } from "../../middleware/errorHandler";
import type { CreateUserInput, UpdateUserInput } from "../auth/types";
import {
  validateAndSanitizeEmail,
  validatePassword,
} from "../auth/Auth.validation";
import mongoose from "mongoose";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getCurrentUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      if (!req.user) {
        throw new ValidationError("User not authenticated");
      }

      const user = await this.userService.getCurrentUser(req.user.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    }
  );

  updateCurrentUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      if (!req.user) {
        throw new ValidationError("User not authenticated");
      }
      const { password, name }: UpdateUserInput = req.body;
      const currentUserRole = req.user.role;

      if (req.body.email || req.body.username) {
        if (currentUserRole !== "admin") {
          throw new ValidationError("Email and username cannot be changed");
        }
      }

      if (req.body.role) {
        throw new ValidationError(
          "Role cannot be changed via profile endpoint"
        );
      }

      const updateData: UpdateUserInput = {};

      if (password) {
        updateData.password = validatePassword(password);
      }

      if (name !== undefined) {
        updateData.name = name?.trim();
      }

      if (req.body.email && currentUserRole === "admin") {
        updateData.email = validateAndSanitizeEmail(req.body.email);
      }

      if (req.body.username && currentUserRole === "admin") {
        const sanitizedUsername = req.body.username.trim().toLowerCase();
        if (sanitizedUsername.length < 3) {
          throw new ValidationError(
            "Username must be at least 3 characters long"
          );
        }
        updateData.username = sanitizedUsername;
      }

      const updatedUser = await this.userService.updateCurrentUser(
        req.user.id,
        updateData,
        currentUserRole
      );

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: "Profile updated successfully",
      });
    }
  );

  getAllUsers = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { role, page = 1, limit = 10 } = req.query;

      if (!req.user) {
        throw new ValidationError("User not authenticated");
      }

      const query: any = {};
      if (role) query.role = role;

      const result = await this.userService.getAllUsers(
        query,
        Number(page),
        Number(limit),
        req.user.role
      );

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    }
  );

  getUserById = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;

      if (!req.user) {
        throw new ValidationError("User not authenticated");
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError(`Invalid user ID: ${id}`);
      }

      const user = await this.userService.getUserById(id, req.user.role);

      res.status(200).json({
        success: true,
        data: user,
      });
    }
  );

  createUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { email, username, password, name, role }: CreateUserInput =
        req.body;

      if (!req.user) {
        throw new ValidationError("User not authenticated");
      }

      if (!email || !username || !password || !role) {
        throw new ValidationError(
          "Email, username, password, and role are required"
        );
      }

      const sanitizedEmail = validateAndSanitizeEmail(email);
      const validatedPassword = validatePassword(password);

      const sanitizedUsername = username.trim().toLowerCase();
      if (!sanitizedUsername || sanitizedUsername.length < 3) {
        throw new ValidationError(
          "Username must be at least 3 characters long"
        );
      }

      const validRoles = ["admin", "manager", "team", "student"];
      if (!validRoles.includes(role)) {
        throw new ValidationError(
          `Role must be one of: ${validRoles.join(", ")}`
        );
      }

      const newUser = await this.userService.createUser(
        {
          email: sanitizedEmail,
          username: sanitizedUsername,
          password: validatedPassword,
          name: name?.trim(),
          role,
        },
        req.user.role,
        req.user.username
      );

      res.status(201).json({
        success: true,
        data: newUser,
        message: "User created successfully",
      });
    }
  );

  updateUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const { email, username, password, name, role }: UpdateUserInput =
        req.body;

      if (!req.user) {
        throw new ValidationError("User not authenticated");
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError(`Invalid user ID: ${id}`);
      }

      const updateData: UpdateUserInput = {};

      if (email) {
        updateData.email = validateAndSanitizeEmail(email);
      }

      if (username) {
        const sanitizedUsername = username.trim().toLowerCase();
        if (sanitizedUsername.length < 3) {
          throw new ValidationError(
            "Username must be at least 3 characters long"
          );
        }
        updateData.username = sanitizedUsername;
      }

      if (password) {
        updateData.password = validatePassword(password);
      }

      if (name !== undefined) {
        updateData.name = name?.trim();
      }

      if (role) {
        const validRoles = ["admin", "manager", "team", "student"];
        if (!validRoles.includes(role)) {
          throw new ValidationError(
            `Role must be one of: ${validRoles.join(", ")}`
          );
        }
        updateData.role = role;
      }

      const updatedUser = await this.userService.updateUser(
        id,
        updateData,
        req.user.role
      );

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      });
    }
  );

  deleteUser = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;

      if (!req.user) {
        throw new ValidationError("User not authenticated");
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError(`Invalid user ID: ${id}`);
      }

      await this.userService.deleteUser(id, req.user.role, req.user.username);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  );
}
