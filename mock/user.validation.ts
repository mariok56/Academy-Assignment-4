import { User, UserStatus } from './mock.type';

const isStatus = (value: string): boolean => Object.values(UserStatus).includes(value.toLowerCase() as UserStatus);

const isValidUserInput = (user: Omit<User, 'id'>): boolean => {
  if (!user.firstName || typeof user.firstName !== 'string') return false;
  if (!user.email || typeof user.email !== 'string') return false;
  if (!user.status || typeof user.status !== 'string' || !isStatus(user.status)) return false;
  if (!user.dateOfBirth || typeof user.dateOfBirth !== 'string') return false;
  if (user.lastName && typeof user.lastName !== 'string') return false;

  // Additional validation for email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) return false;

  // Additional validation for date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(user.dateOfBirth)) return false;

  return true;
};

export { isValidUserInput };
