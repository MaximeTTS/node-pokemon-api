const express = require("express"); // 1. Charge la librairie Express.
let pokemons = require("./mock-pokemon");
const { success, getUniqueId } = require("./helper");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");

const app = express(); // 2. Crée une instance d’Express (le serveur).
const port = 3000; // 3. Définit le port 3000 pour écouter les requêtes.

//middelwares morgane pour les url et favicon pour afficher le favicon
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

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

//Créer un nouveau pokemon
app.post("/api/pokemons", (req, res) => {
  const id = getUniqueId(pokemons);
  const pokemonCreated = { ...req.body, ...{ id: id, created: new Date() } };
  pokemons.push(pokemonCreated);
  const message = `Le pokémon ${pokemonCreated.name} a bien été crée.`;
  res.json(success(message, pokemonCreated));
});

//modifier un pokemon
app.put("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonUpdated = { ...req.body, id: id };
  pokemons = pokemons.map((pokemon) => {
    return pokemon.id === id ? pokemonUpdated : pokemon;
  });

  const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`;
  res.json(success(message, pokemonUpdated));
});

//supprimer un pokemon
// 1. Route DELETE pour supprimer un pokémon par son id
app.delete("/api/pokemons/:id", (req, res) => {
  // 2. Récupérer l’id dans l’URL et en faire un nombre
  const id = parseInt(req.params.id, 10);

  // 3. Trouver l’objet pokémon à supprimer (pour l’envoyer en réponse)
  const pokemonDeleted = pokemons.find((pokemon) => pokemon.id === id);

  // 4. Filtrer le tableau pour **ne garder que** les pokémons dont l’id est différent
  //    (autrement dit, on enlève celui qu’on veut supprimer)
  pokemons = pokemons.filter((pokemon) => pokemon.id !== id);

  // 5. Préparer un message de confirmation
  const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`;

  // 6. Renvoyer en JSON le message et l’objet supprimé
  res.json(success(message, pokemonDeleted));
});

app.listen(port, () => {
  console.log(`Serveur démarré : http://localhost:${port}`);
}); // 5. Démarre le serveur et affiche l’URL.
