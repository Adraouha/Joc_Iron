# Joc_Iron

Joc web interactiu creat amb HTML, CSS i JavaScript. L'objectiu és trobar l'extintor amagat entre diversos coets d'aniversari.

## Com es juga

En obrir la pàgina apareixen 9 imatges de coets. L'usuari ha de fer clic en una imatge per intentar trobar l'extintor ocult.

Si l'elecció és incorrecta, el coet mostra una imatge animada d'explosió, sona una explosió i apareix un missatge en català indicant quants intents queden. Després de cada error, les imatges canvien de posició perquè l'usuari hagi de tornar a endevinar.

Si l'elecció és correcta, apareix una imatge de focs artificials, sonen aplaudiments i el joc mostra el missatge de victòria: `Salvat! Enhorabona, estàs fora de perill!`

Quan acaba la partida, apareix el botó `Juga de nou` per començar una altra vegada.

## Regles del joc

- Hi ha 9 imatges en total.
- Només una posició és la correcta.
- L'usuari té 9 intents.
- Les posicions canvien després de cada intent fallit.
- Una elecció incorrecta mostra `BOOM!`.
- Una elecció correcta mostra `Enhorabona!`.

## Arxius principals

- `index.html`: estructura de la pàgina i botons del tauler.
- `styles.css`: estils visuals, colors, distribució de les imatges i canvi d'imatge segons el resultat.
- `script.js`: lògica del joc, intents, barreja de posicions, missatges i sons.
- `assets/birthday-rocket.svg`: imatge inicial del coet.
- `assets/wrong-explosion.svg`: imatge animada per als errors.
- `assets/sky-fireworks-success.svg`: imatge animada per a la victòria.

## Com obrir-lo

No cal instal·lar dependències ni engegar un servidor. Només cal obrir l'arxiu `index.html` en un navegador.

## Conceptes practicats

- Ús de `display: grid` per separar les imatges.
- Canvi d'imatge amb `background-image`.
- Animacions i efectes visuals amb SVG i CSS.
- Ús de `transform`, `opacity` i `visibility`.
- Esdeveniments de clic amb JavaScript.
- Sons generats des de JavaScript amb Web Audio.
