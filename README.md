# 💡 Intégrer React dans une application monolithique EJS (Express.js)

## 🧭 Objectif

Ce projet montre comment **intégrer un [îlot React](https://jasonformat.com/islands-architecture/)** dans une application Node.js/Express utilisant **EJS comme moteur de template**.  
C’est une approche utile lorsqu’on souhaite :

- Ajouter des composants dynamiques sans réécrire toute l’interface
- Moderniser progressivement une app monolithique existante
- Travailler avec React uniquement là où c’est pertinent (widget, formulaire dynamique, etc.)

## 📚 Cas d’usage typiques

| Cas d’usage | Pourquoi React ici ? |
|-------------|----------------------|
| 🧾 Formulaire avec logique complexe (validation, étapes dynamiques...) | Meilleure UX, code plus maintenable qu'en vanilla JS |
| 📅 Calendrier interactif ou composant de date | Utilisation d’un composant React existant |
| 🔍 Barre de recherche avec auto-complétion | Réactivité immédiate, requêtes asynchrones simples |
| 🎨 Composant réutilisable (ex : switch, slider, modal) | Développé en React une seule fois, intégré partout |

## 🏗️ Architecture

```raw
mon-projet/
├── views/ # Dossiers de templates EJS
│ └── home.ejs
├── src/ # Code React
│ ├── index.jsx # Point d'entrée React
│ └── Hello.jsx # Composant React simple
├── dist/ # Bundle généré par Parcel
├── server.js # Serveur Express
└── package.json
```

## ⚙️ Mise en place

### 1. Initialiser le projet

```bash
npm init -y
npm install express ejs react react-dom
npm install -D parcel
```

### 2. Configurer le serveur Express avec EJS

`server.js`

```javascript
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
```

### 3. Créer et utiliser le composant React

`src/Hello.jsx`

```jsx
import React from 'react';

export default function Hello({ name }) {
  return <h1>Salut {name} !</h1>;
}
```

`src/index.jsx`

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Hello from './Hello';

// On cible l'élément où React va se monter
const container = document.getElementById('react-root');
// On récupère les props passées depuis EJS
const props = JSON.parse(container.dataset.props);

createRoot(container).render(<Hello {...props} />);
```

### 4. Template EJS

`views/home.ejs`

```html
<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <title>Démo React + EJS</title>
</head>

<body>
  <!--
    L'élément qui va nous permettre d'injecter React.
    L'attribut `data-props` contient les données passées depuis le serveur.
    On utilise JSON.stringify pour convertir l'objet en chaîne de caractères.
  -->
  <div id="react-root" data-props='<%- JSON.stringify({ name }) %>'></div>
  <!-- Le script bundlé par Parcel sera chargé ici -->
  <script type="module" src="/dist/index.js"></script>
</body>

</html>
```

NB : rien n'empêcherait d'utilser des partials EJS pour factoriser le code HTML commun à plusieurs pages (header, footer, etc.), mais pour la simplicité de la démo, on reste sur un seul fichier.

### 5. Mettre à jour le fichier `package.json`

Plusieurs précisions importantes ici:

- on utilise Parcel pour le bundling, qui nous permet d'indiquer directement dans le fichier `package.json` le fichier d'entrée (`src/index.jsx`)
- pas besoin de spécifier un fichier de sortie, Parcel va le générer automatiquement dans le dossier `dist` par défaut
- on prévoit 3 scripts :
  - `dev` pour le développement (watch en front et en back)
  - `build` pour générer le bundle front de production
  - `start` pour lancer le serveur node en production
- ⚠️ on doit aussi préciser que la target `main` est `false` car on ne veut pas que Parcel écrase le fichier `server.js` avec son bundle, ce qui est le comportement par défaut 😬

```json
{
  "name": "poc-express-react",
  "version": "1.0.0",
  "main": "server.js",
  "type": "module",
  "source": "src/index.jsx",
  "targets": {
    "main": false
  },
  "scripts": {
    "dev": "parcel watch & node --watch server.js",
    "build": "parcel build",
    "start": "node server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "ejs": "^3.1.10",
    "express": "^5.1.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "parcel": "^2.15.2"
  }
}
```

## 🧪 Lancer la démo

```bash
npm install
npm run dev
```

Puis ouvrez votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000).
