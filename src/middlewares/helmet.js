import helmet from 'helmet';

/**
 * helmetMiddleware — sécurise les headers HTTP.
 *
 * contentSecurityPolicy désactivé : ce backend ne sert pas de HTML,
 * CSP ne s'applique qu'aux navigateurs recevant du markup.
 *
 * referrerPolicy 'no-referrer' : évite de leaker des URLs internes
 * dans le header Referer des requêtes sortantes.
 *
 * HSTS non activé : géré au niveau du reverse proxy nginx en production.
 */
const helmetMiddleware = helmet({
  contentSecurityPolicy: false,
  referrerPolicy: { policy: 'no-referrer' },
});

export default helmetMiddleware;
