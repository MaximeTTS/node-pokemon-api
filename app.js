const express = require("express"); // 1. Charge la librairie Express.

const app = express(); // 2. Crée une instance d’Express (le serveur).
const port = 3000; // 3. Définit le port 3000 pour écouter les requêtes.

app.get("/", (req, res) => {
  res.send("Hello, express");
}); // 4. Si on va sur “/”, le serveur renvoie “Hello, express !”.

app.listen(port, () => {
  console.log(`Serveur démarré : http://localhost:${port}`);
}); // 5. Démarre le serveur et affiche l’URL.
