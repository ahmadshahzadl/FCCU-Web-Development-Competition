import { ValidationError } from '../../middleware/errorHandler';

/**
 * Email validation regex pattern
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password minimum length requirement
 */
export const PASSWORD_MIN_LENGTH = 6;

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns boolean - True if valid
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

/**
 * Validates password meets minimum requirements
 * @param password - Password string to validate
 * @returns boolean - True if valid
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= PASSWORD_MIN_LENGTH;
};

/**
 * Validates sign in input
 * @param email - User email
 * @param password - User password
 * @throws ValidationError if validation fails
 */
export const validateSignInInput = (email: string, password: string): void => {
  // Check if email and password are provided
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // Trim whitespace
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  // Validate email is not empty after trimming
  if (!trimmedEmail) {
    throw new ValidationError('Email is required');
  }

  // Validate password is not empty after trimming
  if (!trimmedPassword) {
    throw new ValidationError('Password is required');
  }

  // Validate email format
  if (!isValidEmail(trimmedEmail)) {
    throw new ValidationError('Please provide a valid email address');
  }

  // Validate password length
  if (!isValidPassword(trimmedPassword)) {
    throw new ValidationError(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`
    );
  }
};

/**
 * Sanitizes email (converts to lowercase and trims)
 * @param email - Email string to sanitize
 * @returns string - Sanitized email
 */
export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Validates and sanitizes email
 * @param email - Email string to validate and sanitize
 * @returns string - Sanitized email
 * @throws ValidationError if email is invalid
 */
export const validateAndSanitizeEmail = (email: string): string => {
  if (!email || !email.trim()) {
    throw new ValidationError('Email is required');
  }

  const sanitized = sanitizeEmail(email);

  if (!isValidEmail(sanitized)) {
    throw new ValidationError('Please provide a valid email address');
  }

  return sanitized;
};

/**
 * Validates password
 * @param password - Password string to validate
 * @returns string - Trimmed password
 * @throws ValidationError if password is invalid
 */
export const validatePassword = (password: string): string => {
  if (!password || !password.trim()) {
    throw new ValidationError('Password is required');
  }

  const trimmed = password.trim();

  if (!isValidPassword(trimmed)) {
    throw new ValidationError(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`
    );
  }

  return trimmed;
};

