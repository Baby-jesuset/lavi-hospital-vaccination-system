import type { ZodSchema } from "zod"
import type { UseFormReturn } from "react-hook-form"
import { createLogger } from "@/utils/logging"

const logger = createLogger("formUtils")

/**
 * Validates form data against a schema and handles submission
 * @param form The React Hook Form instance
 * @param schema The Zod schema to validate against
 * @param onSubmit The function to call with validated data
 * @param options Additional options
 * @returns A function to handle form submission
 */
export function createFormSubmitHandler<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  schema: ZodSchema<T>,
  onSubmit: (data: T) => Promise<any>,
  options?: {
    logContext?: string
    onSuccess?: (result: any) => void
    onError?: (error: any) => void
  },
) {
  const logContext = options?.logContext || "formSubmit"

  return async (formData: T) => {
    try {
      logger.debug(`${logContext}: Validating form data`, formData)

      // Validate the data with Zod
      const validatedData = schema.parse(formData)

      logger.info(`${logContext}: Form data validated, submitting`)

      // Call the submission handler
      const result = await onSubmit(validatedData)

      logger.info(`${logContext}: Form submitted successfully`, result)

      // Call the success handler if provided
      if (options?.onSuccess) {
        options.onSuccess(result)
      }

      return result
    } catch (error) {
      logger.error(`${logContext}: Form submission failed`, error)

      // Handle Zod validation errors
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            const fieldName = err.path[0] as keyof T
            form.setError(fieldName, {
              type: "validation",
              message: err.message,
            })
          }
        })
      }

      // Call the error handler if provided
      if (options?.onError) {
        options.onError(error)
      }

      throw error
    }
  }
}

/**
 * Formats validation errors from the server for display in forms
 * @param errors The error object from the server
 * @param form The React Hook Form instance
 */
export function formatServerErrors<T extends Record<string, any>>(
  errors: Record<string, string>,
  form: UseFormReturn<T>,
) {
  Object.entries(errors).forEach(([field, message]) => {
    form.setError(field as any, {
      type: "server",
      message,
    })
  })
}
