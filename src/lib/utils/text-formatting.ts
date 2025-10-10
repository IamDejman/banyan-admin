/**
 * Utility functions for text formatting
 */

import { format } from 'date-fns';

/**
 * Converts text to sentence case
 * - First letter capitalized
 * - Rest of the letters lowercase
 * - Handles underscores and hyphens by replacing with spaces
 */
export function toSentenceCase(text: string | null | undefined): string {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
    .trim();
}

/**
 * Formats status text to sentence case
 * Handles common status values and special cases
 */
export function formatStatus(status: string | null | undefined): string {
  if (!status) return '';
  
  const statusMap: Record<string, string> = {
    'active': 'Active',
    'inactive': 'Inactive',
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'draft': 'Draft',
    'submitted': 'Submitted',
    'presented': 'Presented',
    'accepted': 'Accepted',
    'expired': 'Expired',
    'paid': 'Paid',
    'processing': 'Processing',
    'suspended': 'Suspended',
    'overdue': 'Overdue',
    'excellent': 'Excellent',
    'good': 'Good',
    'alert': 'Alert',
    'warning': 'Warning',
    'error': 'Error',
    'success': 'Success',
    'info': 'Info',
  };
  
  const lowerStatus = status.toLowerCase();
  return statusMap[lowerStatus] || toSentenceCase(status);
}

/**
 * Formats claim types to sentence case
 */
export function formatClaimType(claimType: string | null | undefined): string {
  if (!claimType) return '';
  
  const typeMap: Record<string, string> = {
    'motor': 'Motor',
    'property': 'Property',
    'health': 'Health',
    'life': 'Life',
    'fire': 'Fire',
    'business': 'Business',
    'travel': 'Travel',
    'auto': 'Auto',
  };
  
  const lowerType = claimType.toLowerCase();
  return typeMap[lowerType] || toSentenceCase(claimType);
}

/**
 * Formats department names to sentence case
 */
export function formatDepartment(department: string | null | undefined): string {
  if (!department) return '';
  
  const deptMap: Record<string, string> = {
    'claims processing': 'Claims Processing',
    'customer service': 'Customer Service',
    'sales': 'Sales',
    'administration': 'Administration',
    'it': 'IT',
    'hr': 'HR',
    'finance': 'Finance',
    'legal': 'Legal',
  };
  
  const lowerDept = department.toLowerCase();
  return deptMap[lowerDept] || toSentenceCase(department);
}

/**
 * Formats role names to sentence case
 */
export function formatRole(role: string | null | undefined): string {
  if (!role) return '';
  
  const roleMap: Record<string, string> = {
    'admin': 'Admin',
    'agent': 'Agent',
    'customer': 'Customer',
    'super_admin': 'Super Admin',
    'superadmin': 'Super Admin',
  };
  
  const lowerRole = role.toLowerCase();
  return roleMap[lowerRole] || toSentenceCase(role);
}

/**
 * Formats a date to DD Mmm YYYY format (e.g., "15 Jan 2024")
 * @param date - Date object, date string, or timestamp
 * @returns Formatted date string
 */
export function formatDate(date: Date | string | number | null | undefined): string {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return format(dateObj, 'dd MMM yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Formats a date to DD Mmm YYYY HH:MM AM/PM format (e.g., "15 Jan 2024 02:30 PM")
 * @param date - Date object, date string, or timestamp
 * @returns Formatted datetime string
 */
export function formatDateTime(date: Date | string | number | null | undefined): string {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return format(dateObj, 'dd MMM yyyy hh:mm a');
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'Invalid Date';
  }
}

/**
 * Formats a date for display in tables with consistent styling
 * @param date - Date object, date string, or timestamp
 * @returns Formatted date string
 */
export function formatDateForTable(date: Date | string | number | null | undefined): string {
  return formatDate(date);
}

/**
 * Formats a datetime for display in tables with consistent styling
 * @param date - Date object, date string, or timestamp
 * @returns Formatted datetime string
 */
export function formatDateTimeForTable(date: Date | string | number | null | undefined): string {
  return formatDateTime(date);
}

/**
 * Formats a datetime for claim history display (DD Mmm YYYY HH:MM AM/PM)
 * @param date - Date object, date string, or timestamp
 * @returns Formatted datetime string in DD Mmm YYYY HH:MM AM/PM format
 */
export function formatTimestampForHistory(date: Date | string | number | null | undefined): string {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    // Format as DD Mmm YYYY HH:MM AM/PM (e.g., "15 Jan 2024 02:30 PM")
    return format(dateObj, 'dd MMM yyyy hh:mm a');
  } catch (error) {
    console.error('Error formatting timestamp for history:', error);
    return 'Invalid Date';
  }
}
