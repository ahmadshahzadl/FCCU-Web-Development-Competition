/**
 * Authentication Helper Utilities
 * 
 * Provides utility functions for authentication and authorization
 */

import type { UserRole } from '@/types';

/**
 * Check if a role has admin privileges
 * 
 * @param role - User role to check
 * @returns True if role has admin privileges
 */
export const isAdmin = (role: UserRole): boolean => {
  return role === 'admin';
};

/**
 * Check if a role has manager privileges
 * 
 * @param role - User role to check
 * @returns True if role has manager privileges
 */
export const isManager = (role: UserRole): boolean => {
  return role === 'manager';
};

/**
 * Check if a role has team privileges
 * 
 * @param role - User role to check
 * @returns True if role has team privileges
 */
export const isTeam = (role: UserRole): boolean => {
  return role === 'team';
};

/**
 * Check if a role has student privileges
 * 
 * @param role - User role to check
 * @returns True if role has student privileges
 */
export const isStudent = (role: UserRole): boolean => {
  return role === 'student';
};

/**
 * Check if a role can access admin dashboard
 * 
 * @param role - User role to check
 * @returns True if role can access admin dashboard
 */
export const canAccessDashboard = (role: UserRole): boolean => {
  return ['admin', 'manager', 'team'].includes(role);
};

/**
 * Check if a role can access analytics
 * 
 * @param role - User role to check
 * @returns True if role can access analytics
 */
export const canAccessAnalytics = (role: UserRole): boolean => {
  return ['admin', 'manager'].includes(role);
};

/**
 * Get default redirect path for a role after login
 * 
 * @param role - User role
 * @returns Default redirect path
 */
export const getDefaultRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
    case 'manager':
      return '/dashboard';
    case 'team':
      return '/dashboard';
    case 'student':
    default:
      return '/';
  }
};

/**
 * Get role display name
 * 
 * @param role - User role
 * @returns Display name for the role
 */
export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames: Record<UserRole, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    team: 'Team Member',
    student: 'Student',
  };
  return roleNames[role] || role;
};

/**
 * Get role badge color class
 * 
 * @param role - User role
 * @returns Tailwind CSS classes for role badge
 */
export const getRoleBadgeColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800',
    manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    team: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    student: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-800';
};


