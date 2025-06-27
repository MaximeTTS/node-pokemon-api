const express = require("express"); // 1. Charge la librairie Express.
let pokemons = require("./src/db/mock-pokemon");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const sequelize = require("./src/db/sequelize");

const app = express(); // 2. Crée une instance d’Express (le serveur).
const port = 3000; // 3. Définit le port 3000 pour écouter les requêtes.

//middelwares morgane pour les url et favicon pour afficher le favicon
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

sequelize.initDb();

//nos futurs points de terminaisons/
require("./src/routes/findAllPokemons")(app);
require("./src/routes/findPokemonsByPk")(app);
require("./src/routes/createPokemon")(app);
require("./src/routes/updatePokemon")(app);
require("./src/routes/deletePokemon")(app);

// on ajoute la gestion des erreurs 404
app.use((req, res) => {
  const message = "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});

app.listen(port, () => {
  console.log(`Serveur démarré : http://localhost:${port}`);
}); // 5. Démarre le serveur et affiche l’URL.
