import { MockMethod } from 'vite-plugin-mock';

import { ApiHeaders, User } from './mock.type';
import {
  extractIdFromUrl,
  generateResponse,
  getInvalidInputResponse,
  getNotFoundUserResponse,
  getServerError,
  getUnAuthorizedResponse,
  validateToken,
} from './mock.util';
import { isValidUserInput } from './user.validation';
import usersJson from './users.json';

type UserInput = Omit<User, 'id'>;

const usersData = JSON.parse(JSON.stringify(usersJson.users)) as User[];

const mock: MockMethod[] = [
  {
    url: '/api/users',
    method: 'get',
    timeout: 2000,
    rawResponse: (req, res) => {
      try {
        const headers = req.headers as ApiHeaders;
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const search = url.searchParams.get('search')?.toLowerCase() || '';

        if (validateToken(headers.authorization)) {
          let users = [...usersData];

          if (search) {
            users = users.filter(
              (user) =>
                user.firstName.toLowerCase().includes(search.toLowerCase()) ||
                (user.lastName && user.lastName.toLowerCase().includes(search.toLowerCase())) ||
                user.email.toLowerCase().includes(search.toLowerCase()),
            );
          }

          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(generateResponse({ users })));
        }
        return getUnAuthorizedResponse(res);
      } catch {
        return getServerError(res);
      }
    },
  },
  {
    url: '/api/users/:id',
    method: 'delete',
    timeout: 1000,
    rawResponse: (req, res) => {
      try {
        const headers = req.headers as ApiHeaders;

        if (validateToken(headers.authorization)) {
          const userId = extractIdFromUrl(req);
          const userIndex = usersData.findIndex((user) => user.id === userId);

          if (userIndex !== -1) {
            usersData.splice(userIndex, 1);
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(generateResponse({}, 'User deleted successfully')));
          }
          return getNotFoundUserResponse(res);
        }
        return getUnAuthorizedResponse(res);
      } catch {
        return getServerError(res);
      }
    },
  },
  {
    url: '/api/users/:id',
    method: 'get',
    timeout: 1000,
    rawResponse: (req, res) => {
      try {
        const headers = req.headers as ApiHeaders;

        if (validateToken(headers.authorization)) {
          const userId = extractIdFromUrl(req);
          const user = usersData.find((user) => user.id === userId);

          if (user) {
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(generateResponse({ user })));
          }
          return getNotFoundUserResponse(res);
        }
        return getUnAuthorizedResponse(res);
      } catch {
        return getServerError(res);
      }
    },
  },
  {
    url: '/api/users',
    method: 'post',
    timeout: 1500,
    rawResponse: (req, res) => {
      const headers = req.headers as ApiHeaders;
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          if (validateToken(headers.authorization)) {
            const userData = JSON.parse(body) as UserInput;
            if (!isValidUserInput(userData)) {
              return getInvalidInputResponse(res);
            }

            const newUser: User = {
              id: crypto.randomUUID(),
              firstName: userData.firstName,
              lastName: userData.lastName || '',
              status: userData.status,
              email: userData.email,
              dateOfBirth: userData.dateOfBirth,
            };
            usersData.push(newUser);
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(generateResponse({ user: newUser }, 'User created successfully')));
          }
          return getUnAuthorizedResponse(res);
        } catch {
          return getServerError(res);
        }
      });
    },
  },
  {
    url: '/api/users/:id',
    method: 'put',
    timeout: 1500,
    rawResponse: (req, res) => {
      const headers = req.headers as ApiHeaders;
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          if (validateToken(headers.authorization)) {
            const userId = extractIdFromUrl(req);
            const userIndex = usersData.findIndex((user) => user.id === userId);

            if (userIndex !== -1) {
              const userData = JSON.parse(body) as UserInput;
              if (!isValidUserInput(userData)) {
                return getInvalidInputResponse(res);
              }
              const { id } = usersData[userIndex];
              const updatedUser: User = {
                id,
                firstName: userData.firstName,
                lastName: userData.lastName || '',
                status: userData.status,
                email: userData.email,
                dateOfBirth: userData.dateOfBirth,
              };
              usersData[userIndex] = updatedUser;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(generateResponse({ user: updatedUser }, 'User updated successfully')));
            }
            return getNotFoundUserResponse(res);
          }
          return getUnAuthorizedResponse(res);
        } catch {
          return getServerError(res);
        }
      });
    },
  },
];

export default mock;
