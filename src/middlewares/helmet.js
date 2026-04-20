import helmet from 'helmet';
import env from '../config/env.js';
const isProd = env.NODE_ENV === 'production';

const helmetMiddleware = helmet({
  contentSecurityPolicy: false, // a n'activer que pour des backends qui servent du html
  referrerPolicy: { policy: 'no-referrer' }, //evite que le serveur leak des url interne
  //hsts: isProd? { maxAge: 31536000, includeSubDomains: true,}: false,
}); // force le https en prod desac pour l'instant

export default helmetMiddleware;
