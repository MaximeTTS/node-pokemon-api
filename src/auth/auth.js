/* Authentification : Créer un modèle User avec Sequelize */
const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");

module.exports = (req, res, next) => {
  // 1️⃣ On récupère l’en-tête Authorization
  const authorizationHeader = req.headers.authorization;

  // 2️⃣ On vérifie qu’il existe “!authorizationHeader” signifie “pas d’en-tête fourni”
  if (!authorizationHeader) {
    const message = "Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.";
    return res.status(401).json({ message });
  }

  // 3️⃣ On en extrait le token (après “Bearer ”)
  const token = authorizationHeader.split(" ")[1];

  // 4️⃣ On vérifie et décode le token
  jwt.verify(token, privateKey, (error, decodedToken) => {
    if (error) {
      // 5️⃣ Jeton invalide ou expiré
      const message = "L'utilisateur n'est pas autorisé à accéder à cette ressource.";
      return res.status(401).json({ message, data: error });
    }

    // 6️⃣ On récupère l’ID utilisateur encodé dans le token
    const userId = decodedToken.userId;

    // 7️⃣ Si le corps de la requête contient un userId différent, on bloque
    //    “req.body.userId && req.body.userId !== userId” :
    //      1) il y a bien un userId dans le body, ET
    //      2) ce userId ne correspond pas à celui du token
    if (req.body.userId && req.body.userId !== userId) {
      const message = "L'identifiant de l'utilisateur est invalide.";
      return res.status(401).json({ message });
    }

    // 8️⃣ Tout est OK → on passe au middleware ou à la route suivante
    next();
  });
};
