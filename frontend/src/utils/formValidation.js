/**
 * Reusable form validation utility for the Art Gallery Platform.
 */

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // At least 6 characters
  return password.length >= 6;
};

export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
};

export const validatePrice = (price) => {
  const num = Number(price);
  return !isNaN(num) && num > 0;
};

export const validateImageFile = (file) => {
  if (!file) return false;
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
};
