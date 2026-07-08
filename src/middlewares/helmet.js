import helmet from 'helmet';

const helmetMiddleware = helmet({
  contentSecurityPolicy: false,
  referrerPolicy: { policy: 'no-referrer' },
});

export default helmetMiddleware;
