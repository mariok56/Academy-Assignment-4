export enum UserStatus {
    ACTIVE = 'active',
    LOCKED = 'locked',
  }
  
  export interface UserResponse {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    status: string;
    dateOfBirth: string;
  }
  
  export interface UserInput {
    firstName: string;
    lastName?: string;
    email: string;
    status: UserStatus;
    dateOfBirth: string;
  }
  
  export interface ApiResponse<T> {
    status: number;
    result: {
      data: T;
      message: string;
    };
  }