SITE PERSO — TOMWMUN
======================

STRUCTURE
---------
index.html                page d'accueil, juste la sidebar
portfolio.html              grille des tatouages réalisés
flash.html                    grille des flashs disponibles
css/style.css                  tout le style, sidebar + grille
js/render-grid.js               moteur qui affiche la grille depuis les données
js/portfolio-data.js            liste des pièces du portfolio (généré automatiquement, voir plus bas)
js/flash-data.js                liste des flashs disponibles (généré automatiquement, voir plus bas)
images/portfolio/                 tes photos de tatouages réalisés
images/flash/                     tes photos de flashs disponibles
fonts/                             dépose ici tes fichiers Cabinet Grotesk et Humane en .woff2
scripts/generate-data.js            script qui régénère les fichiers .js à partir des images
netlify.toml                        dit à Netlify de lancer ce script à chaque publication
tools/generator.html                outil de secours si tu restes en glisser-déposer manuel


COMMENT AJOUTER OU RETIRER UNE PHOTO (méthode automatique)
--------------------------------------------------------------
Une fois l'automatisation branchée (voir plus bas), tu n'ouvres plus
jamais de fichier .js.

Pour ajouter une pièce ou un flash : dépose l'image dans
images/portfolio/ ou images/flash/, avec un nom comme piece-05.jpg.

Pour ajouter une photo supplémentaire à une pièce déjà en ligne :
reprends le même nom que la première photo de cette pièce et ajoute
une lettre à la fin, par exemple piece-02.jpg existe déjà, tu ajoutes
piece-02b.jpg. Le site les regroupera automatiquement dans une seule
vignette qu'on fait défiler au clic. Pas de limite au nombre de lettres.

Pour retirer un flash pris ou une pièce : supprime simplement le ou
les fichiers image correspondants du dossier. Republie, elle disparaît
toute seule, la grille se réorganise sans rien casser.

Après chaque changement de photos, il faut republier (voir la section
automatisation) pour que le site régénère sa liste et se mette à jour.


METTRE EN PLACE L'AUTOMATISATION (À FAIRE UNE FOIS)
--------------------------------------------------------
Avec le glisser-déposer manuel sur Netlify, aucun script ne peut
s'exécuter : ce que tu déposes est publié tel quel. Pour que Netlify
régénère automatiquement les fichiers de données à partir de tes
photos, il faut connecter le site à un dépôt GitHub.

1. Crée un compte GitHub si besoin (github.com), puis un nouveau
   dépôt, par exemple "tomwmun-site".
2. Mets tout le contenu de ce dossier dedans. GitHub permet de le
   faire directement dans le navigateur, sans ligne de commande,
   via "uploading an existing file" sur la page du dépôt.
3. Dans Netlify, sur ce projet : Project configuration puis
   Build & deploy, et connecte-le à ce dépôt GitHub au lieu du mode
   glisser-déposer.
4. Netlify détecte automatiquement netlify.toml et lance
   "node scripts/generate-data.js" avant chaque publication.

Après ça, chaque photo ajoutée ou retirée dans GitHub puis republiée
met le site à jour tout seul, sans toucher à un fichier de code.


SI TU RESTES EN GLISSER-DÉPOSER MANUEL
------------------------------------------
Le script ne peut pas s'exécuter côté Netlify dans ce mode, il faut
donc le lancer toi-même avant de déposer le dossier :

Avec Node.js installé sur ton ordinateur : ouvre un terminal dans le
dossier du site et tape "node scripts/generate-data.js", ça régénère
les fichiers .js à partir de ce qu'il y a dans images/, puis tu
déposes le dossier sur Netlify comme avant.

Sans Node.js installé : ouvre tools/generator.html dans ton
navigateur, sélectionne toutes les photos d'un dossier, il génère le
code à coller à la main dans le fichier .js correspondant.


UNE PIÈCE AVEC PLUSIEURS PHOTOS, RAPPEL DE LA SYNTAXE
-----------------------------------------------------------
Que ce soit généré automatiquement ou écrit à la main, une pièce à
plusieurs photos ressemble à ça dans le fichier .js :
  {
    images: ["images/portfolio/piece-02.jpg", "images/portfolio/piece-02b.jpg"],
    alt: "Description de la pièce"
  }
Un clic sur la vignette fait défiler les photos, sans rien ouvrir en
fenêtre à part. De petits points apparaissent au survol pour indiquer
qu'il y en a plusieurs.


IMPORTANT
---------
Le site n'affiche que ce que contiennent portfolio-data.js et
flash-data.js. Sans l'automatisation branchée, déposer une image dans
le dossier ne suffit pas, il faut aussi régénérer ou éditer le
fichier .js correspondant.

Les textes "alt" (description de chaque photo pour l'accessibilité)
que tu écris à la main sont conservés d'une régénération à l'autre,
tant que le nom du premier fichier de la pièce ne change pas.


POLICES
-------
Le CSS attend :
fonts/CabinetGrotesk-Regular.woff2
fonts/CabinetGrotesk-Medium.woff2
fonts/Humane-Regular.woff2
Récupère-les depuis le projet Mwooong Studio et dépose-les ici.
Sans ces fichiers le site retombe sur une police système, il reste
utilisable mais sans l'identité Cabinet/Humane.


HÉBERGEMENT
-----------
Ce site est statique (HTML/CSS/JS). En glisser-déposer manuel il se
déploie comme le site Mwooong Studio. Pour l'automatisation décrite
plus haut, il doit être connecté à GitHub plutôt que déposé à la main.
