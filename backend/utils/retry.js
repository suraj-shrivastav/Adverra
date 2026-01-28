/**
 * Retry utility for handling transient failures
 * @param {Function} operation - The async operation to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delayMs - Initial delay in milliseconds (exponential backoff)
 * @returns {Promise<T>} - Result of the operation
 */
export async function withRetry(operation, maxRetries = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await new Promise(resolve => 
        setTimeout(resolve, delayMs * attempt) // Exponential backoff
      );
    }
  }
}
