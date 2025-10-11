import { z } from 'zod';

/**
 * Extract validation errors from Zod validation result
 * Converts Zod error format to a simple Record<string, string> for easy display
 * @param error - Zod validation error
 * @returns Object mapping field names to error messages
 */
export function extractValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  // Zod errors are in the 'issues' array, not 'errors'
  if (error.issues) {
    error.issues.forEach((issue) => {
      if (issue.path && issue.path[0]) {
        const fieldName = issue.path[0] as string;
        errors[fieldName] = issue.message;
      }
    });
  }

  return errors;
}
