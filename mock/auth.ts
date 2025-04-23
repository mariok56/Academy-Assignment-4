import { MockMethod } from 'vite-plugin-mock';

import { ResponseCode } from './mock.type';
import { generateResponse, generateToken, getServerError } from './mock.util';

const mock: MockMethod[] = [
  {
    url: '/api/login',
    method: 'post',
    timeout: 2000,
    rawResponse: async (req, res) => {
      try {
        let body = '';
        await new Promise((resolve) => {
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', resolve);
        });

        const { email, password } = JSON.parse(body) as { email: string; password: string };
        if (email === 'academy@gmail.com' && password === 'academy123') {
          const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365; // 1 year
          const accessToken = generateToken({ email, password, expiresIn });

          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(generateResponse({ expiresIn, accessToken })));
        }
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = ResponseCode.UNAUTHORIZED;
        res.end(JSON.stringify(generateResponse({ message: 'Invalid Credentials!', code: ResponseCode.UNAUTHORIZED })));
      } catch {
        return getServerError(res);
      }
    },
  },
];
export default mock;
