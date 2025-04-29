Automates Cellulaires Interactifs

Ce projet présente plusieurs automates cellulaires implémentés en JavaScript et visualisés via un `<canvas>` HTML5. L'utilisateur peut sélectionner l'automate souhaité dans un menu déroulant, ajuster la densité de départ, la vitesse, et manipuler l'évolution en temps réel.

---

## 📦 Contenu

| Fichier            | Description                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| `index.html`       | Interface principale avec le `<canvas>` et les contrôles utilisateur.       |
| `main.js`          | Charge dynamiquement les modules correspondant à chaque automate.           |
| `style.css`        | Mise en forme de la page.                                                   |
| `gameoflife.js`    | Le classique **Game of Life** de Conway.                                   |
| `forestfire.js`    | Modèle de **feu de forêt**, simulation simple d'incendie.                   |
| `briansbrain.js`   | Variante de type "self-destructive" nommée **Brian’s Brain**.              |
| `langtonAnt.js`    | Simulation de la **fourmi de Langton**, structure auto-organisée.          |
| `lenia.js`         | Version continue inspirée par les réseaux neuronaux, connue sous **Lenia**.|

---

## ▶️ Utilisation

1. Clonez le repo :
   ```bash
   git clone https://github.com/votre-utilisateur/automates-cellulaires.git
   cd automates-cellulaires
🧠 Description des automates
🧩 GOL.js – Game of Life (Conway)

    Chaque cellule a 2 états : vivante ou morte.

    Règles :

        Une cellule vivante avec 2 ou 3 voisines survit.

        Une cellule morte avec 3 voisines naît.

        Sinon, elle meurt ou reste morte.

🔥 forestfire.js – Feu de forêt

    3 états : arbre (1), feu (2), vide (0).

    Règles :

        Un arbre brûle si un voisin brûle.

        Un arbre peut apparaître aléatoirement.

        Le feu devient vide.

🧠 briansbrain.js – Brian’s Brain

    3 états : "on" (vivant), "dying", "off" (mort).

    Règles :

        Une cellule morte devient vivante si elle a exactement 2 voisines vivantes.

        Une cellule vivante devient mourante.

        Une cellule mourante devient morte.

🐜 langtonAnt.js – Fourmi de Langton

    Une fourmi se déplace sur une grille de cases noires et blanches.

    Règles :

        Si elle est sur une case blanche : tourne à droite, inverse la couleur, avance.

        Si elle est sur une case noire : tourne à gauche, inverse la couleur, avance.

    Résultat : motif complexe auto-organisé.

🌊 lenia.js – Lenia

    Automate cellulaire continu inspiré des réseaux neuronaux.

    Utilise des champs flottants et une convolution pour créer des motifs organiques évolutifs.

    Plus fluide et réaliste que les modèles classiques.
    
🌊 Lenia – Règles détaillées    
🧠 1. Espace de l’automate

    Lenia est défini sur une grille 2D (comme le Game of Life).

    Chaque cellule a une valeur réelle entre 0 et 1 (au lieu d'être binaire : vivante ou morte).

        0 = cellule totalement morte

        1 = cellule pleinement vivante

    On utilise une grille flottante, souvent stockée dans un tableau 2D de float.

🔁 2. Cycle d’évolution

Chaque mise à jour suit plusieurs étapes continues :
① Convolution locale – calcul de l’environnement

    Pour chaque cellule, on calcule un voisinage pondéré via une convolution gaussienne.

    Cela revient à appliquer un filtre radial (masque) qui donne plus de poids aux cellules proches.

    On obtient une valeur moyenne locale U(x,y) décrivant l’influence de l’environnement sur chaque cellule (x, y).

② Fonction de croissance

    On applique ensuite une fonction G(U) à cette moyenne U(x,y) :

G(U) = exp( - (U - μ)² / (2σ²) )

    Elle produit une courbe en cloche (forme de cloche centrée sur μ, avec largeur σ).

    Cela signifie que :

        Si le stimulus U est trop faible ou trop fort → croissance = faible.

        Si U ≈ μ → croissance maximale.

③ Mise à jour de la cellule

    Chaque cellule est ensuite modifiée progressivement :

A(x, y) ← A(x, y) + Δt × G(U)

    Δt est un petit pas de temps.

    On peut aussi ajouter un terme de décroissance naturelle, ou clipper les valeurs à [0, 1].

💡 3. Paramètres principaux
Paramètre	Rôle
μ	Valeur centrale du stimulus optimal
σ	Largeur de la fenêtre de tolérance autour de μ
Δt	Pas de temps entre les mises à jour
Kernel	Filtre utilisé pour la convolution (souvent gaussien)
🧬 4. Comportements émergents

Grâce à ces règles douces et continues, Lenia peut générer :

    Des créatures auto-organisées qui :

        Bougent, tournent, oscillent

        Fusionnent ou se divisent

        Maintiennent leur forme à travers le temps

    On les appelle parfois “organismes artificiels” ou “life-like patterns”
### 📌 Résumé des différences avec Game of Life

| Caractéristique        | Game of Life         | Lenia                          |
|------------------------|----------------------|--------------------------------|
| Valeurs de cellules    | Binaire (0 ou 1)     | Continue (réel ∈ [0, 1])       |
| Voisinage              | Discret (Moore)      | Flottant (convolution)         |
| Mise à jour            | Instantanée          | Lisse et progressive           |
| Résultats              | Grappes rigides      | Motifs fluides et dynamiques   |


🛠️ Architecture des scripts
 
Chaque script suit une structure commune :

export function init(canvas) { ... }
export function start() { ... }
export function stop() { ... }
export function reset() { ... }
export function randomise() { ... }

Le fichier main.js importe dynamiquement le module sélectionné et appelle les fonctions exposées.
📸 Capture d'écran

À insérer : capture du canvas avec un automate en cours d’exécution.
📃 Licence

Ce projet est sous licence MIT. Libre à vous de le modifier, utiliser et partager !
👤 Auteur

DEVELOPPEUR BRISERADIUS
