Préparation complète basée sur tes vrais fichiers. Tout ce qui suit est tiré de ton code réel.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALERTE — DEUX BUGS CRITIQUES DANS TES FICHIERS ACTUELS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AVANT DE CONTINUER À LIRE, CORRIGE CES DEUX POINTS.

BUG UN — isOperationalError n'est pas exportée

errorHandler.js importe isOperationalError depuis appError.js, mais appError.js ne l'exporte pas. Le projet crash dès qu'une erreur arrive dans errorHandler. Ajoute cette ligne en bas d'appError.js :

export const isOperationalError = (err) => err instanceof AppError && err.isOperational;

BUG DEUX — registerLightSensor n'a pas le guard contre le double comptage

On avait identifié ce bug ensemble. Si un capteur déjà activé envoie un deuxième signal, tu ajoutes quand même 200 points. Le Set empêche l'ajout du doublon dans lightsActivated, mais les points sont toujours accordés. Ajoute ces lignes juste avant la création de newLights :

if (this.#state.lightsActivated.has(sensorId)) {
  return this.getState();
}

Ces deux corrections sont prioritaires. Le reste peut attendre.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER UN — appError.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CE QUE TU AS

Tu as quatre classes — AppError la base, NotFoundError 404, ConflictError 409, ValidationError 422, InternalError 500. C'est plus épuré que la version précédente — tu as retiré BadRequestError, UnauthorizedError et ForbiddenError. C'est un choix défendable, on en a parlé.

LIGNE PAR LIGNE — LE CONSTRUCTEUR AppError

HTTP_STATUS en haut du fichier — c'est un objet qui mappe des noms lisibles vers des codes HTTP. L'intérêt : quand tu écris HTTP_STATUS.NOT_FOUND tu ne risques pas d'écrire 440 par erreur. C'est de la défense contre les magic numbers.

super(message, { cause }) — on appelle le constructeur de la classe parente Error. Le deuxième argument avec cause est une fonctionnalité native ES2022 qui permet de chaîner des erreurs — si tu catches une erreur et tu la re-throw dans une AppError, tu peux passer l'originale dans cause pour garder toute la trace.

this.name = this.constructor.name — au lieu de hardcoder le nom, on utilise le nom de la classe courante. Si c'est une NotFoundError, name vaudra NotFoundError. Si c'est directement AppError, name vaudra AppError. C'est automatique pour toutes les sous-classes.

this.status = statusCode >= 500 ? 'error' : 'fail' — c'est la convention JSend. En dessous de 500 c'est une erreur côté client, on dit fail. Au-dessus c'est un problème serveur, on dit error. Cette logique est dans la classe et pas dans errorHandler — c'est le contrat de AppError.

this.isOperational = true — toutes les AppError sont opérationnelles par défaut. Ça signifie que c'est une erreur prévue et gérée, pas un bug inattendu. errorHandler s'en sert pour décider du niveau de log — warn pour les opérationnelles, error pour les inattendues.

this.details = details ?? null — un champ optionnel pour passer des informations supplémentaires. Par exemple une liste de champs en erreur de validation.

Error.captureStackTrace(this, this.constructor) — API V8 spécifique à Node.js. Elle génère la stacktrace en excluant les frames du constructeur de la classe d'erreur. Sans ça la stack commencerait par les lignes internes d'AppError — du bruit. Avec ça elle pointe directement vers la ligne de ton code qui a throw l'erreur.

toJSON — retourne une représentation sérialisable de l'erreur. C'est ce qu'errorHandler envoie au client. Si tu ajoutes un champ à AppError, toJSON le reflète automatiquement. Si errorHandler construisait l'objet manuellement, tu devrais penser à le mettre à jour à chaque modification de AppError.

JUSTIFICATION DES SOUS-CLASSES

Chaque sous-classe hardcode le statusCode dans super. Impossible de se tromper — si tu utilises NotFoundError tu ne peux pas accidentellement envoyer un 422. C'est de la typo-safety sans TypeScript.

QUESTION PROBABLE — pourquoi pas juste new AppError(message, 404) partout

Parce que le nom de la classe dans les logs et dans les réponses JSON est informatif. Voir NotFoundError dans les logs dit immédiatement de quel type d'erreur il s'agit, sans lire le message. Et si tu cherches tous les endroits où une 404 est levée dans le code, tu peux grep NotFoundError plutôt que de chercher le magic number 404.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER DEUX — catchAsync.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

C'est quatre lignes mais c'est un pattern fondamental à expliquer parfaitement.

CE QUE ÇA FAIT

catchAsync est une fonction qui prend une fonction en paramètre et retourne une nouvelle fonction. C'est ce qu'on appelle une Higher-Order Function — une fonction d'ordre supérieur.

La fonction retournée a la signature d'un middleware Express — req, res, next. Elle exécute le controller passé en paramètre et accroche un catch qui appelle next avec l'erreur.

POURQUOI C'EST NÉCESSAIRE

Express ne catch pas automatiquement les erreurs dans les fonctions async. Si un controller async throw ou rejette une Promise sans catch, l'erreur devient une unhandledRejection et le process s'arrête. Sans catchAsync, chaque controller devrait avoir un try catch pour appeler next(err). Avec catchAsync, une seule ligne par controller suffit.

POURQUOI .catch(next) ET PAS .catch(err => next(err))

Les deux sont strictement équivalents. Quand une Promise est rejetée, elle appelle la fonction passée à catch avec l'erreur en premier argument. next est déjà une fonction qui attend une erreur en premier argument. Passer next directement c'est plus concis.

QUESTION PROBABLE — comment ça sait que c'est une fonction async

Toute fonction async retourne une Promise. fn(req, res, next) appelle la fonction et reçoit cette Promise. .catch fonctionne sur n'importe quelle Promise, que la fonction soit async ou non.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER TROIS — errorHandler.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

C'est le seul endroit du projet où on construit une réponse d'erreur HTTP. Quatre paramètres — c'est la signature d'un error handler Express, ce qui le distingue d'un middleware normal.

ORDRE DES VÉRIFICATIONS — DU PLUS SPÉCIFIQUE AU PLUS GÉNÉRAL

D'abord ZodError — c'est le cas le plus spécifique, une erreur de validation avec ses propres propriétés issues. Si on la laissait tomber dans le bloc AppError, on perdrait les détails des champs en erreur.

Ensuite isOperationalError — AppError et toutes ses sous-classes. On log en warn parce que c'est une erreur prévue. On répond avec err.toJSON pour déléguer la sérialisation à la classe elle-même.

Enfin le catch-all — toute erreur inattendue. On log en error parce que c'est potentiellement un vrai bug. On ne révèle pas de détails au client — juste Internal Server Error. La stacktrace est dans les logs, pas dans la réponse.

POURQUOI logger.warn POUR LES AppError ET logger.error POUR LES INATTENDUES

warn signifie quelque chose d'anormal mais attendu — une donnée invalide, un état incohérent. On veut en être informé mais ce n'est pas une alerte urgente.

error signifie un vrai problème potentiel — un bug, une exception inattendue, quelque chose qui ne devrait jamais arriver. En production on configure des alertes uniquement sur les error, pas sur les warn.

POURQUOI res.status(err.statusCode).json(err.toJSON()) ET PAS CONSTRUIRE L'OBJET MANUELLEMENT

Si on construisait l'objet à la main dans errorHandler, il faudrait le mettre à jour à chaque modification de AppError. En déléguant à toJSON, le format de réponse est toujours cohérent avec la définition de la classe. C'est le principe de responsabilité unique — AppError sait comment se sérialiser, errorHandler sait juste quand appeler cette sérialisation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER QUATRE — logger.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

C'est le fichier le plus complexe et probablement le plus challengé.

STRUCTURE GÉNÉRALE

Quatre fonctions internes — createAppInsightsClient, createBaseLogger, normalizeArgs, applyAppInsightsTransport. Une fonction publique — createLogger. Un export default — l'instance du logger.

C'est le pattern factory — createLogger décide quel logger construire selon l'environnement et retourne l'instance configurée.

POURQUOI isDev = process.env.NODE_ENV !== 'production'

En développement, en test et en e2e on veut des logs lisibles et colorés via pino-pretty. En production uniquement on veut du JSON structuré. La condition est large intentionnellement — tout ce qui n'est pas production bénéficie du formatage lisible.

CREATEBASELOGGER

base: undefined supprime les champs pid et hostname que pino ajoute par défaut — inutiles dans notre contexte. timestamp: pino.stdTimeFunctions.isoTime ajoute le timestamp en format ISO 8601 — lisible par les humains et parseable par les outils de monitoring.

NORMALIZEARGS — LE CŒUR DU TRANSPORT APPINSIGHTS

Pino supporte trois façons d'appeler un logger. Avec une string seule : logger.info('message'). Avec un objet seul : logger.info({ err }). Avec objet et string : logger.warn({ err }, 'message'). normalizeArgs gère les trois cas et retourne toujours la même structure — properties et message — pour que safeTrace puisse fonctionner de façon cohérente.

Sans normalizeArgs, si tu appelles logger.info('texte simple'), properties vaudrait la string et message serait undefined — Application Insights recevrait un objet illisible.

APPLYAPPINSIGHTSTRANSPORT — POURQUOI MONKEY-PATCHING

On remplace les méthodes info, warn et error du logger pino par des fonctions qui envoient vers AppInsights. C'est du monkey-patching — modification d'un objet existant à l'exécution.

C'est discutable comme approche — une alternative serait un transport pino personnalisé via l'option transport de pino. Mais pour notre cas le monkey-patching fonctionne et est plus simple à implémenter.

Le isReady check — on vérifie que le client AppInsights est correctement configuré avant chaque appel. Si AppInsights est en panne ou mal configuré, on tombe sur console.log comme fallback — le serveur continue de fonctionner.

safeException récupère properties.err si c'est une vraie instance d'Error, sinon il crée une Error à partir du message. C'est pour que Application Insights reçoive toujours une vraie Error avec sa stacktrace, pas juste une string.

QUESTION PROBABLE — pourquoi pas un transport pino officiel

Les transports pino officiels tournent dans un worker thread séparé. Pour Application Insights qui a sa propre logique d'initialisation et de connexion, le monkey-patching sur le thread principal est plus simple et évite les problèmes de sérialisation entre threads.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER CINQ — helmet.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Helmet est une collection de middlewares qui sécurisent les headers HTTP. Chaque option correspond à un vecteur d'attaque spécifique.

contentSecurityPolicy: false — CSP dit au navigateur quelles sources de scripts et styles sont autorisées. Notre backend ne sert pas de HTML — il retourne uniquement du JSON. CSP ne s'applique pas à une API JSON, l'activer par défaut ajouterait un header inutile et pourrait causer des problèmes avec certains clients.

referrerPolicy: no-referrer — quand un navigateur fait une requête depuis notre API vers une ressource externe, le header Referer peut contenir l'URL interne de l'API. no-referrer empêche ce leakage d'URL internes.

Le reste des protections helmet — X-Content-Type-Options, X-Frame-Options, X-XSS-Protection etc. — est activé par défaut. On ne touche qu'aux deux qu'on a des raisons spécifiques de modifier.

QUESTION PROBABLE — pourquoi helmet en premier dans la chaîne de middlewares

Helmet doit être en premier pour que ses headers de sécurité soient présents sur toutes les réponses — y compris les erreurs. Si helmet était après errorHandler, les réponses d'erreur n'auraient pas les headers de sécurité.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER SIX — rateLimit.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

windowMs: 10 * 1000 — fenêtre de 10 secondes. max: 5 — maximum 5 requêtes par fenêtre par IP.

standardHeaders: true — ajoute les headers RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset dans la réponse. Le client sait combien de requêtes il lui reste.

legacyHeaders: false — désactive les anciens headers X-RateLimit-* qui sont dépréciés.

skipSuccessfulRequests: false — compte toutes les requêtes, succès comme échecs. Changer à true ne compterait que les erreurs — pour notre cas on veut limiter le volume total.

handler personnalisé — au lieu du message d'erreur par défaut d'express-rate-limit, on log l'IP et le chemin qui a déclenché la limite, et on répond avec notre format JSON cohérent avec le reste de l'API.

JUSTIFICATION DES VALEURS

5 requêtes en 10 secondes est restrictif. Pour le leaderboard qui est un GET public, l'objectif est d'éviter le scraping — quelqu'un qui rafraîchit continuellement pour monitorer les scores. En production on pourrait augmenter à 30 requêtes par minute selon l'usage réel.

QUESTION PROBABLE — le nom postScoreLimiter alors que c'est une route GET

C'est une incohérence de nommage — vestige d'une ancienne architecture où on prévoyait une route POST pour soumettre les scores. La route POST n'a jamais été créée, les scores sont soumis via WebSocket. Le nom est trompeur, devrait être leaderboardLimiter. Dette technique identifiée.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER SEPT — validate.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Middleware de validation Zod. Il prend un schema en paramètre et retourne un middleware Express — c'est encore une HOF.

schema.safeParse — contrairement à parse, safeParse ne throw jamais. Il retourne un objet avec success à true ou false. Si false, result.error contient l'erreur Zod avec tous les détails des champs invalides.

Si validation échoue, on appelle next(result.error) — l'erreur Zod est passée à errorHandler qui la traite dans son premier bloc ZodError.

Si validation réussit, req.body = result.data — on remplace le body brut par les données parsées et validées par Zod. Ça garantit que le controller reçoit des données propres avec les bons types.

QUESTION PROBABLE — ce middleware n'est utilisé nulle part

Exactement — validate.js et le schema Zod associé existent mais ne sont branchés sur aucune route. Les scores arrivent via WebSocket, pas via HTTP. C'est de l'infrastructure prête pour une future route POST /api/scores. Identifié comme dette technique.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER HUIT — sockets/index.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CE QUE ÇA FAIT

Intercepte l'événement upgrade HTTP — la demande d'un client de passer du protocole HTTP au protocole WebSocket. Lit le chemin demandé. Route vers le bon WebSocketServer. Si le chemin n'est pas reconnu, refuse proprement.

POURQUOI L'ÉVÉNEMENT upgrade ET PAS connection

La connexion WebSocket commence par une requête HTTP normale. Le client demande à upgrader le protocole. C'est cet événement upgrade qu'on intercepte — avant que la connexion soit établie — ce qui nous permet de refuser ou router avant de consommer des ressources.

new URL(request.url, 'http://localhost') — request.url est une URL relative, juste le chemin. Le constructeur URL a besoin d'une base absolue pour parser. On passe http://localhost comme base fictive uniquement pour le parsing.

POURQUOI socket.write AVANT socket.destroy

On envoie d'abord la réponse HTTP 404 pour que le client comprenne pourquoi sa connexion est refusée. Sans ça il verrait juste une connexion coupée sans explication. Inverser l'ordre — destroy avant write — enverrait le message sur une connexion déjà fermée, le client ne le verrait jamais.

handleUpgrade puis emit connection — c'est le protocole de la bibliothèque ws en mode noServer. handleUpgrade complète le handshake WebSocket et crée l'objet socket. Puis on émet manuellement l'événement connection sur le WebSocketServer pour déclencher la logique définie dans screens.js.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER NEUF — state.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CORRECTIONS ENCORE À FAIRE DANS CE FICHIER

Un — ajoute le guard contre le double comptage dans registerLightSensor comme mentionné au début.

Deux — VALID_SENSOR_IDS.length est utilisé pour vérifier si tous les capteurs sont allumés. C'est la bonne approche — si tu ajoutes un capteur dans VALID_SENSOR_IDS, le total se met à jour automatiquement.

Trois — registerBumperHit, registerSlingshotHit et registerAllCardsDown appellent assertRunning avant addPoints qui appelle aussi assertRunning. C'est redondant — le double appel ne cause pas de bug mais c'est du code inutile signalé par la review externe.

CE QUI EST BIEN DANS CE FICHIER

Le champ privé #state — encapsulation au niveau du langage, pas juste une convention.

#createInitialState comme fonction — utilisée dans le constructeur via reset et dans startGame. Une seule source de vérité pour la structure initiale.

getState avec spread plus Array.from — copie indépendante, pas de référence exposée, Set converti en tableau pour la sérialisation.

#assertRunning avec le paramètre context — le message d'erreur est précis, indique quelle opération a échoué.

startGame avec optional chaining sur trim — protège contre null et undefined, pas seulement les strings vides.

Fallback silencieux sur l'avatar — un avatar invalide devient cuphead sans bloquer la partie, c'est tolérant sur les données non critiques.

Math.max sur losesBall — défense contre un balls négatif, même si assertRunning le rend théoriquement impossible.

Mise à jour de lightsActivated avant addPoints — quand addPoints fait le spread sur this.#state, lightsActivated est déjà à jour dans le même objet final.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FICHIER DIX — screens.js
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CE QUI EST BIEN

static MAX_PAYLOAD_BYTES = 4 * 1024 comme propriété statique — fait partie de la configuration de la classe, visible directement dans la définition.

static MESSAGE_TYPES et WS_EVENTS séparés — entrants versus sortants, convention claire.

#buildMessageHandlers avec bind(this) — le contexte this est fixé sur l'instance, pas perdu quand la méthode est appelée depuis la map.

Try catch sur chaque handler — chaque handler est protégé individuellement. Une erreur dans un handler n'affecte pas les autres.

Deux niveaux de try catch dans handleBallLost — le try extérieur protège les erreurs de GameState, le try intérieur isole la sauvegarde Supabase pour que le broadcast game over soit envoyé même si la BDD est en panne.

#send avec readyState !== WebSocket.OPEN — protège contre l'envoi sur une connexion fermée ou en cours de fermeture.

wss.on('error') sur le serveur — empêche une erreur réseau de bas niveau de remonter en uncaughtException et de tuer le process.

JUSTIFICATION DU double export

export const wss = screensWss.wss — nécessaire pour le endpoint de reset en mode e2e qui doit pouvoir terminer les connexions actives.
export default screensWss.getServer() — nécessaire pour sockets/index.js qui route les connexions vers ce serveur.

QUESTION PROBABLE — pourquoi handleBallLost est async et pas les autres

C'est le seul handler qui doit attendre une opération externe — await scoreService.addNewScore. Les autres handlers ne font que modifier l'état en mémoire et broadcaster. La modification mémoire est synchrone, il n'y a rien à attendre.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLAN DES 48H
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MAINTENANT — corrections prioritaires

Ajoute isOperationalError dans appError.js. Ajoute le guard double comptage dans registerLightSensor. Lance npm test pour vérifier que tout passe.

JOUR UN — maîtrise des fichiers

Lis chaque fichier à voix haute et explique chaque ligne comme si tu l'expliquais à quelqu'un qui ne connaît pas le projet. Si tu bloques sur une ligne, tu as cette fiche pour t'aider. Entraîne-toi à répondre aux questions probables listées pour chaque fichier.

JOUR DEUX — flux et scénarios

Raconte à voix haute les quatre scénarios de la fiche précédente — capteur inconnu, Supabase en panne, game over avec erreur BDD, route inconnue. Sans lire. Si tu hésites, tu as la fiche.

Entraîne-toi à l'exercice de modification en live — ajouter une route GET /api/stats qui retourne le nombre de clients connectés. Chronomètre. Objectif 3 minutes.

Relis la liste des points à mentionner toi-même. Sois le premier à les dire avant qu'on te les demande.

FIN DE LA FICHE.