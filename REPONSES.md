# Réponses aux questions du TP Authentification

## Partie 1 : Prisma et SQLite
- **Q1 : Pourquoi l'attribut @unique sur email est-il indispensable ?**
  Il garantit, au niveau de la base de données, qu'un email correspond à un seul compte : indispensable pour retrouver l'utilisateur à la connexion. Il protège également contre les doublons créés par deux requêtes simultanées (erreur Prisma P2002).
- **Q2 : Que contient le dossier prisma/migrations et pourquoi doit-il être versionné ?**
  Il contient l'historique SQL des changements de schéma. Le versionner dans Git permet à l'équipe, à la CI et à la production de rejouer exactement le même schéma de base de données.
- **Q3 : Quelle limite de SQLite faut-il connaître avant la production avec plusieurs serveurs ?**
  SQLite est un fichier local avec un seul processus écrivain à la fois, sans partage entre plusieurs serveurs ou conteneurs éphémères. En environnement multi-instances, il faut basculer vers PostgreSQL ou MySQL.

## Partie 2 : Validation et session
- **Q1 : Quel est l'intérêt des options httpOnly, secure et sameSite ?**
  - `httpOnly` : rend le cookie illisible par le JavaScript du navigateur (document.cookie), ce qui empêche le vol de session via une faille XSS.
  - `secure` : assure l'envoi du cookie uniquement via des connexions chiffrées en HTTPS.
  - `sameSite: "lax"` : bloque l'envoi du cookie sur la plupart des requêtes cross-site, atténuant le risque d'attaques CSRF.
- **Q2 : Pourquoi ne jamais mettre le mot de passe (même haché) dans le payload du JWT ?**
  Le payload d'un jeton JWT n'est pas chiffré, mais simplement encodé en Base64 : n'importe qui peut le lire. La signature garantit l'intégrité du token, pas sa confidentialité.
- **Q3 : Que se passe-t-il si JWT_SECRET est modifié alors que des utilisateurs sont connectés ?**
  Tous les jetons JWT existants deviennent immédiatement invalides car leur signature ne correspond plus, ce qui déconnecte instantanément tous les utilisateurs.

## Partie 3 : API d'authentification
- **Q1 : Pourquoi renvoyer le même message pour un email inconnu et un mauvais mot de passe ?**
  Pour éviter l'énumération d'utilisateurs. Un attaquant ne doit pas être en mesure de deviner quelles adresses email sont inscrites dans la base de données.
- **Q2 : Que signifie le paramètre 10 dans bcrypt.hash ? Quel effet a son augmentation ?**
  C'est le facteur de coût (2^10 itérations de calcul). Chaque incrément double le temps nécessaire au calcul : cela freine les attaques par force brute mais consomme plus de CPU serveur lors des requêtes légitimes.
- **Q3 : Quels codes HTTP utilise-t-on et quand ?**
  - `201` : ressource créée avec succès (inscription).
  - `400` : corps de requête invalide (erreur de validation Zod).
  - `401` : non authentifié ou identifiants incorrects.
  - `404` : ressource introuvable (utilisateur absent de la base).
  - `409` : conflit (l'adresse email est déjà utilisée).

## Partie 4 : Protection des routes
- **Q1 : Pourquoi ne peut-on pas utiliser Prisma directement dans le middleware ?**
  Le middleware Next.js s'exécute dans l'Edge Runtime, qui ne supporte pas toutes les API Node.js nécessaires au moteur natif de Prisma. La vérification de session s'y fait uniquement en validant le JWT avec `jose`.
- **Q2 : Qu'est-ce que la défense en profondeur ? Pourquoi ne pas se fier au seul middleware ?**
  Cela consiste à superposer plusieurs couches de protection indépendantes. En cas de contournement ou de mauvaise configuration du middleware, la page `/dashboard` et l'API `/api/auth/me` revérifient la validité de la session côté serveur directement avant d'accéder aux données.