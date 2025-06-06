const express = require("express"); // 1. Charge la librairie Express.
let pokemons = require("./mock-pokemon");
const { success } = require("./helper");
const morgan = require("morgan");
const favicon = require("serve-favicon");

const app = express(); // 2. Crée une instance d’Express (le serveur).
const port = 3000; // 3. Définit le port 3000 pour écouter les requêtes.

//middelwares morgane pour les url et favicon pour afficher le favicon
app.use(favicon(__dirname + "/favicon.ico")).use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello, express");
}); // 4. Si on va sur “/”, le serveur renvoie “Hello, express !”.

app.get("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokemons.find((pokemon) => pokemon.id === id);
  const message = "Un pokemon a bien été trouvé.";
  res.json(success(message, pokemon));
}); // 6 route dynamique avec notre reponse fonction success

//nouvelle route de terminaison, affichant le nombre total de pokemon
app.get("/api/pokemons", (req, res) => {
  const message = "Voici la liste complete du pokedex :";
  res.json(success(message, pokemons));
});

app.listen(port, () => {
  console.log(`Serveur démarré : http://localhost:${port}`);
}); // 5. Démarre le serveur et affiche l’URL.
