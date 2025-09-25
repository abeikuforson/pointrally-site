import { AUTH } from './constants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < AUTH.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${AUTH.PASSWORD_MIN_LENGTH} characters`);
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: string[] = [];

  if (!confirmPassword) {
    errors.push('Please confirm your password');
  } else if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];

  if (!phone) {
    errors.push('Phone number is required');
  } else {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    const cleanedPhone = phone.replace(/[\s-()]/g, '');

    if (!phoneRegex.test(cleanedPhone)) {
      errors.push('Invalid phone number format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateName(name: string, fieldName = 'Name'): ValidationResult {
  const errors: string[] = [];

  if (!name) {
    errors.push(`${fieldName} is required`);
  } else {
    if (name.length < 2) {
      errors.push(`${fieldName} must be at least 2 characters`);
    }
    if (name.length > 50) {
      errors.push(`${fieldName} must be less than 50 characters`);
    }
    if (!/^[a-zA-Z\s'-]+$/.test(name)) {
      errors.push(`${fieldName} contains invalid characters`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateUsername(username: string): ValidationResult {
  const errors: string[] = [];

  if (!username) {
    errors.push('Username is required');
  } else {
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }
    if (username.length > 20) {
      errors.push('Username must be less than 20 characters');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateZipCode(zipCode: string): ValidationResult {
  const errors: string[] = [];

  if (!zipCode) {
    errors.push('ZIP code is required');
  } else {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(zipCode)) {
      errors.push('Invalid ZIP code format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateCreditCard(cardNumber: string): ValidationResult {
  const errors: string[] = [];

  if (!cardNumber) {
    errors.push('Card number is required');
  } else {
    const cleanedNumber = cardNumber.replace(/\s/g, '');

    if (!/^\d{13,19}$/.test(cleanedNumber)) {
      errors.push('Invalid card number format');
    } else if (!luhnCheck(cleanedNumber)) {
      errors.push('Invalid card number');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function validateCVV(cvv: string): ValidationResult {
  const errors: string[] = [];

  if (!cvv) {
    errors.push('CVV is required');
  } else {
    if (!/^\d{3,4}$/.test(cvv)) {
      errors.push('CVV must be 3 or 4 digits');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateExpiryDate(expiryDate: string): ValidationResult {
  const errors: string[] = [];

  if (!expiryDate) {
    errors.push('Expiry date is required');
  } else {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiryDate)) {
      errors.push('Invalid expiry date format (MM/YY)');
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.push('Card has expired');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateUrl(url: string): ValidationResult {
  const errors: string[] = [];

  if (!url) {
    errors.push('URL is required');
  } else {
    try {
      new URL(url);
    } catch {
      errors.push('Invalid URL format');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validatePoints(points: number, maxPoints?: number): ValidationResult {
  const errors: string[] = [];

  if (points === undefined || points === null) {
    errors.push('Points value is required');
  } else {
    if (points < 0) {
      errors.push('Points cannot be negative');
    }
    if (!Number.isInteger(points)) {
      errors.push('Points must be a whole number');
    }
    if (maxPoints !== undefined && points > maxPoints) {
      errors.push(`Points cannot exceed ${maxPoints}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export interface FormData {
  [key: string]: unknown;
}

export interface FormValidationRules {
  [key: string]: (value: unknown, formData?: FormData) => ValidationResult;
}

export function validateForm(
  formData: FormData,
  rules: FormValidationRules
): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  Object.entries(rules).forEach(([field, validator]) => {
    const result = validator(formData[field], formData);
    if (!result.isValid) {
      errors[field] = result.errors;
    }
  });

  return errors;
}

export function hasFormErrors(errors: Record<string, string[]>): boolean {
  return Object.keys(errors).length > 0;
}