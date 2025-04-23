import jwt from 'jsonwebtoken';

import { ResponseCode, GenerateTokenParams, ServerResponse, ServerRequest } from './mock.type';

export const generateResponse = <T>(data: T, message = 'success', status: ResponseCode = ResponseCode.SUCCESS) => {
  return {
    status,
    result: {
      data,
      message,
    },
  };
};

export const getUnAuthorizedResponse = (res: ServerResponse) => {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = ResponseCode.UNAUTHORIZED;
  res.end(JSON.stringify(generateResponse({}, 'Unauthorized!', ResponseCode.UNAUTHORIZED)));
};
export const getServerError = (res: ServerResponse) => {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = ResponseCode.SERVER_ERROR;
  res.end(JSON.stringify(generateResponse({}, 'Something went wrong!', ResponseCode.SERVER_ERROR)));
};

export const getNotFoundUserResponse = (res: ServerResponse) => {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = ResponseCode.NOT_FOUND;
  res.end(JSON.stringify(generateResponse({}, 'User not found', ResponseCode.NOT_FOUND)));
};

export const getInvalidInputResponse = (res: ServerResponse) => {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = ResponseCode.INVALID_INPUT;
  res.end(JSON.stringify(generateResponse({}, 'Invalid input', ResponseCode.INVALID_INPUT)));
};

export const generateToken = ({ email, password, expiresIn }: GenerateTokenParams) => {
  return jwt.sign(
    {
      exp: expiresIn,
      data: { email, password },
    },
    'secret',
  );
};

export const validateToken = (token?: string) => {
  try {
    if (!token) {
      return false;
    }
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'secret');
    return !!decoded;
  } catch {
    return false;
  }
};

export const extractIdFromUrl = (req: ServerRequest): string | undefined => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const segments = url.pathname.split('/');
  return segments.pop() || segments.pop();
};
