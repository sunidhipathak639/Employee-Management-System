import { useToastStore } from './store/toastStore';

/**
 * @param {string} message
 */
export function notifyError(message) {
  useToastStore.getState().push(message || 'Something went wrong', 'error');
}

/**
 * @param {string} message
 */
export function notifySuccess(message) {
  useToastStore.getState().push(message, 'success');
}

/**
 * @param {string} message
 */
export function notifyWarning(message) {
  useToastStore.getState().push(message, 'warning');
}

/**
 * @param {string} message
 */
export function notifyInfo(message) {
  useToastStore.getState().push(message, 'info');
}

/**
 * Toast the first server field error (fields usually also show inline via react-hook-form).
 * @param {Record<string, string> | undefined} fieldErrors
 */
export function notifyFieldErrors(fieldErrors) {
  if (!fieldErrors || typeof fieldErrors !== 'object') return;
  const first = Object.values(fieldErrors)[0];
  if (first != null && String(first).trim() !== '') notifyError(String(first));
}

/**
 * Toast the first client validation error (e.g. empty required fields on login).
 * @param {Record<string, { message?: string } | undefined>} formErrors
 */
export function notifyFirstFormValidationError(formErrors) {
  const first = Object.values(formErrors || {})[0];
  const msg =
    first && typeof first === 'object' && first !== null && 'message' in first && first.message != null
      ? String(first.message)
      : '';
  notifyError(msg || 'Please complete the required fields.');
}
