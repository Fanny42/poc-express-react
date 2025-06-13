import express from "express";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");

// Pour servir les fichiers statiques bundlés par Parcel
app.use("/dist", express.static('dist'));

app.get("/", (req, res) => {
  // Ici, on pourrait avoir de la logique pour récupérer des données depuis une base de données
  // Par exemple, on pourrait récupérer un nom d'utilisateur
  res.render("home", { name: "Toto" });
});

app.listen(3000, () => {
  console.log("Serveur sur http://localhost:3000");
});
