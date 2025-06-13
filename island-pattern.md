# 🏝️ L'architecture en "îlots" (Island Pattern)

Ce document accompagne le projet d'intégration de React dans une application Express/EJS. Il s'adresse à celles et ceux qui veulent comprendre l'intérêt de cette approche technique.

## 🌊 C’est quoi l’Island Pattern ?

L’**Island Pattern** (ou architecture en îlots) est une stratégie de rendu hybride :

* On sert **du HTML statique** pour l’essentiel de la page
* On ajoute **des composants dynamiques** (les "îlots") rendus avec JavaScript (React, Vue, etc.)

Chaque îlot est autonome : il se charge et s’hydrate (devient interactif) indépendamment des autres.

## ✅ Pourquoi c’est intéressant

* **Moins de JavaScript envoyé** : seul le code des îlots est hydraté, ce qui réduit considérablement le poids du bundle
* **Chargement rapide** : le reste de la page est statique, visible immédiatement, avec une UX très fluide
* **Interactivité isolée** : chaque îlot s’hydrate de manière autonome, donc un composant lent ne bloque pas les autres
* **Meilleur SEO et accessibilité** : le contenu principal est en HTML natif, directement indexable / utilisable même sans JavaScript

## 🧱 Mise en œuvre concrète

1. **Rendu HTML avec EJS** : on génère une page serveur classique
2. **Point d’ancrage React** : un `<div>` avec un `id` ou un `data-*` contient les props à passer au composant
3. **Script React ciblé** : Parcel bundle uniquement le nécessaire et hydrate le composant React

```html
<!-- Exemple d’ancrage dans une page EJS -->
<div id="react-root" data-props='<%- JSON.stringify({ name }) %>'></div>
<script type="module" src="/dist/index.js"></script>
```

## ✋ Quand l’utiliser ?

Parfait pour :

* des pages majoritairement "statiques" (ex. blogs, fiches produit...) avec des zones interactives (ex. formulaires, carrousels, filtres...)
* ou quand on veut moderniser un monolithe sans tout réécrire

## 📚 Pour aller plus loin

* [Article de Jason Miller (créateur de Preact)](https://jasonformat.com/islands-architecture/) – très bon point de départ, en anglais 🇬🇧
* Astro, Eleventy, Qwik ou même Next.js (via `app/` + `use client`) implémentent des variantes modernes de ce pattern

## Exemple concret

On peut imaginer une page qui contiendrait un composant interactif qui nécessite un chargement plus long, comme un graphique ou une carte. Pour faire simple, on va utiliser un composant qui affiche un message après un délai de 3 secondes.

`Slow.jsx`

```jsx
import React, { useEffect, useState } from 'react';

export default function Slow() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000); // 3 secondes pour simuler un composant lent

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ border: '1px solid red', padding: '1rem' }}>
      {visible ? (
        <p>⏱️ Composant lent affiché après 3 secondes.</p>
      ) : (
        <p>Chargement du composant lent...</p>
      )}
    </div>
  );
}
```

Pour ne pas alourdir trop ce projet d'exemple, on va prévoir un nouveau point d'entrée à bundler (on ne ferait pas forcément ça dans une vraie appli, mais c'est pour l'exemple).

`slow-index.js`

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import Slow from './Slow';

const container = document.getElementById('slow-root');
createRoot(container).render(<Slow />);
```

On prévoit une vue EJS qui inclut ce composant :

`slow.ejs`

```html
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8" />
    <title>Démo React + EJS - Slow</title>
</head>

<body>
    <h1>Du contenu rendu via le template EJS directement</h1>
    <div id="slow-root" data-component="Slow"></div>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti unde tempore cum impedit aspernatur, fuga ex dignissimos ratione. Ipsum hic, odit excepturi cum quia itaque perferendis earum facilis. Maiores, delectus?</p>
    <script type="module" src="/dist/slow-index.js"></script>
</body>

</html>
```

Ensuite, on ajoute une route dans Express pour servir cette vue :

`server.js`

```javascript
app.get('/slow', (req, res) => {
  res.render('slow');
});
```

Et enfin, on adapte le fichier `package.json` pour inclure le nouveau point d'entrée :

```diff
-  "source": "src/index.jsx",
+  "source": ["src/index.jsx", "src/slow-index.jsx"],
```

Ensuite, on peut lancer le serveur et accéder à `/slow` pour voir le composant lent s'afficher après 3 secondes, tout en ayant le reste de la page rendu immédiatement par EJS.
