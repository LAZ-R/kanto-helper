import { APP_NAME, APP_VERSION } from "../../../app-properties.js";
import { playMusic } from "../../services/music.service.js";
import { POKEMONS_LIST, TYPES } from "../../data/pokemons.data.js";
import { ICONS } from "../../data/svgIcons.data.js";
import { APP_BASE_PATH, APP_ORIGIN, toExternalPath } from "../../router.js";
import { getSvgIcon } from "../../services/icons.service.js";
import { updateMenuDom } from "../../services/menu.service.js";
import { getUser } from "../../services/storage.service.js";
import { showToast } from "../../services/toast.service.js";
import { isLaptopOrUp, isPhone, isTablet } from "../../utils/breakpoints.js";
import { getRandomIntegerBetween } from "../../utils/math.utils.js";
import { getFilterStringForHexValue } from "../../utils/factory/filter.js";
import { getCssRootVariableValue } from "../../utils/UTILS.js";
import { initMapLogic, MAP_ZOOM_CHANGE_EVENT, mapEvents, mapState, setMapToSpecificCoordinatesAndZoom, destroyMapLogic } from "../../services/map.service.js";

// VARIABLES //////////////////////////////////////////////////////////////////////////////////////
const HEADER_ICON_CONTAINER = document.getElementById('headerIconContainer');
const HEADER_TITLE = document.getElementById('headerTitle');
const MAIN = document.getElementById('main');
const FOOTER = document.getElementById('footer');

const CITIES = [
  {
    id: 'bourg-palette',
    name: 'Bourg<br>Palette',
    desc: `Petite ville paisible du sud de Kanto. C'est ici que débute l'aventure du joueur.`,
    x_coord: 958,
    y_coord: 3904,
  },
  {
    id: 'jadielle',
    name: 'Jadielle',
    desc: `Ville verdoyante située à l'ouest de Kanto. Son Arène reste inaccessible au début du voyage.`,
    x_coord: 958,
    y_coord: 2860,
  },
  {
    id: 'argenta',
    name: 'Argenta',
    desc: `Ville minérale adossée aux montagnes, connue pour son musée.`,
    x_coord: 958,
    y_coord: 1130,
  },
  {
    id: 'azuria',
    name: 'Azuria',
    desc: `Ville fluviale du nord de Kanto, traversée par une rivière.`,
    x_coord: 3840,
    y_coord: 850,
  },
  {
    id: 'carmin-sur-mer',
    name: 'Carmin<br>sur Mer',
    desc: `Ville portuaire ouverte sur la mer. Le paquebot Océane y fait régulièrement escale.`,
    x_coord: 3840,
    y_coord: 3150,
  },
  {
    id: 'lavanville',
    name: 'Lavanville',
    desc: `Petite ville au passé troublé et au climat étrange, dominée par la Tour Pokémon et son atmosphère mystérieuse.`,
    x_coord: 5280,
    y_coord: 1990,
  },
  {
    id: 'celadopole',
    name: 'Céladopole',
    desc: `Grande ville commerçante célèbre pour son Casino, son Centre Commercial.`,
    x_coord: 2810,
    y_coord: 1990,
  },
  {
    id: 'safrania',
    name: 'Safrania',
    desc: `Grande métropole située au cœur de Kanto. Elle abrite notamment la Sylph SARL.`,
    x_coord: 3840,
    y_coord: 1990,
  },
  {
    id: 'parmanie',
    name: 'Parmanie',
    desc: `Ville méridionale réputée pour son Parc Safari.`,
    x_coord: 2880,
    y_coord: 4580,
  },
  {
    id: 'cramois-ile',
    name: 'Cramois\'Île',
    desc: `Île isolée accessible par la mer. On y trouve un manoir en ruines et un laboratoire.`,
    x_coord: 961,
    y_coord: 5580,
  },
  {
    id: 'plateau-indigo',
    name: 'Plateau<br>Indigo',
    desc: `Siège de la Ligue Pokémon. L'accès est réservé aux Dresseurs possédant huit Badges.`,
    x_coord: 156,
    y_coord: 250,
  },
];

const GYMS = [
  {
    id: 'argenta-gym',
    name: `Arène<br>Badge Roche <img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Roche.png" />`,
    desc: `Arène officielle d'Argenta, spécialisée dans le type ROCHE.`,
    x_coord: 880,
    y_coord: 1117,
  },
  {
    id: 'azuria-gym',
    name: `Arène<br>Badge Cascade <img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Cascade.png" />`,
    desc: `Arène officielle d'Azuria, spécialisée dans le type EAU.`,
    x_coord: 3968,
    y_coord: 861,
  },
  {
    id: 'carmin-sur-mer-gym',
    name: `Arène<br>Badge Foudre <img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Foudre.png" />`,
    desc: `Arène officielle de Carmin sur Mer, spécialisée dans le type ELECTRIK.`,
    x_coord: 3696,
    y_coord: 3166,
  },
  {
    id: 'celadopole-gym',
    name: `Arène<br>Badge Prisme <img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Prisme.png" />`,
    desc: `Arène officielle de Céladopole, spécialisée dans le type PLANTE.`,
    x_coord: 2560,
    y_coord: 2142,
  },
  {
    id: 'safrania-gym',
    name: `Arène<br>Badge Marais <img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Marais.png" />`,
    desc: `Arène officielle de Safrania, spécialisée dans le type PSY.`,
    x_coord: 4036,
    y_coord: 1757,
  },
  {
    id: 'parmanie-gym',
    name: `Arène<br>Badge Âme <img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Âme.png" />`,
    desc: `Arène officielle de Parmanie, spécialisée dans le type POISON.`,
    x_coord: 2672,
    y_coord: 4733,
  },
  {
    id: 'cramois-ile-gym',
    name: `Arène<br>Badge Volcan <img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Volcan.png" />`,
    desc: `Arène officielle de Cramois'Île, spécialisée dans le type FEU.`,
    x_coord: 1072,
    y_coord: 5502,
  },
  {
    id: 'jadielle-gym',
    name: `Arène<br>Badge Terre <img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Terre.png" />`,
    desc: `Arène officielle de Jadielle, spécialisée dans le type SOL.`,
    x_coord: 1136,
    y_coord: 2686,
  },
];

const MAJOR_SITES = [
  {
    id: 'foret-jade',
    name: 'Forêt<br>de Jade',
    desc: `Forêt dense reliant Jadielle à Argenta, elle est connue pour ses Pokémon de type Insecte.`,
    x_coord: 910,
    y_coord: 1930,
  },
  {
    id: 'cave-taupiqueur-1',
    name: 'Cave<br>Taupiqueur',
    desc: `Tunnel étroit reliant la Route 2 à Carmin sur Mer.`,
    x_coord: 1022,
    y_coord: 1546,
  },
  {
    id: 'mont-selenite',
    name: 'Mont<br>Sélénite',
    desc: `Montagne rocheuse reliant Argenta à Azuria. Des fossiles anciens et des <b>Pierres Lune</b> y ont été découverts.`,
    x_coord: 2490,
    y_coord: 700,
  },
  {
    id: 'caverne-azuree',
    name: 'Caverne<br>Azurée',
    desc: `Seul un Maitre Pokémon peut espérer y pénétrer. Son intérieur reste mystérieux.`,
    x_coord: 3484,
    y_coord: 700,
  },
  {
    id: 'grotte-sombre-1',
    name: 'Grotte',
    desc: `Long tunnel obscur reliant Azuria à Lavanville.  Une source de lumière y est fortement recommandée.`,
    x_coord: 5202,
    y_coord: 954,
  },
  {
    id: 'grotte-sombre-2',
    name: 'Grotte',
    desc: `Long tunnel obscur reliant Lavanville à Azuria. Une source de lumière y est fortement recommandée.`,
    x_coord: 5228,
    y_coord: 1514,
  },
  {
    id: 'centrale',
    name: 'Centrale',
    desc: `Ancienne centrale électrique abandonnée. On raconte qu'un Pokémon rare y aurait élu domicile.`,
    x_coord: 5216,
    y_coord: 1300,
  },
  {
    id: 'tour-pokemon',
    name: 'Tour<br>Pokémon',
    desc: `Tour funéraire de Lavanville, récemment perturbée par des événements inhabituels.`,
    x_coord: 5360,
    y_coord: 1850,
  },
  {
    id: 'cave-taupiqueur-2',
    name: 'Cave<br>Taupiqueur',
    desc: `Tunnel étroit reliant Carmin sur Mer à la Route 2.`,
    x_coord: 4240,
    y_coord: 3050,
  },
  {
    id: 'oceane',
    name: 'Océane',
    desc: `Paquebot de luxe amarré à Carmin sur Mer. Une escale à bord pourrait s'avérer utile.`,
    x_coord: 3826,
    y_coord: 3550,
  },
  {
    id: 'casino',
    name: 'Casino',
    desc: `Salle de jeux animée de Céladopole. Des rumeurs parlent d'activités suspectes en sous-sol.`,
    x_coord: 2864,
    y_coord: 2015,
  },
  {
    id: 'sylph-sarl',
    name: 'Sylph<br>SARL',
    desc: `Immeuble emblématique de Safrania, récemment investi par la Team Rocket.`,
    x_coord: 3840,
    y_coord: 1990,
  },
  {
    id: 'parc-safari',
    name: 'Parc<br>Safari',
    desc: `Zone de capture spéciale permettant d'obtenir des Pokémon rares et quelques surprises.`,
    x_coord: 2864,
    y_coord: 4300,
  },
  {
    id: 'iles-ecume',
    name: 'Îles<br>Écume',
    desc: `Archipel glacé reliant Parmanie à Cramois'Île. Un puissant Pokémon y aurait trouvé refuge.`,
    x_coord: 1984,
    y_coord: 5560,
  },
  {
    id: 'manoir-pokemon',
    name: 'Manoir<br>Pokémon',
    desc: `Manoir en ruines renfermant d'étranges journaux relatant des expériences passées.`,
    x_coord: 911,
    y_coord: 5596,
  },
  {
    id: 'route-victoire',
    name: 'Route<br>Victoire',
    desc: `Dernier grand passage avant la Ligue Pokémon. Seuls les plus déterminés atteindront la sortie.`,
    x_coord: 145,
    y_coord: 846,
  },
];

const MINOR_SITES = [
  {
    id: 'red-house',
    name: 'Maison<br>de Red',
    desc: `Maison du joueur.<br>Point de départ de l'aventure.`,
    x_coord: 896,
    y_coord: 3820,
  },
  {
    id: 'blue-house',
    name: 'Maison<br>de Blue',
    desc: `Maison du rival du joueur.<br>Un membre de sa famille pourrait avoir quelque chose d'utile.`,
    x_coord: 1023,
    y_coord: 3820,
  },
  {
    id: 'oak-lab',
    name: 'Labo du<br>Pr. Chen',
    desc: `Laboratoire du Professeur Chen, spécialiste reconnu et inventeur du <b>PokéDex</b>.`,
    x_coord: 1007,
    y_coord: 3904,
  },
  {
    id: 'musee',
    name: 'Musée',
    desc: `Musée d'Argenta exposant des fossiles et des vestiges anciens.`,
    x_coord: 864,
    y_coord: 940,
  },
  {
    id: 'leo-house',
    name: 'Maison<br>de Léo',
    desc: `Maison de Léo, inventeur du <b>Système de Stockage Pokémon</b>.`,
    x_coord: 4736,
    y_coord: 39,
  },
  {
    id: 'cycles-gogo',
    name: 'Cycles<br>à Gogo',
    desc: `Magasin de vélos. Une offre spéciale peut être obtenue avec le bon document.`,
    x_coord: 3744,
    y_coord: 956,
  },
  {
    id: 'pension',
    name: 'Pension',
    desc: `Pension permettant de confier un Pokémon pour qu'il gagne progressivement de l'expérience.`,
    x_coord: 3840,
    y_coord: 1480,
  },
  {
    id: 'souterrain-n-s-1',
    name: 'Souterrain<br>Azuria - Carmin sur Mer',
    desc: `Passage souterrain reliant Azuria à Carmin sur Mer, évitant Safrania.`,
    x_coord: 3968,
    y_coord: 1566,
  },
  {
    id: 'dojo',
    name: 'Dojo',
    desc: `Dojo de Safrania proposant un défi distinct de l'Arène officielle.`,
    x_coord: 3920,
    y_coord: 1756,
  },
  {
    id: 'souterrain-n-s-2',
    name: 'Souterrain<br>Azuria - Carmin sur Mer',
    desc: `Passage souterrain reliant Carmin sur Mer à Azuria, évitant Safrania.`,
    x_coord: 3968,
    y_coord: 2494,
  },
  {
    id: 'fan-club',
    name: 'Fan club<br>Pokémon',
    desc: `Lieu de rencontre des passionnés de Pokémon. Le Président aime raconter de longues histoires.`,
    x_coord: 3680,
    y_coord: 3070,
  },
  {
    id: 'souterrain-e-o-1',
    name: 'Souterrain<br>Céladopole - Lavanville',
    desc: `Passage souterrain reliant Lavanville à Céladopole, évitant Safrania.`,
    x_coord: 4384,
    y_coord: 1902,
  },
  {
    id: 'souterrain-e-o-2',
    name: 'Souterrain<br>Céladopole - Lavanville',
    desc: `Passage souterrain reliant Céladopole à Lavanville, évitant Safrania.`,
    x_coord: 3296,
    y_coord: 2046,
  },
  {
    id: 'centre-commercial',
    name: 'Centre<br>Commercial',
    desc: `Grand magasin de Céladopole proposant objets, CT et boissons.`,
    x_coord: 2560,
    y_coord: 1890,
  },
  {
    id: 'manoir-celadon',
    name: 'Manoir<br>Céladon',
    desc: `Bâtiment résidentiel. Un Pokémon particulier y attend le joueur.`,
    x_coord: 2800,
    y_coord: 1842,
  },
  {
    id: 'maison-gardien',
    name: 'Maison du<br>Gardien',
    desc: `Maison du Gardien du Parc Safari. Un objet égaré pourrait l'intéresser.`,
    x_coord: 3008,
    y_coord: 4744,
  },
  {
    id: 'labo-pokemon',
    name: 'Laboratoire<br>Pokémon',
    desc: `Laboratoire de Cramois'Île étudiant les fossiles de Pokémon anciens.`,
    x_coord: 911,
    y_coord: 5502,
  },
  {
    id: 'guardpost-n',
    name: 'Poste de<br>garde Nord',
    desc: `Poste de garde reliant Azuria à Safrania.`,
    x_coord: 3840,
    y_coord: 1662,
  },
  {
    id: 'guardpost-e',
    name: 'Poste de<br>garde Est',
    desc: `Poste de garde reliant Lavanville à Safrania.`,
    x_coord: 4240,
    y_coord: 2015,
  },
  {
    id: 'guardpost-s',
    name: 'Poste de<br>garde Sud',
    desc: `Poste de garde reliant Carmin sur Mer à Safrania.`,
    x_coord: 3856,
    y_coord: 2380,
  },
  {
    id: 'guardpost-w',
    name: 'Poste de<br>garde Ouest',
    desc: `Poste de garde reliant Céladopole à Safrania.`,
    x_coord: 3440,
    y_coord: 2015,
  },
];

const ROADS = [
  {
    id: 'road-1',
    name: 'Route 1',
    desc: `Route qui relie Bourg-Palette à Jadielle.`,
    x_coord: 958,
    y_coord: 3420,
  },
  {
    id: 'road-2',
    name: 'Route 2',
    desc: `Route qui relie Jadielle à Argenta. Elle traverse la Forêt de Jade.`,
    x_coord: 958,
    y_coord: 2050,
  },
  {
    id: 'road-3',
    name: 'Route 3',
    desc: `Route qui relie Argenta au Mont Sélénite.`,
    x_coord: 1750,
    y_coord: 1130,
  },
  {
    id: 'road-4',
    name: 'Route 4',
    desc: `Route qui relie le Mont Sélénite à Azuria.`,
    x_coord: 2950,
    y_coord: 850,
  },
  {
    id: 'road-5',
    name: 'Route 5',
    desc: `Route qui relie Azuria à Safrania.`,
    x_coord: 3840,
    y_coord: 1350,
  },
  {
    id: 'road-6',
    name: 'Route 6',
    desc: `Route qui relie Safrania à Carmin sur Mer.`,
    x_coord: 3840,
    y_coord: 2650,
  },
  {
    id: 'road-7',
    name: 'Route 7',
    desc: `Route qui relie Safrania à Céladopole.`,
    x_coord: 3350,
    y_coord: 1990,
  },
  {
    id: 'road-8',
    name: 'Route 8',
    desc: `Route qui relie Safrania à Lavanville.`,
    x_coord: 4660,
    y_coord: 1990,
  },
  {
    id: 'road-9',
    name: 'Route 9',
    desc: `Route qui relie Azuria à la Route 10. Elle mène vers l'est de Kanto.`,
    x_coord: 4660,
    y_coord: 850,
  },
  {
    id: 'road-10',
    name: 'Route 10',
    desc: `Route située à l'est de Kanto, proche de la Grotte et de la Centrale.`,
    x_coord: 5275,
    y_coord: 1350,
  },
  {
    id: 'road-11',
    name: 'Route 11',
    desc: `Route qui relie Carmin sur Mer au passage vers la Route 12.`,
    x_coord: 4640,
    y_coord: 3150,
  },
  {
    id: 'road-12',
    name: 'Route 12',
    desc: `Longue route côtière au sud de Lavanville. Idéale pour la pêche.`,
    x_coord: 5275,
    y_coord: 3000,
  },
  {
    id: 'road-13',
    name: 'Route 13',
    desc: `Route côtière qui prolonge la Route 12 vers l'ouest.`,
    x_coord: 4640,
    y_coord: 4000,
  },
  {
    id: 'road-14',
    name: 'Route 14',
    desc: `Route côtière reliant la Route 13 à la Route 15.`,
    x_coord: 4330,
    y_coord: 4300,
  },
  {
    id: 'road-15',
    name: 'Route 15',
    desc: `Route qui relie la Route 14 à Parmanie (par le sud-est).`,
    x_coord: 3740,
    y_coord: 4580,
  },
  {
    id: 'road-16',
    name: 'Route 16',
    desc: `Route à l'ouest de Céladopole. Un accès important se trouve dans une maison isolée.`,
    x_coord: 2100,
    y_coord: 1990,
  },
  {
    id: 'road-17',
    name: 'Route 17<br>(Piste Cyclable)',
    desc: `Longue descente entre Céladopole et Parmanie, très appréciée des cyclistes.`,
    x_coord: 1918,
    y_coord: 3150,
  },
  {
    id: 'road-18',
    name: 'Route 18',
    desc: `Route qui relie la Piste Cyclable à Parmanie.`,
    x_coord: 2120,
    y_coord: 4580,
  },
  {
    id: 'road-19',
    name: 'Chenal 19',
    desc: `Route maritime qui relie Parmanie aux îles du sud.`,
    x_coord: 2600,
    y_coord: 5610,
  },
  {
    id: 'road-20',
    name: 'Chenal 20',
    desc: `Route maritime qui relie Cramois'Île aux Îles Écume. Les courants y sont capricieux.`,
    x_coord: 1480,
    y_coord: 5610,
  },
  {
    id: 'road-21',
    name: 'Chenal 21',
    desc: `Route maritime qui relie Cramois'Île à Bourg-Palette.`,
    x_coord: 958,
    y_coord: 4800,
  },
  {
    id: 'road-22',
    name: 'Route 22',
    desc: `Route à l'ouest de Jadielle menant vers le Plateau Indigo.`,
    x_coord: 320,
    y_coord: 2860,
  },
  {
    id: 'road-23',
    name: 'Route<br>23',
    desc: `Route menant au Plateau Indigo. L'accès est contrôlé par des gardes.`,
    x_coord: 156,
    y_coord: 1930,
  },
  {
    id: 'road-24',
    name: 'Route 24',
    desc: `Route au nord d'Azuria, surnommée le Pont Pépite.`,
    x_coord: 3840,
    y_coord: 430,
  },
  {
    id: 'road-25',
    name: 'Route 25',
    desc: `Route côtière menant à la maison de Léo.`,
    x_coord: 4400,
    y_coord: 140,
  },
];


mapEvents.addEventListener(MAP_ZOOM_CHANGE_EVENT, handleZoomChange);

const zoomMin = 0.060;
const zoomMax = 2.500;

const cityNameScaleMin = 0.0001;
const cityNameScaleMax = 1;

const gymNameScaleMin = 1;
const gymNameScaleMax = 4;

const majorSiteNameScaleMin = 0.2;
const majorSiteNameScaleMax = 0.75;

const minorSiteNameScaleMin = 0.175;
const minorSiteNameScaleMax = 1.25;

const roadNameScaleMin = 0.0001;
const roadNameScaleMax = 1;

function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}

function computeCityNameScale(currentZoom, k = 6) {
  const t = clamp01((currentZoom - zoomMin) / (zoomMax - zoomMin)); // 0..1
  const range = cityNameScaleMax - cityNameScaleMin;

  // zoomMin -> cityNameScaleMax ; zoomMax -> cityNameScaleMin
  return cityNameScaleMin + Math.pow(1 - t, k) * range;
}

function computeGymNameScale(currentZoom, k = 6) {
  const t = clamp01((currentZoom - zoomMin) / (zoomMax - zoomMin)); // 0..1
  const range = gymNameScaleMax - gymNameScaleMin;

  // zoomMin -> gymNameScaleMax ; zoomMax -> gymNameScaleMin
  return gymNameScaleMin + Math.pow(1 - t, k) * range;
}

function computeMajorSiteNameScale(currentZoom, k = 6) {
  const t = clamp01((currentZoom - zoomMin) / (zoomMax - zoomMin)); // 0..1
  const range = majorSiteNameScaleMax - majorSiteNameScaleMin;

  // zoomMin -> majorSiteNameScaleMax ; zoomMax -> majorSiteNameScaleMin
  return majorSiteNameScaleMin + Math.pow(1 - t, k) * range;
}

function computeMinorSiteNameScale(currentZoom, k = 6) {
  const t = clamp01((currentZoom - zoomMin) / (zoomMax - zoomMin)); // 0..1
  const range = minorSiteNameScaleMax - minorSiteNameScaleMin;

  // zoomMin -> minorSiteNameScaleMax ; zoomMax -> minorSiteNameScaleMin
  return minorSiteNameScaleMin + Math.pow(1 - t, k) * range;
}

function computeRoadNameScale(currentZoom, k = 6) {
  const t = clamp01((currentZoom - zoomMin) / (zoomMax - zoomMin)); // 0..1
  const range = roadNameScaleMax - roadNameScaleMin;

  // zoomMin -> roadNameScaleMax ; zoomMax -> roadNameScaleMin
  return roadNameScaleMin + Math.pow(1 - t, k) * range;
}

let isFirst = true;
let isMenuVisible = false;

// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

export function render() {
  // Set HEADER layout
  if (isPhone || isTablet) {
    HEADER_TITLE.innerHTML = 'Carte';
  }
  if (isLaptopOrUp) {
    HEADER_TITLE.innerHTML = APP_NAME;
  }

  // Set MAIN layout
  MAIN.innerHTML = `
    <div class="map-viewport">
      <div class="map">
        ${getMinorSitesDom()}
        ${getMajorSitesDom()}
        ${getGymsDom()}
        ${getRoadsDom()}
        ${getCitiesDom()}
      </div>
    </div>
    <div id="contextualMenu" class="contextual-menu hidden">
      <div class="top-area">
        <span id="contextualMenuTitle">Title</span>
        <button class="lzr-button lzr-square lzr-solid" onclick="hideMenu()">${getSvgIcon('xmark')}</button>
      </div>
      <div id="contextualMenuBody" class="contextual-menu-body">Title</div>
    </div>
  `;

  // Set FOOTER layout
  FOOTER.innerHTML = ``;

  updateMenuDom('map');

  initMapLogic({
    mapKey: "kanto-map",
    resetStateWhenMapKeyChanges: false,
    maxScale: 2.5,
    minScaleMode: "contain", // ou "fixed"
    //minScaleFixed: 0.03,
    initialView: { scale: 1.2, centerMapX: 961 + 500, centerMapY: 3904 + 500 },
    keepCenterPointOnResize: true
  });

  playMusic('pallet-town');
  setLabelsDomForZoomLevel(isFirst ? 1.2 : mapState.scale);
  isFirst = false;

  document.getElementById('contextualMenuTitle').innerHTML = CITIES[0].name.replace('<br>', ' ');
  document.getElementById('contextualMenuBody').innerHTML = `<p>${CITIES[0].desc}</p>`;

  navigation.addEventListener('navigate', (navEvent) => {
    isMenuVisible = false;
    destroyMapLogic();
  });
}

// Dom hydration

function getCityDom(city) {
  return `<span id="${city.id}" onclick="onMapLabelClick('${city.id}', 'city')" class="city-name ${city.id}" style="left: ${city.x_coord + 500}px; top: ${city.y_coord + 500}px;">${city.name}</span>`;
}
function getCitiesDom() {
  let str = '';
  for (let city of CITIES) {
    str += getCityDom(city);
  }
  return str;
}

function getGymDom(gym) {
  return `<span id="${gym.id}" onclick="onMapLabelClick('${gym.id}', 'gym')" class="gym-name ${gym.id}" style="left: ${gym.x_coord + 500}px; top: ${gym.y_coord + 500}px;">${gym.name}</span>`;
}
function getGymsDom() {
  let str = '';
  for (let gym of GYMS) {
    str += getGymDom(gym);
  }
  return str;
}

function getMajorSiteDom(site) {
  return `<span id="${site.id}" onclick="onMapLabelClick('${site.id}', 'major')" class="major-site-name ${site.id}" style="left: ${site.x_coord + 500}px; top: ${site.y_coord + 500}px;">${site.name}</span>`;
}
function getMajorSitesDom() {
  let str = '';
  for (let site of MAJOR_SITES) {
    str += getMajorSiteDom(site);
  }
  return str;
}

function getMinorSiteDom(site) {
  return `<span id="${site.id}" onclick="onMapLabelClick('${site.id}', 'minor')" class="minor-site-name ${site.id}" style="left: ${site.x_coord + 500}px; top: ${site.y_coord + 500}px;">${site.name}</span>`;
}
function getMinorSitesDom() {
  let str = '';
  for (let site of MINOR_SITES) {
    str += getMinorSiteDom(site);
  }
  return str;
}

function getRoadDom(road) {
  return `<span id="${road.id}" onclick="onMapLabelClick('${road.id}', 'road')" class="road-name ${road.id}" style="left: ${road.x_coord + 500}px; top: ${road.y_coord + 500}px;">${road.name}</span>`;
}
function getRoadsDom() {
  let str = '';
  for (let road of ROADS) {
    str += getRoadDom(road);
  }
  return str;
}

function onMapLabelClick(labelId, type) {
  console.log(labelId);
  let obj = null;
  let zoomLevel = 1;
  switch (type) {
    case 'city':  obj = CITIES.find((e) => e.id == labelId);      zoomLevel = .587; break;
    case 'gym':   obj = GYMS.find((e) => e.id == labelId);        zoomLevel = 1.5; break;
    case 'major': obj = MAJOR_SITES.find((e) => e.id == labelId); zoomLevel = 1.13; break;
    case 'minor': obj = MINOR_SITES.find((e) => e.id == labelId); zoomLevel = 1.75; break;
    case 'road':  obj = ROADS.find((e) => e.id == labelId);      zoomLevel = .4; break;
    default: break;
  }
  document.getElementById('contextualMenuTitle').innerHTML = obj.name.replace('<br>', ' ');
  document.getElementById('contextualMenuBody').innerHTML = `<p>${obj.desc}</p>`;

  setMapToSpecificCoordinatesAndZoom(obj.x_coord + 500, obj.y_coord + 550, zoomLevel);

  if (isMenuVisible) {

  } else {
    showMenu();
  }
}
window.onMapLabelClick = onMapLabelClick;

function showMenu() {
  let menuElement = document.getElementById('contextualMenu');
  menuElement.classList.remove('hidden');
  isMenuVisible = true;
}
function hideMenu() {
  let menuElement = document.getElementById('contextualMenu');
  menuElement.classList.add('hidden');
  isMenuVisible = false;
}
window.hideMenu = hideMenu;

// Zoom levels

function setLabelsDomForZoomLevel(zoomLevel) {
  // change city names scale
  const cityNameScale = computeCityNameScale(zoomLevel);
  for (let city of CITIES) {
    let cityNameDom = document.getElementById(city.id);
    cityNameDom.style = `left: ${cityNameDom.style.left}; top: ${cityNameDom.style.top}; --scale: ${cityNameScale};`;
    cityNameDom.classList.toggle('hidden', zoomLevel > .5);
  }

  // change gym names scale
  const gymNameScale = computeGymNameScale(zoomLevel);
  for (let site of GYMS) {
    let gymNameDom = document.getElementById(site.id);
    gymNameDom.style = `left: ${gymNameDom.style.left}; top: ${gymNameDom.style.top}; --scale: ${gymNameScale};`;
    gymNameDom.classList.toggle('hidden', zoomLevel < .3);
  }

  // change major site names scale
  const majorSiteNameScale = computeMajorSiteNameScale(zoomLevel);
  for (let site of MAJOR_SITES) {
    let majorSiteNameDom = document.getElementById(site.id);
    majorSiteNameDom.style = `left: ${majorSiteNameDom.style.left}; top: ${majorSiteNameDom.style.top}; --scale: ${majorSiteNameScale};`;
    majorSiteNameDom.classList.toggle('hidden', zoomLevel < .3);
  }

  // change minor site names scale
  const minorSiteNameScale = computeMinorSiteNameScale(zoomLevel);
  for (let site of MINOR_SITES) {
    let minorSiteNameDom = document.getElementById(site.id);
    minorSiteNameDom.style = `left: ${minorSiteNameDom.style.left}; top: ${minorSiteNameDom.style.top}; --scale: ${minorSiteNameScale};`;
    minorSiteNameDom.classList.toggle('hidden', zoomLevel < .5);
  }

  // change road names scale
  const roadNameScale = computeRoadNameScale(zoomLevel);
  for (let road of ROADS) {
    let roadNameDom = document.getElementById(road.id);
    roadNameDom.style = `left: ${roadNameDom.style.left}; top: ${roadNameDom.style.top}; --scale: ${roadNameScale};`;
    roadNameDom.classList.toggle('hidden', zoomLevel > .5);
  }
}

function handleZoomChange(event) {
  // event.detail.scale contient le scale
  const currentZoom = event.detail.scale.toFixed(3);
  console.log('zoom:', currentZoom);
  setLabelsDomForZoomLevel(currentZoom);
}