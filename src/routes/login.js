/* Authentification : Créer un modèle User avec Sequelize */
const { User } = require("../db/sequelize");
const bcrypt = require("bcrypt");

module.exports = (app) => {
  app.post("/api/login", (req, res) => {
    User.findOne({ where: { username: req.body.username } })
      .then((user) => {
        // 1️⃣ Vérifier que l’utilisateur existe
        if (!user) {
          // ⇐ “!user” veut dire “user est null ou undefined”
          // Donc si on n’a pas trouvé d’utilisateur, on renvoie un 404
          return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        // 2️⃣ Comparer le mot de passe envoyé avec le hash en base
        return bcrypt.compare(req.body.password, user.password).then((isPasswordValid) => {
          // 3️⃣ “!isPasswordValid” signifie “le mot de passe n’est pas valide”
          if (!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe incorrect." });
          }

          // 4️⃣ Tout est bon → on renvoie le succès
          return res.json({ message: "Connexion réussie", data: user });
        });
      })
      .catch((error) => {
        // 5️⃣ En cas d’erreur imprévue (connexion DB, bcrypt, etc.)
        return res.status(500).json({ message: "Erreur serveur, réessayez plus tard.", data: error });
      });
  });
};
