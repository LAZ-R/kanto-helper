import { APP_NAME, APP_VERSION } from "../../../app-properties.js";
import { playMusic } from "../../services/music.service.js";
import { POKEMONS_LIST } from "../../data/pokemons.data.js";
import { ICONS } from "../../data/svgIcons.data.js";
import { toExternalPath } from "../../router.js";
import { getSvgIcon } from "../../services/icons.service.js";
import { updateMenuDom } from "../../services/menu.service.js";
import { getUser } from "../../services/storage.service.js";
import { showToast } from "../../services/toast.service.js";
import { isLaptopOrUp, isPhone, isTablet } from "../../utils/breakpoints.js";
import { getRandomIntegerBetween } from "../../utils/math.utils.js";

// VARIABLES //////////////////////////////////////////////////////////////////////////////////////
const HEADER_ICON_CONTAINER = document.getElementById('headerIconContainer');
const HEADER_TITLE = document.getElementById('headerTitle');
const MAIN = document.getElementById('main');
const FOOTER = document.getElementById('footer');

const lrtf_glitch_dom = `
<h3>Présentation</h3>

<p>
  Le <b><i>LRT-F glitch</i></b> ("Long-Range Trainer-Fly glitch", aussi appelé "Mew glitch" ou "Bug du Croupier" en français), est un bug des versions Pokémon Rouge, Bleu et Jaune.<br>
  <b style="color: var(--color--info);">En résumé, il permet de rencontrer un Pokémon sauvage défini.</b><br>
  Découvert en 2002 et popularisé en 2003 comme étant une astuce pour rencontrer et capturer un Mew sauvage, 
  il permet en fait de capturer un certain nombre de créatures sous certaines conditions.<br>
  Une de ses variantes, le <b><i>Ditto glitch</i></b> ("bug du Métamorph"), permet théoriquement de capturer toutes les créatures du jeu.
</p>

<p>Il se compose de 3 phases principales :</p>
<ol>
  <li>
    <b>Évasion d'un Dresseur Longue Portée</b>
    <ul>
      <li><i>Permet de déclencher l'état de bug</i></li>
    </ul>
  </li>
  <li>
    <b>Combat de Dresseur</b>
    <ul>
      <li><i>Permet de réactiver les boîtes de dialogue</i></li>
    </ul>
  </li>
  <li>
    <b>Retour à la zone initiale</b>
    <ul>
      <li><i>Permet de déclencher le combat contre le Pokémon sauvage désiré</i></li>
    </ul>
  </li>
</ol>

<hr>

<h3>Contexte</h3>

<p>
  Il existe dans le jeu certains Dresseurs qui peuvent repérer et défier le joueur à n'importe quel endroit de leur ligne de mire (à la limite du visible sur l'écran).<br>
  Ces Dresseurs sont appelés "Dresseurs Longue Portée" (Long-Range Trainers), dû à la grande distance à laquelle ils peuvent repérer le joueur.
</p>
<p>
  Quand le jeu génère un PNJ sur l'écran, ce PNJ est d'abord orienté dans la direction par défaut (face au sud) pour une frame, avant d'être "mis à jour" pour faire face à la direction prévue.
  Pour les Dresseurs Longue Portée, cela a pour effet de faire pointer leur ligne de mire vers le sud pendant la première frame, avant de se corriger pour atteindre la direction souhaitée.
</p>
<p>
  <b style="color: var(--color--info);">
    Durant cette première frame, le joueur peut encore faire appraitre le menu Start, et donc utiliser une capacité ou un objet.
    Si le joueur utilise le vol ou une autre méthode d'évasion, il sera repéré par le Dresseur Longue Portée avant de s'envoler.<br>
    Le jeu interprétera alors que le joueur engage un combat, ce qui entraînera une lecture erronée de diverses valeurs et sera à l'origine du bug.
  </b>
</p>

<hr>

<h3>Réalisation</h3>

<h4>1. Évasion d'un Dresseur Longue Portée</h4>
<p>
  Trouver un Dresseur Longue Portée.<br>
  Exemples :
</p>
<ul>
  <li>le Dresseur Croupier sur la route 8 devant le souterrain qui permet d'aller de Lavanville à Céladopole (qui a donné son nom français au bug) ;</li>
  <li>le Dresseur Scout possédant un Papilusion sur la route 6 ;</li>
  <li>sur la même route, celui au nord-ouest ;</li>
  <li>le Dresseur à Azuria à côté du plan d'eau là où l'on trouve des Abra ;</li>
  <li>le Dresseur Rocket dans un étage de la Sylphe SARL à Safrania ;</li>
  <li>le Dresseur Pêcheur en bas de Lavanville</li>
</ul>
<p>
  Puis appuyer sur Start à la 1ère frame de l'entrée dans sa ligne de mire, et utiliser une méthode d'évasion pour quitter la zone du Dresseur Longue Portée.<br>
  Toute méthode d'évasion peut être utilisée: Vol bien sûr mais aussi Téléportation, et Tunnel ou Corde Sortie si le Dresseur se trouve dans une zone de grotte ou un bâtiment.
</p>
<p>
  Note: à ce stade le menu ne s'ouvre pas, cependant il est primordial qu'il marche pour la suite de cette astuce.<br>
  Il faut, pour pallier à cela, combattre un Dresseur non vaincu (et pas simplement un Pokémon sauvage, 
  car cela ne réinitialise pas correctement les valeurs eronnées définies lors de l'évasion du Dresseur à des valeurs qui ne causent pas de problèmes).
</p>

<h4>2. Combat de Dresseur</h4>

<p>
  Trouver un Dresseur non vaincu, et se laisser défier. 
  Il faut qu'il y ait au moins une case entre celui-ci et le joueur afin que le Dresseur se déplace vers lui pour le combattre, sinon le jeu plante.
</p>
<p>
  Après ce combat de Dresseur (gagné ou perdu), le joueur retrouve le contrôle du menu Start.
</p>

<h4>3. Retour à la zone initiale</h4>

<p>
  Si le joueur retourne au même endroit ou au même étage que le Dresseur Longue Portée de la phase 1, le jeu affichera le texte d'avant-combat et lancera le combat.
  Ce texte d'avant-combat utilisera l'identifiant de la dernière boîte de dialogue consultée, ce qui provoquera l'apparition automatique du menu Start.
</p>
<p>
  Après la fermeture du menu, le jeu lancera immédiatement un combat car il se trouve dans un état où il tente constamment d'afficher le texte du dresseur ennemi 
  et de lancer un combat, et finit par générer un combat contre un Pokémon sauvage 
</p>
<ul>
  <li>dont l'espèce est déterminée en fonction de la statistique spéciale du Pokémon affronté en dernier</li>
  <li>et à un niveau basé sur le modificateur d'attaque du Pokémon affronté en dernier. Si ce dernier n'est pas modifié, le Pokémon apparaitra niveau 7.</li>
</ul>

<p>
  Note: si le Pokémon n'est pas apparu, il faut s'envoler alors vers Carmin sur Mer, aller à l'Est, traverser la route 11, continuer, 
  et une fois arrivé sur la route 12 le menu Start devrait alors apparaître tout seul.
</p>

<hr>

<h3>Pokémon rencontré</h3>

<h4>Espèce</h4>
<b style="color: var(--color--info);">
  Le Pokémon rencontré par cette méthode est déterminé par le Spécial du dernier Pokémon combattu :<br>
  l'identifiant (en décimal) du Pokémon rencontré correspond à la valeur de la statistique.
</b>
<p>
  Ainsi, en fonction du Dresseur combattu à la phase 2 de la réalisation du bug (et de son dernier Pokémon affronté), le Pokémon rencontré sera différent.<br>
  Par exemple, pour rencontrer Mew (dont l'identifiant décimal vaut 21), il faut que le Spécial du dernier Pokémon affronté valle 21, 
  ce qui est le cas par exemple pour le Ramoloss du Dresseur Gamin se trouvant sur la Route 25.
</p>
<p>
  De plus, le joueur peut aller affronter un autre Dresseur ou même un Pokémon sauvage avant de relancer la rencontre dans la zone fuie à la première étape 
  afin de rencontrer le Pokémon de son choix, même si le nombre de Dresseurs est limité et que le Spécial d'un Pokémon sauvage dépend de ses DV et est peu prévisible.<br>
  Cette dernière contrainte peut être évitée en rencontrant un Métamorph, qui, en utilisant "Morphing" copie les statistiques de son adversaire.<br>
  Ainsi, le joueur peut envoyer son propre Pokémon en ayant défini son Spécial au préalable, laisser Métamorph copier cette statistique 
  et rencontrer à coup sûr n'importe quel Pokémon: cette méthode a donné naissance au <b><i>Ditto glitch</i></b> ("bug du Métamorph"), 
  plus complexe à mettre en place mais plus permissif.
</p>
<p>
  Ce bug permet aussi de rencontrer autre chose que des Pokémon sauvages: des Dresseurs (comme un Intello, en combattant un des Montagnards de la Route 25), 
  des Pokémon bugs (comme MissingNo., en combattant une des Exorcistes de la Tour Pokémon), 
  et il peut même ne rien se passer si le Spécial du dernier adversaire est un multiple de 256.
</p>
<p>
  Note: si le spécial du dernier Pokémon affronté se trouve entre 200 et 255, le joueur rencontrera un Dresseur 
  (car les identifiants des Dresseurs se trouvent dans la même table que ceux des Pokémons).<br>
  Ce dresseur disposera d'une équipe basée sur le modificateur de niveau d'attaque du dernier Pokémon affronté.<br>
  Dans certains cas, un combat contre un Dresseur bugué peut être déclenché, et l'envoi de son premier Pokémon provoque le blocage du jeu.<br>
</p>
<b style="color: var(--color--error);">
  Évitez de combattre des Pokémon avec un spécial supérieur à 247 sans regarder la table des identifiants de Dresseurs pour ne pas tomber sur un Dresseur qui pourrait déclencher un ZZAZZ glitch, 
  car ceux-ci corrompent le jeu et la sauvegarde.
</b>

<h4>Niveau</h4>
<p>
  Le <b><i>LRT-F glitch</i></b> a souvent été relayé avec un autre bug, à savoir le bug de l'expérience des Pokémon de niveau 1, 
  qui permet de monter directement au niveau 100 un Pokémon dépendant de la courbe d'expérience "parabolique" s'il gagne au maximum 54 points d'expérience au niveau 1.<br>

  La raison pour laquelle ces deux bugs ont été associés est que le premier permet également de rencontrer des Pokémon au niveau 1, 
  alors que ceux-ci sont normalement introuvables en jeu.
</p>
<p>
  Plus précisément, le niveau du Pokémon rencontré vaut par défaut 7, mais il est possible de le modifier, 
  en réduisant (ou en augmentant) l'Attaque du dernier adversaire combattu (avec Rugissement par exemple), 
  ce qui permet de choisir un niveau entre 1 et 13 pour le Pokémon rencontré en fin de bug.<br>
  La formule à appliquer est la suivante :<br>
  <i>Niveau du Pokémon à rencontrer = X + 7</i><br>
  où X est la valeur de la modification de l'attaque physique (statistique "FOR") du dernier Pokémon affronté.
</p>
<p>
  Par exemple, si le dernier Pokémon affronté subit 6 attaques "Rugissement", alors X = -6, donc le Pokémon qui est rencontré à l'aide du bug apparaît au niveau 1. 
  Il est donc possible de faire apparaître le Pokémon à un niveau compris entre 1 et 13 
  (si le Pokémon adverse augmente son attaque physique à plusieurs reprises avec l'attaque Yoga ou l'attaque Danse-Lames, par exemple).
</p>
<p>
  Ensuite, à l'aide du bug de l'expérience des Pokémon de niveau 1, 
  il suffit de faire gagner moins de 54 points d'expérience au Pokémon de niveau 1 capturé pour le faire monter immédiatement au niveau 100.<br>
  Cela ne fonctionne qu'avec les Pokémon suivants (et leurs évolutions respectives), les Pokémon dépendants de la courbe d'expérience "parabolique" :
</p>
<ul>
  <li>Bulbizarre</li>
  <li>Salamèche</li>
  <li>Carapuce</li>
  <li>Roucool</li>
  <li>Nidoran ♀</li>
  <li>Nidoran ♂</li>
  <li>Mystherbe</li>
  <li>Ptitard</li>
  <li>Abra</li>
  <li>Machoc</li>
  <li>Chétiflor</li>
  <li>Racaillou</li>
  <li>Fantominus</li>
  <li>Mew</li>
</ul>
<p>
  Mew appartenant au groupe Parabolique, la combinaison de ces deux bugs permet d'obtenir un Mew au niveau 100, 
  et si réalisé de manière optimale, dès que le joueur atteint les Routes 24 et 25, soit relativement tôt dans le scénario.
</p>
<p>
  Note : un Pokémon de niveau 1 qui a été capturé et envoyé dans le PC de Léo ne peut pas être retiré du PC (le jeu plante et oblige à redémarrer la console).<br>
  Si le joueur prévoit de capturer un Pokémon au niveau 1, il faut garder 5 Pokémon au maximum dans son équipe avant la capture du Pokémon. 
  De cette façon, le Pokémon ne va pas dans le PC.<br>
  Après être monté au niveau 100, il peut être stocké en toute sécurité dans le PC de Léo.
</p>

<hr>

<h3>Utilisation infinie</h3>
<p>
  L'inconvénient de ce bug est qu'il ne peut être exploité qu'un nombre limité de fois, en raison du fait qu'une fois qu'un Dresseur est battu, il ne peut plus être combattu à nouveau.<br>
  Cependant il existe une méthode simple pour répéter la manipulation à l'infini:
</p>
<p><b style="color: var(--color--info);">Faire en sorte de perdre le combat de Dresseur de la phase 2</b> (cela coutera un peu de Pokédollars).</p>
<p>
  Lorsqu'un combat contre un Dresseur est perdu, celui-ci pourra être combattu à nouveau jusqu'à ce qu'il soit battu. 
  C'est pourquoi perdre le combat est avantageux pour pouvoir reproduire la procédure à l'infini, là où elle serait limitée après une victoire.
</p>

<p>Voici la procédure traditionnelle:</p>
<ul>
  <li>
    Déposer toute son équipe au PC et prendre un Pokémon de niveau le plus bas possible connaissant Vol, 
    par exemple un Roucool de niveau 2, 3 ou 4 capturé sur la Route 1 qui infligera très peu de dégâts au Pokémon adverse, afin d'être sur de perdre le combat rapidement ;
  </li>
  <li>
    Effectuer la phase 1 ;<br>
    Note: Le Croupier devant le souterrain de la Route 8 possède un bug:<br>
    Si celui-ci a enclenché sa réaction en croisant le joueur sans avoir combattu mais qu'un combat contre un autre Dresseur est perdu, 
    celui-ci sera considéré comme déjà battu et ne pourra plus être combattu à nouveau.<br>
    C'est pourquoi il est préférable de commencer la procédure avec un autre Dresseur Longue Portée (par exemple l'Intello juste à sa gauche, qui n'a pas ce soucis).
  </li>
  <li>
    Effectuer la phase 2 en perdant le combat (au Pokémon adverse nécessaire à l'apparition du Pokémon désiré dans le cas d'un <b><i>LRT-F glich basique</i></b>) ;<br>
    Note: Une fois le combat perdu, le joueur est ramené à un centre Pokémon.<br>
    Dans le cas d'un <b><i>Ditto glitch</i></b>, à ce moment, il faut prendre dans son équipe le Pokémon avec la statistique de Spécial correspondant à la valeur décimale du Pokémon désiré ;
  </li>
  
  <li>
    Terminer le glitch (phase 3 dans le cas d'un <b><i>LRT-F glitch</i></b>, phases 3 et 4 dans le cas d'un <b><i>Ditto glitch</i></b>).
  </li>
</ul>
`;
// https://bulbapedia.bulbagarden.net/wiki/Mew_glitch

const ditto_glitch_dom = `
<h3>Présentation</h3>

<p>
  Le <b><i>Ditto glitch</i></b> (appelé "bug du Métamorph" en français) est un bug des versions Pokémon Rouge, Bleu et Jaune.<br>
  <b style="color: var(--color--info);">Il permet de compléter tout le Pokédex sans échange.</b><br>
  Ce bug est en réalité une extension du <b><i>LRT-F glitch</i></b>, qui permet de compléter une bonne partie du Pokédex, mais pas dans son intégralité.
</p>

<hr>

<h3>Spécificités</h3>

<h4>Phase de réalisation</h4>
<p>Il ajoute une phases principales au <b><i>LRT-F glitch</i></b>:</p>
<ol>
  <li>Évasion d'un Dresseur Longue Portée</li>
  <li>Combat de Dresseur</li>
  <li>
    <b>Combat d'un Métamorph</b>
    <ul>
      <li><i>Permet de générer un spécial spécifique pour rencontrer le Pokémon désiré à la fin du bug</i></li>
    </ul>
  </li>
  <li>Retour à la zone initiale</li>
</ol>

<h4>Préparation</h4>
<p>
  Le bug reposant là-dessus, le joueur doit avoir préparé un Pokémon dont le Spécial est égal à la valeur décimale du Pokémon recherché (il est conseillé de ne pas le mettre en tête d'équipe).<br>
  TODO: ajouter détails.
</p>

<hr>

<h3>Réalisation</h3>

<h4>1. Évasion d'un Dresseur Longue Portée</h4>
<p>Même déroulé que le <b><i>LRT-F glitch</i></b></p>

<h4>2. Combat de Dresseur</h4>
<p>
  Effectuer le combat de Dresseur requis (c'est pourquoi il est conseillé de ne pas avoir mis en tête d'équipe le Pokémon avec la statistique Spécial "cobaye" pour le bug, 
  s'il monte de niveau pendant le combat sa statistique risque d'être changée).
</p>

<h4>3. Combat d'un Métamorph</h4>
<p>
  Afin de tirer parti du conditionnement de l'espèce du Pokémon rencontrée à la fin du <b><i>LRT-F glitch</i></b> en fonction du spécial du dernier Pokémon affronté,
  le <b><i>Ditto glitch</i></b> utilise la capacité de clonage naturelle des Métamorph afin de s'assurer du spécial en question.
</p>
<ul>
  <li>
    Une fois le Dresseur battu (ou non), le menu Start se réactivera.<br>
    Grâce à cela, s'envoler à la recherche d'un Métamorph sauvage (dans Pokémon Rouge et Bleu sur la Route 23 et dans Pokémon Jaune au Manoir Pokémon à Cramois'Île, 
    au sous-sol, surtout au niveau de la porte droit devant l'escalier);
  </li>
  <li>Une fois le Métamorph sauvage rencontré, il faut le laisser se transformer en le Pokémon dont le Spécial a été formé ;</li>
  <li>
    Mettre le Métamorph K.O. ou fuir ;
    <ul>
      <li>
        <i>
          Mettre K.O. le Métamorph donne de l'expérience au Pokémon ayant été utilisé, ce qui peut potentiellement le faire monter de niveau et changer sa statistique de spécial, 
          ce qui oblige à ré-entrainer un autre Pokémon avec le même taux de spécial pour retenter de capturer le Pokémon visé.
        </i>
      </li>
    </ul>
  </li>
  <li>
    Après cela, ne plus rencontrer de Pokémon sauvage (il faut utiliser une Corde Sortie ou la compétence Tunnel si le Métamorph a été croisé au Manoir Pokémon ou dans la Caverne Azurée, 
    ou directement utiliser Vol s'il a été croisé à la Route 23) ;
  </li>
</ul>

<h4>4. Retour à la zone initiale</h4>
<p>
  L'astuce se termine comme celle du <b><i>LRT-F glitch</i></b>, à savoir retourner dans la zone initiale.
</p>

<hr>

<h3>Valeur décimale</h3>
<p>
  Pour que ce bug fonctionne, il est primordial de connaître la valeur décimale du Pokémon recherché.<br>
  Il n'existe pas d'astuce spéciale pour la savoir, 
  le seul moyen est de regarder la valeur décimale sur le tableau des valeurs décimales et hexadécimales qui proviennent des données du jeu.
</p>
<p>
  Par exemple le joueur cherche à obtenir un Bulbizarre, Pokémon qui a une valeur décimale de 153. 
  Pour cela il faut mettre dans l'équipe un Pokémon dont la statistique Spécial est égale à 153.
</p>




<hr>

<h3>Autres utilisations</h3>

<h4>Pokémon bugs</h4>
<p>
  Ce bug permet de rencontrer une petite partie des Pokémon bugs de la première génération, comme par exemple MissingNo. sous sa forme spectre de la tour de Lavanville,
   squelette de Ptéra ou squelette de Kabutops. 
</p>
`;
// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

export function render() {
  // Set HEADER layout
  if (isPhone || isTablet) {
    HEADER_TITLE.innerHTML = 'Glitches';
  }
  if (isLaptopOrUp) {
    HEADER_TITLE.innerHTML = APP_NAME;
  }

  // Set MAIN layout
  MAIN.innerHTML = `
    <div class="page-container glitches">
      ${ isLaptopOrUp ? `<h1>Glitches</h1>` : ''}

      <!-- Bug du croupier -->
      <div class="lzr-drawer">
        <div class="tile-header">
          <div>
            <h2 class="header-title">LRT-F glitch</h2>
          </div>
          <div class="tile-caret">
            ${getSvgIcon('chevron-right', 'm', null)}
          </div>
          <input type="checkbox">
        </div>
        <div class="expandable-wrapper">
          <div class="expandable-inner">
            <div class="inner-body">
              ${lrtf_glitch_dom}
            </div>
          </div>
        </div>
      </div>

      <!-- Ditto glitch -->
      <div class="lzr-drawer">
        <div class="tile-header">
          <div>
            <h2 class="header-title">Ditto Glitch</h2>
          </div>
          <div class="tile-caret">
            ${getSvgIcon('chevron-right', 'm', null)}
          </div>
          <input type="checkbox">
        </div>
        <div class="expandable-wrapper">
          <div class="expandable-inner">
            <div class="inner-body">
              ${ditto_glitch_dom}
            </div>
          </div>
        </div>
      </div>

      <h2>Clonage d'objet</h2>
      <p>
        Pour cloner ses objets il suffit de rencontrer MissingNo., par exemple avec le <b><i>LRT-F glitch</i></b> ou le <b><i>Ditto glitch</i></b>.<br>
        Le clonage d'objets repose sur une anomalie de données propre à MissingNo..<br>
        Ainsi, lors de la rencontre, 128 exemplaires du 6<sup>ème</sup> objet de l'inventaire seront ajoutés.<br>
        La duplication fonctionne quelle que soit sa forme (pixel, fossile ou spectre).<br>
        Sur certaines versions européennes, la forme pixel peut provoquer un écran noir, mais les autres formes restent utilisables.
      </p>

      <!-- https://www.prama-initiative.com/index.php?page=item-underflow-glitch -->

    </div>
  `;

  // Set FOOTER layout
  FOOTER.innerHTML = ``;

  updateMenuDom('glitches');
  
}
