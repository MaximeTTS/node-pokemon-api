const { Pokemon } = require("../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports = (app) => {
  app.put("/api/pokemons/:id", (req, res) => {
    const id = req.params.id;

    // 1) Lance la requête SQL UPDATE … WHERE id = :id
    Pokemon.update(req.body, { where: { id } }).then((_) => {
      // 2) Dès que l’UPDATE est terminé, on veut récupérer l’enregistrement mis à jour
      //    On **retourne** la promesse findByPk pour la chaîner :
      return (
        Pokemon.findByPk(id)
          .then((pokemon) => {
            // 3) Si aucun Pokémon trouvé → 404
            if (pokemon === null) {
              const message = "Le pokémon demandé n'existe pas. Réessayez avec un autre identifiant.";
              return res.status(404).json({ message });
            }
            // 4) Sinon, on renvoie le Pokémon mis à jour
            const message = `Le pokémon ${pokemon.name} a bien été modifié.`;
            res.json({ message, data: pokemon });
          })
          // 5) Si la lecture par PK échoue, on renvoie un 500
          .catch((error) => {
            if (error instanceof ValidationError) {
              return res.status(400).json({ message: error.message, data: error });
            }
            if (error instanceof UniqueConstraintError) {
              return res.status(400).json({ message: error.message, data: error });
            }
            const message = "Le pokémon n'a pas pu être modifié. Réessayez dans quelques instants.";
            res.status(500).json({ message, data: error });
          })
      );
    });
  });
};
