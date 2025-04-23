import { MockMethod } from 'vite-plugin-mock';

export enum ResponseCode {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  INVALID_INPUT = 400,
}

export type ServerResponse = Parameters<NonNullable<MockMethod['rawResponse']>>[1];
export type ServerRequest = Parameters<NonNullable<MockMethod['rawResponse']>>[0];

export interface GenerateTokenParams {
  email: string;
  password: string;
  expiresIn: number;
}

export interface ApiHeaders {
  authorization: string;
}

export enum UserStatus {
  LOCKED = 'locked',
  ACTIVE = 'active',
}

export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  status: UserStatus;
  dateOfBirth: string;
}
