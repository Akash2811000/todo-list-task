export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 6)
    errors.push("Password must be at least 6 characters long");
  if (!/(?=.*[a-z])/.test(password))
    errors.push("Must include a lowercase letter");
  if (!/(?=.*[A-Z])/.test(password))
    errors.push("Must include an uppercase letter");
  if (!/(?=.*\d)/.test(password)) errors.push("Must include a number");
  return errors;
};
