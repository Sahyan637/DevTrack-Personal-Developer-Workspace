export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("One number");
  return errors;
}

export function validateRegistration({
  name,
  email,
  password,
  confirmPassword,
}) {
  const errors = {};
  if (!name.trim()) errors.name = "Please enter your name.";
  if (!isValidEmail(email)) errors.email = "Enter a valid email address.";
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length)
    errors.password = `Password needs: ${passwordErrors.join(", ")}.`;
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}
