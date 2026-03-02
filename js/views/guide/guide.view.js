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

// VARIABLES //////////////////////////////////////////////////////////////////////////////////////
const HEADER_ICON_CONTAINER = document.getElementById('headerIconContainer');
const HEADER_TITLE = document.getElementById('headerTitle');
const MAIN = document.getElementById('main');
const FOOTER = document.getElementById('footer');

let CURRENTLY_SELECTED_BLUE_TEAM = 'A';

const GYMS = [
  {
    town: 'Arène d\'Argenta',
    badge: 'Roche',
    champion: {
      name: 'Pierre',
      genre: 'M',
      type: TYPES.ROC,
      team: [
        // Racaillou
        {
          pokemon: POKEMONS_LIST[73],
          lvl: 12,
          moveset: [
            "Charge",
            "Boul'Armure",
            "-",
            "-"
          ]
        },
        // Onyx
        {
          pokemon: POKEMONS_LIST[94],
          lvl: 14,
          moveset: [
            "Charge",
            "Grincement",
            "Patience",
            "-"
          ]
        },
      ],
    },
  },

  {
    town: 'Arène d\'Azuria',
    badge: 'Cascade',
    champion: {
      name: 'Ondine',
      genre: 'F',
      type: TYPES.EAU,
      team: [
        // Stari
        {
          pokemon: POKEMONS_LIST[119],
          lvl: 18,
          moveset: [
            "Charge",
            "Pistolet à O",
            "-",
            "-"
          ]
        },
        // Staross
        {
          pokemon: POKEMONS_LIST[120],
          lvl: 21,
          moveset: [
            "Charge",
            "Pistolet à O",
            "Bulles d'O",
            "-"
          ]
        },
      ],
    },
  },

  {
    town: 'Arène de Carmin sur Mer',
    badge: 'Foudre',
    champion: {
      name: 'Major Bob',
      genre: 'M',
      type: TYPES.ELE,
      team: [
        // Voltorbe
        {
          pokemon: POKEMONS_LIST[99],
          lvl: 21,
          moveset: [
            "Sonicboom",
            "Charge",
            "Grincement",
            "-"
          ]
        },
        // Pikachu
        {
          pokemon: POKEMONS_LIST[24],
          lvl: 18,
          moveset: [
            "Cage-Éclair",
            "Éclair",
            "Rugissement",
            "Vive-Attaque"
          ]
        },
        // Raichu
        {
          pokemon: POKEMONS_LIST[25],
          lvl: 24,
          moveset: [
            "Cage-Éclair",
            "Éclair",
            "Rugissement",
            "Tonnerre"
          ]
        },
      ],
    },
  },

  {
    town: 'Arène de Céladopole',
    badge: 'Prisme',
    champion: {
      name: 'Erika',
      genre: 'F',
      type: TYPES.PLA,
      team: [
        // Empiflor
        {
          pokemon: POKEMONS_LIST[70],
          lvl: 29,
          moveset: [
            "Tranch'Herbe",
            "Ligotage",
            "Poudre Toxik",
            "Poudre Dodo",
          ]
        },
        // Saquedeneu
        {
          pokemon: POKEMONS_LIST[113],
          lvl: 24,
          moveset: [
            "Constriction",
            "Étreinte",
            "-",
            "-",
          ]
        },
        // Raflesia
        {
          pokemon: POKEMONS_LIST[44],
          lvl: 29,
          moveset: [
            "Danse-Fleur",
            "Méga-Sangsue",
            "Poudre Toxik",
            "Poudre Dodo",
          ]
        },
      ],
    },
  },

  {
    town: 'Arène de Parmanie',
    badge: 'Âme',
    champion: {
      name: 'Koga',
      genre: 'M',
      type: TYPES.PSN,
      team: [
        // Smogo
        {
          pokemon: POKEMONS_LIST[108],
          lvl: 37,
          moveset: [
            "Charge",
            "Purédpois",
            "Détritus",
            "Brouillard",
          ]
        },
        // Smogo
        {
          pokemon: POKEMONS_LIST[108],
          lvl: 37,
          moveset: [
            "Charge",
            "Purédpois",
            "Détritus",
            "Brouillard",
          ]
        },
        // Grotadmorv
        {
          pokemon: POKEMONS_LIST[88],
          lvl: 39,
          moveset: [
            "Entrave",
            "Gaz Toxik",
            "Lilliput",
            "Détritus",
          ]
        },
        // Smogogo
        {
          pokemon: POKEMONS_LIST[109],
          lvl: 43,
          moveset: [
            "Toxic",
            "Purédpois",
            "Détritus",
            "Destruction",
          ]
        },
      ],
    },
  },

  {
    town: 'Arène de Safrania',
    badge: 'Marais',
    champion: {
      name: 'Morgane',
      genre: 'F',
      type: TYPES.PSY,
      team: [
        // Kadabra
        {
          pokemon: POKEMONS_LIST[63],
          lvl: 38,
          moveset: [
            "Entrave",
            "Rafale Psy",
            "Soin",
            "Psyko"
          ]
        },
        // M. Mime
        {
          pokemon: POKEMONS_LIST[121],
          lvl: 37,
          moveset: [
            "Choc Mental",
            "Bouclier",
            "Mur Lumière",
            "Torgnoles"
          ]
        },
        // Aéromite
        {
          pokemon: POKEMONS_LIST[48],
          lvl: 38,
          moveset: [
            "Poudre Toxik",
            "Vampirisme",
            "Para-Spore",
            "Rafale Psy"
          ]
        },
        // Alakazam
        {
          pokemon: POKEMONS_LIST[64],
          lvl: 43,
          moveset: [
            "Vague Psy",
            "Soin",
            "Psyko",
            "Protection"
          ]
        },
      ],
    },
  },

  {
    town: 'Arène de Cramois\'Île',
    badge: 'Volcan',
    champion: {
      name: 'Auguste',
      genre: 'M',
      type: TYPES.FEU,
      team: [
        // Caninos
        {
          pokemon: POKEMONS_LIST[57],
          lvl: 42,
          moveset: [
            "Flammèche",
            "Groz'Yeux",
            "Bélier",
            "Hâte"
          ]
        },
        // Ponyta
        {
          pokemon: POKEMONS_LIST[76],
          lvl: 40,
          moveset: [
            "Mimi-Queue",
            "Ecrasement",
            "Rugissement",
            "Danseflamme"
          ]
        },
        // Galopa
        {
          pokemon: POKEMONS_LIST[77],
          lvl: 42,
          moveset: [
            "Mimi-Queue",
            "Ecrasement",
            "Rugissement",
            "Danseflamme"
          ]
        },
        // Arcanin
        {
          pokemon: POKEMONS_LIST[58],
          lvl: 47,
          moveset: [
            "Flammèche",
            "Hurelement",
            "Bélier",
            "Déflagration"
          ]
        },
      ],
    },
  },

  {
    town: 'Arène de Jadielle',
    badge: 'Terre',
    champion: {
      name: 'Giovanni',
      genre: 'M',
      type: TYPES.SOL,
      team: [
        // Onyx
        {
          pokemon: POKEMONS_LIST[94],
          lvl: 25,
          moveset: [
            "Jet-Pierres",
            "Étreinte",
            "Frénésie",
            "Grincement"
          ]
        },
        // Rhinocorne
        {
          pokemon: POKEMONS_LIST[110],
          lvl: 24,
          moveset: [
            "Koud'Korne",
            "-",
            "-",
            "-"
          ]
        },
        // Kangourex
        {
          pokemon: POKEMONS_LIST[114],
          lvl: 29,
          moveset: [
            "Poing Comète",
            "Frénésie",
            "Morsure",
            "-"
          ]
        },
      ],
    },
  },
];

const ELITE_FOUR = [
  {
    name: 'Olga',
    genre: 'F',
    type: TYPES.GLA,
    team: [
      // Lamantine
      {
        pokemon: POKEMONS_LIST[86],
        lvl: 54,
        moveset: [
          "Rugissement",
          "Onde Boréale",
          "Repos",
          "Bélier"
        ]
      },
      // Crustabri
      {
        pokemon: POKEMONS_LIST[90],
        lvl: 53,
        moveset: [
          "Ultrason",
          "Claquoir",
          "Onde Boréale",
          "Picanon"
        ]
      },
      // Flagadoss
      {
        pokemon: POKEMONS_LIST[79],
        lvl: 54,
        moveset: [
          "Pistolet à O",
          "Rugissement",
          "Repli",
          "Amnésie"
        ]
      },
      // Lippoutou
      {
        pokemon: POKEMONS_LIST[123],
        lvl: 56,
        moveset: [
          "Torgnoles",
          "Poinglace",
          "Plaquage",
          "Mania"
        ]
      },
      // Lokhlass
      {
        pokemon: POKEMONS_LIST[130],
        lvl: 56,
        moveset: [
          "Plaquage",
          "Onde Folie",
          "Hyfrocanon",
          "Blizzard"
        ]
      },
    ],
  },

  {
    name: 'Aldo',
    genre: 'M',
    type: TYPES.COM,
    team: [
      // Onyx
      {
        pokemon: POKEMONS_LIST[94],
        lvl: 53,
        moveset: [
          "Jet-Pierres",
          "Frénésie",
          "Armure",
          "Souplesse"
        ]
      },
      // Tygnon
      {
        pokemon: POKEMONS_LIST[106],
        lvl: 55,
        moveset: [
          "Poinglace",
          "Poing de Feu",
          "Poing-Éclair",
          "Riposte"
        ]
      },
      // Kicklee
      {
        pokemon: POKEMONS_LIST[105],
        lvl: 55,
        moveset: [
          "Pied Sauté",
          "Pied Voltige",
          "Ultimawashi",
          "Puissance"
        ]
      },
      // Onyx
      {
        pokemon: POKEMONS_LIST[94],
        lvl: 56,
        moveset: [
          "Jet-Pierres",
          "Frénésie",
          "Armure",
          "Souplesse"
        ]
      },
      // Mackogneur
      {
        pokemon: POKEMONS_LIST[67],
        lvl: 58,
        moveset: [
          "Groz'Yeux",
          "OPuissance",
          "Abîme",
          "Sacrifice"
        ]
      },
    ],
  },

  {
    name: 'Agatha',
    genre: 'F',
    type: TYPES.SPE,
    team: [
      // Ectoplasma
      {
        pokemon: POKEMONS_LIST[93],
        lvl: 56,
        moveset: [
          "Onde Folie",
          "Ténèbres",
          "Hypnose",
          "Dévorêve"
        ]
      },
      // Nosferalto
      {
        pokemon: POKEMONS_LIST[41],
        lvl: 56,
        moveset: [
          "Ultrason",
          "Onde Folie",
          "Cru-Aile",
          "Buée Noire"
        ]
      },
      // Spectrum
      {
        pokemon: POKEMONS_LIST[92],
        lvl: 55,
        moveset: [
          "Onde Folie",
          "Ténèbres",
          "Hypnose",
          "Dévorêve"
        ]
      },
      // Arbok
      {
        pokemon: POKEMONS_LIST[23],
        lvl: 58,
        moveset: [
          "Morsure",
          "Intimidation",
          "Grincement",
          "Acide"
        ]
      },
      // Ectoplasma
      {
        pokemon: POKEMONS_LIST[93],
        lvl: 60,
        moveset: [
          "Onde Folie",
          "Ténèbres",
          "Toxik",
          "Dévorêve"
        ]
      },
    ],
  },

  {
    name: 'Peter',
    genre: 'M',
    type: TYPES.DRA,
    team: [
      // Léviathor
      {
        pokemon: POKEMONS_LIST[129],
        lvl: 58,
        moveset: [
          "Hydrocanon",
          "Groz'Yeux",
          "Draco-Rage",
          "Ultralaser"
        ]
      },
      // Draco
      {
        pokemon: POKEMONS_LIST[147],
        lvl: 56,
        moveset: [
          "Hâte",
          "Souplesse",
          "Draco-Rage",
          "Ultralaser"
        ]
      },
      // Draco
      {
        pokemon: POKEMONS_LIST[147],
        lvl: 56,
        moveset: [
          "Hâte",
          "Souplesse",
          "Draco-Rage",
          "Ultralaser"
        ]
      },
      // Ptéra
      {
        pokemon: POKEMONS_LIST[141],
        lvl: 60,
        moveset: [
          "Ultrason",
          "Bélier",
          "Morsure",
          "Ultralaser"
        ]
      },
      // Dracolosse
      {
        pokemon: POKEMONS_LIST[148],
        lvl: 62,
        moveset: [
          "Hâte",
          "Souplesse",
          "Bouclier",
          "Ultralaser"
        ]
      },
    ],
  },

];

// https://www.pokepedia.fr/Blue/%C3%89quipes_dans_Pok%C3%A9mon_Rouge_et_Bleu
const BLUE_TEAM_A =  [
  // Roucarnage
  {
    pokemon: POKEMONS_LIST[17],
    lvl: 61,
    moveset: [
      "Cru-Aile",
      "Mimique",
      "Pique",
      "Cyclone"
    ]
  },
  // Alakazam
  {
    pokemon: POKEMONS_LIST[64],
    lvl: 59,
    moveset: [
      "Psyko",
      "Protection",
      "Rafale Psy",
      "Soin"
    ]
  },
  // Rhinoféros
  {
    pokemon: POKEMONS_LIST[111],
    lvl: 61,
    moveset: [
      "Groz'Yeux",
      "Empal'Korne",
      "Koud'Korne",
      "Mimi-Queue"
    ]
  },
  // Noadkoko
  {
    pokemon: POKEMONS_LIST[102],
    lvl: 61,
    moveset: [
      "Hypnose",
      "Pilonnage",
      "Écrasement",
      "-"
    ]
  },
  // Léviathor
  {
    pokemon: POKEMONS_LIST[129],
    lvl: 63,
    moveset: [
      "Hydrocanon",
      "Ultralaser",
      "Draco-Rage",
      "Groz'Yeux"
    ]
  },
  // Dracaufeu
  {
    pokemon: POKEMONS_LIST[5],
    lvl: 65,
    moveset: [
      "Déflagration",
      "Frénésie",
      "Danseflamme",
      "Tranche"
    ]
  },
];
const BLUE_TEAM_B =  [
  // Roucarnage
  {
    pokemon: POKEMONS_LIST[17],
    lvl: 61,
    moveset: [
      "Cru-Aile",
      "Mimique",
      "Pique",
      "Cyclone"
    ]
  },
  // Alakazam
  {
    pokemon: POKEMONS_LIST[64],
    lvl: 59,
    moveset: [
      "Psyko",
      "Protection",
      "Rafale Psy",
      "Soin"
    ]
  },
  // Rhinoféros
  {
    pokemon: POKEMONS_LIST[111],
    lvl: 61,
    moveset: [
      "Groz'Yeux",
      "Empal'Korne",
      "Koud'Korne",
      "Mimi-Queue"
    ]
  },
  // Noadkoko
  {
    pokemon: POKEMONS_LIST[102],
    lvl: 63,
    moveset: [
      "Hypnose",
      "Pilonnage",
      "Écrasement",
      "-"
    ]
  },
  // Arcanin
  {
    pokemon: POKEMONS_LIST[58],
    lvl: 61,
    moveset: [
      "Groz'Yeux",
      "Rugissement",
      "Flammèche",
      "Bélier"
    ]
  },
  // Tortank
  {
    pokemon: POKEMONS_LIST[8],
    lvl: 65,
    moveset: [
      "Repli",
      "Hydrocanon",
      "Blizzard",
      "Morsure"
    ]
  },
];
const BLUE_TEAM_C =  [
  // Roucarnage
  {
    pokemon: POKEMONS_LIST[17],
    lvl: 61,
    moveset: [
      "Cru-Aile",
      "Mimique",
      "Pique",
      "Cyclone"
    ]
  },
  // Alakazam
  {
    pokemon: POKEMONS_LIST[64],
    lvl: 59,
    moveset: [
      "Psyko",
      "Protection",
      "Rafale Psy",
      "Soin"
    ]
  },
  // Rhinoféros
  {
    pokemon: POKEMONS_LIST[111],
    lvl: 61,
    moveset: [
      "Groz'Yeux",
      "Empal'Korne",
      "Koud'Korne",
      "Mimi-Queue"
    ]
  },
  // Arcanin
  {
    pokemon: POKEMONS_LIST[58],
    lvl: 63,
    moveset: [
      "Groz'Yeux",
      "Rugissement",
      "Flammèche",
      "Bélier"
    ]
  },
  // Léviathor
  {
    pokemon: POKEMONS_LIST[129],
    lvl: 61,
    moveset: [
      "Hydrocanon",
      "Ultralaser",
      "Draco-Rage",
      "Groz'Yeux"
    ]
  },
  // Florizarre
  {
    pokemon: POKEMONS_LIST[2],
    lvl: 65,
    moveset: [
      "Tranch'Herbe",
      "Lance-Soleil",
      "Méga-Sangsue",
      "Croissance"
    ]
  },
];

// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

export function render() {
  let user = getUser();
  // Set HEADER layout
  if (isPhone || isTablet) {
    HEADER_TITLE.innerHTML = 'Guide de l\'aventure';
  }
  if (isLaptopOrUp) {
    HEADER_TITLE.innerHTML = APP_NAME;
  }

  // Set MAIN layout
  MAIN.innerHTML = `
    <div class="page-container guide-page">
      <div class="inner-body script-container">
        ${ isLaptopOrUp ? `<h1>Guide de l'aventure</h1>` : ''}

        <p style="margin-bottom: 8px;">
          Le principe du jeu est de parcourir la région de Kanto, en attrapant des Pokémon, 
          en les entraînant, en battant d'autres Dresseurs, pour avoir huit Badges et finalement battre la Ligue Pokémon.
        </p>

        <p>
          La <b>Ligue Indigo</b> est la Ligue Pokémon officielle de la région de Kanto.
        </p>
        <p>
          Celle-ci est constituée de:
        </p>
        <ul>
          <li>huit Arènes officielles (dont les membres et le Champion se spécialisent dans un type particulier)</li>
          <li>un Conseil des 4</li>
          <li>un Maître à sa tête</li>
        </ul>

        <h2>Obtention des 8 badges</h2>
        <p style="margin-bottom: 8px;">
          Les Champions d'Arène font partie des meilleurs Dresseurs de chaque région, et ont pour charge de décerner un Badge aux Dresseurs en mesure de les vaincre.
        </p>

        <div class="lzr-drawer">
          <div class="tile-header">
            <div>
              <h3 class="header-title"><img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Roche.png" /> Badge Roche</h3>
            </div>
            <div class="tile-caret">
              ${getSvgIcon('chevron-right', 'm', null)}
            </div>
            <input type="checkbox">
          </div>
          <div class="expandable-wrapper">
            <div class="expandable-inner">
              <div class="inner-body">
                <p style="margin-bottom: 16px;">
                  Pour obtenir le 1er badge, le badge Roche, le joueur devra obtenir son 1er Pokémon, 
                  puis quitter Bourg-Palette pour se rendre dans la ville d'Argenta en traversant la Forêt de Jade.
                </p>
                <p><span class="city">Bourg Palette</span> -> <span class="minor-site">Labo Pr. Chen</span> -> Starter</p>
                <hr>
                <p><span class="road">Route 1</span></p>
                <hr>
                <p><span class="city">Jadielle</span> -> Shop -> Colis de Chen</p>
                <hr>
                <p><span class="city">Bourg Palette</span> -> Pokédex & Carte</p>
                <hr>
                <p><span class="road">Route 2</span></p>
                <hr>
                <p><span class="major-site">Forêt de Jade</span></p>
                <hr>
                <p><span class="city">Argenta</span> -> <span class="gym">Arène -> Badge Roche<img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Roche.png" /></span></p>
                ${getGymDom(GYMS[0])}
              </div>
            </div>
          </div>
        </div>

        <div class="lzr-drawer">
          <div class="tile-header">
            <div>
              <h3 class="header-title"><img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Cascade.png" /> Badge Cascade</h3>
            </div>
            <div class="tile-caret">
              ${getSvgIcon('chevron-right', 'm', null)}
            </div>
            <input type="checkbox">
          </div>
          <div class="expandable-wrapper">
            <div class="expandable-inner">
              <div class="inner-body">
                <p style="margin-bottom: 16px;">
                  Pour obtenir le 2ème badge, le badge Cascade, le joueur devra se rendre dans la ville d'Azuria en traversant le Mont Sélénite.
                </p>
                <p><span class="major-site">Mont Sélénite</span></p>
                <hr>
                <p><span class="city">Azuria</span></p>
                <hr>
                <p><span class="road">Route 24</span> <b><i>LRT-F glitch</i></b> disponible</p>
                <hr>
                <p><span class="road">Route 25</span> -> <span class="minor-site">Maison de Léo</span> -> Passe Bateau</p>
                <hr>
                <p><span class="city">Azuria</span> -> <span class="gym">Arène -> Badge Cascade<img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Cascade.png" /></span></p>
                ${getGymDom(GYMS[1])}

              </div>
            </div>
          </div>
        </div>

        <div class="lzr-drawer">
          <div class="tile-header">
            <div>
              <h3 class="header-title"><img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Foudre.png" /> Badge Foudre</h3>
            </div>
            <div class="tile-caret">
              ${getSvgIcon('chevron-right', 'm', null)}
            </div>
            <input type="checkbox">
          </div>
          <div class="expandable-wrapper">
            <div class="expandable-inner">
              <div class="inner-body">
              <p style="margin-bottom: 16px;">
                Pour obtenir le 3ème badge, le badge Foudre, le joueur devra se rendre dans la ville de Carmin sur Mer, 
                et explorer l'Océane à la recherche d'une technique pour couper l'arbuste qui empêche l'accès à l'arène.
              </p>
              <p><span class="road">Route 5</span></p>
              <hr>
              <p><span class="minor-site">Souterrain Azuria - Carmin sur Mer</span></p>
              <hr>
              <p><span class="road">Route 6</span></p>
              <hr>
              <p><span class="city">Carmin sur Mer</span> -> <span class="minor-site">Fan Club Pokémon</span> -> Bon de Commande</p>
              <hr>
              <p><span class="city">Carmin sur Mer</span> -> <span class="major-site">Océane</span> -> CS01 (Coupe)</p>
              <hr>
              <p><span class="city">Carmin sur Mer</span> -> <span class="gym">Arène -> Badge Foudre<img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Foudre.png" /></span></p>
              ${getGymDom(GYMS[2])}
              </div>
            </div>
          </div>
        </div>

        <div class="lzr-drawer">
          <div class="tile-header">
            <div>
              <h3 class="header-title"><img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Prisme.png" /> Badge Prisme</h3>
            </div>
            <div class="tile-caret">
              ${getSvgIcon('chevron-right', 'm', null)}
            </div>
            <input type="checkbox">
          </div>
          <div class="expandable-wrapper">
            <div class="expandable-inner">
              <div class="inner-body">
              <p style="margin-bottom: 16px;">
                Pour obtenir le 4ème badge, le badge Prisme, le joueur devra se rendre dans la ville de Céladopole, 
                en passant par la sombre Grotte et la mystérieuse ville de Lavanville, tout en déjouant les plans de la Team Rocket.
              </p>
              <p><span class="major-site">Cave Taupiqueur</span></p>
              <hr>
              <p><span class="road">Route 2</span> -> Assistant de Chen (10 Pokémon capturés) -> CS05 (Flash)</p>
              <hr>
              <p><span class="city">Azuria</span> -> <span class="minor-site">Cycles à Gogo</span> -> Bicyclette</p>
              <hr>
              <p><span class="major-site">Grotte</span></p>
              <hr>
              <p><span class="city">Lavanville</span></p>
              <hr>
              <p><span class="road">Route 8</span></p>
              <hr>
              <p><span class="minor-site">Souterrain Célapodole - Lavanville</span></p>
              <hr>
              <p><span class="road">Route 7</span></p>
              <hr>
              <p><span class="city">Céladopole</span> -> <span class="minor-site">Centre commercial</span> -> Boisson</p>
              <hr>
              <p><span class="city">Céladopole</span> -> <span class="minor-site">Manoir Céladon</span> -> Évoli</p>
              <hr>
              <p><span class="city">Céladopole</span> -> <span class="major-site">Casino</span> -> Giovanni -> Scope Sylphe</p>
              <hr>
              <p><span class="city">Lavanville</span> -> <span class="major-site">Tour Pokémon</span> -> PokéFlute</p> <!-- pourrait être fait après l'arène en fait -->
              <hr>
              <p><span class="city">Céladopole</span> -> <span class="gym">Arène -> Badge Prisme<img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Prisme.png" /></span></p>
              ${getGymDom(GYMS[3])}
              </div>
            </div>
          </div>
        </div>

        <div class="lzr-drawer">
          <div class="tile-header">
            <div>
              <h3 class="header-title"><img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Âme.png" /> Badge Âme</h3>
            </div>
            <div class="tile-caret">
              ${getSvgIcon('chevron-right', 'm', null)}
            </div>
            <input type="checkbox">
          </div>
          <div class="expandable-wrapper">
            <div class="expandable-inner">
              <div class="inner-body">
              <p style="margin-bottom: 16px;">
                Pour obtenir le 5ème badge, le badge Âme, le joueur devra se rendre dans la ville de Parmanie et pourra profiter de son magnifique Parc Safari.
              </p>
              <p><span class="road">Route 16</span> -> CS02 (Vol)</p>
              <hr>
              <p><span class="road">Piste Cyclable</span></p>
              <hr>
              <p><span class="city">Parmanie</span> -> <span class="major-site">Parc Safari</span> -> Cabane Secrète -> CS03 (Surf)</p>
              <hr>
              <p><span class="city">Parmanie</span> -> <span class="major-site">Parc Safari</span> -> Dent d'Or</p>
              <hr>
              <p><span class="city">Parmanie</span> -> <span class="minor-site">Maison du Gardien</span> -> CS04 (Force)</p>
              <hr>
              <p><span class="city">Parmanie</span> -> <span class="gym">Arène -> Badge Âme<img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Âme.png" /></span></p>
              ${getGymDom(GYMS[4])}
              </div>
            </div>
          </div>
        </div>

        <div class="lzr-drawer">
          <div class="tile-header">
            <div>
              <h3 class="header-title"><img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Marais.png" /> Badge Marais</h3>
            </div>
            <div class="tile-caret">
              ${getSvgIcon('chevron-right', 'm', null)}
            </div>
            <input type="checkbox">
          </div>
          <div class="expandable-wrapper">
            <div class="expandable-inner">
              <div class="inner-body">
              <p style="margin-bottom: 16px;">
                Pour obtenir le 6ème badge, le badge Marais, le joueur devra se rendre dans la ville de Safrania et se confronter de nouveau à la maléfique Team Rocket.
              </p>
              <p><span class="city">Safrania</span> -> <span class="minor-site">Dojo</span></p>
              <hr>
              <p><span class="city">Safrania</span> -> <span class="major-site">Sylphe SARL</span> -> Carte Magn. -> Giovanni -> Master Ball</p>
              <hr>
              <p><span class="city">Safrania</span> -> <span class="gym">Arène -> Badge Marais<img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Marais.png" /></span></p>
              ${getGymDom(GYMS[5])} 
              </div>
            </div>
          </div>
        </div>

        <div class="lzr-drawer">
          <div class="tile-header">
            <div>
              <h3 class="header-title"><img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Volcan.png" /> Badge Volcan</h3>
            </div>
            <div class="tile-caret">
              ${getSvgIcon('chevron-right', 'm', null)}
            </div>
            <input type="checkbox">
          </div>
          <div class="expandable-wrapper">
            <div class="expandable-inner">
              <div class="inner-body">
              <p style="margin-bottom: 16px;">
                Pour obtenir le 7ème badge, le badge Volcan, le joueur devra se rendre sur l'île de Cramois'Île en passant par les Îles Écume.
              </p>
              <p><span class="major-site">Centrale</span> (Optionnel) -> Électhor</p>
              <hr>
              <p><span class="major-site">Îles Écume</span> -> Artikodin</p>
              <hr>
              <p><span class="city">Cramois'Île</span> -> <span class="major-site">Manoir Pokémon</span> -> Clé Secrète</p>
              <hr>
              <p><span class="city">Cramois'Île</span> -> <span class="gym">Arène -> Badge Volcan<img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Volcan.png" /></span></p>
              ${getGymDom(GYMS[6])}
              </div>
            </div>
          </div>
        </div>

        <div class="lzr-drawer">
          <div class="tile-header">
            <div>
              <h3 class="header-title"><img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Terre.png" /> Badge Terre</h3>
            </div>
            <div class="tile-caret">
              ${getSvgIcon('chevron-right', 'm', null)}
            </div>
            <input type="checkbox">
          </div>
          <div class="expandable-wrapper">
            <div class="expandable-inner">
              <div class="inner-body">
              <p style="margin-bottom: 16px;">
                Pour obtenir le 8ème et dernier badge, le badge Terre, le joueur devra retourner dans la ville de Jadielle.
              </p>
              <p><span class="city">Jadielle</span> -> <span class="gym">Arène -> Badge Terre<img src="${APP_ORIGIN}assets/medias/images/sprites/badges/Terre.png" /></span></p>
              ${getGymDom(GYMS[7])}
              </div>
            </div>
          </div>
        </div>

        <h2>Plateau Indigo</h2>
        <p style="margin-bottom: 16px;">
          Une fois les huit Badges obtenus, le joueur victorieux peut se rendre au Plateau Indigo pour défier le Conseil des 4 de la Ligue, et le Maître à sa tête. 
          Mais il devra d'abord triompher de la célèbre Route Victoire.
        </p>

        <p><span class="road">Route 22</span></p>
        <hr>
        <p><span class="road">Route 23</span> -> Contrôle des Badges</p>
        <hr>
        <p><span class="major-site">Route Victoire</span> -> Sulfura</p>
        <hr>
        <p><span class="city">Plateau Indigo</span></p>
        
        <div class="lzr-drawer">
          <div class="tile-header">
            <div>
              <h3 class="header-title">Conseil des 4</h3>
            </div>
            <div class="tile-caret">
              ${getSvgIcon('chevron-right', 'm', null)}
            </div>
            <input type="checkbox">
          </div>
          <div class="expandable-wrapper">
            <div class="expandable-inner">
              <div class="inner-body">
                <div class="gyms-container">
                  ${getEliteFourDom()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr>
        <p><span class="gold">Maître de la Ligue</span></p>
        <div class="lzr-drawer">
          <div class="tile-header">
            <div>
              <h3 class="header-title">Maître de la Ligue</h3>
            </div>
            <div class="tile-caret">
              ${getSvgIcon('chevron-right', 'm', null)}
            </div>
            <input type="checkbox">
          </div>
          <div class="expandable-wrapper">
            <div class="expandable-inner">
              <div class="inner-body">
                <div class="gym-champion-container">
                  <div class="champion-identity">
                    <div class="left-area">
                      <span>Maître</span>
                      <img src="${APP_ORIGIN}assets/medias/images/sprites/blue_RB.png" />
                      <span>Blue</span>
                    </div>
                    <div class="right-area">
                      <span>Spécialité</span>
                      <span>Inconnue</span>
                    </div>
                  </div>
                  
                  <div class="lzr-drawer lzr-outlined">
                    <div class="tile-header">
                      <div>
                        <span class="header-title">Équipe</span>
                      </div>
                      <div class="tile-caret">
                        ${getSvgIcon('chevron-right', 'm', null)}
                      </div>
                      <input type="checkbox">
                    </div>
                    <div class="expandable-wrapper">
                      <div class="expandable-inner">
                        <div class="inner-body">
                          <p>
                            L'équipe de Blue dépend du starter choisi par le joueur au début de l'aventure.
                          </p>
                          <div class="starter-choice">
                            <button id="starterA" onclick="onStarterClick('A')"><img src="${APP_ORIGIN}assets/medias/images/sprites/${user.PREFERED_SPRITES} - front/0001.png" /></button>
                            <button id="starterB" onclick="onStarterClick('B')"><img src="${APP_ORIGIN}assets/medias/images/sprites/${user.PREFERED_SPRITES} - front/0004.png" /></button>
                            <button id="starterC" onclick="onStarterClick('C')"><img src="${APP_ORIGIN}assets/medias/images/sprites/${user.PREFERED_SPRITES} - front/0007.png" /></button>
                          </div>
                          <div id="blueTeam" class="champion-pokemons"> </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2>Capture de Mewtwo</h2>
        <p style="margin-bottom: 16px;">
          Une fois la ligue Pokémon vaincue, il reste une chose à faire, qu'il était impossible d'accomplir avant: <b>Capturer Mewtwo</b>.
        </p>
        <p><span class="city">Azuria</span></p>
        <hr>
        <p><span class="major-site">Caverne Azurée</span> -> Mewtwo</p>
      </div>

    </div>
  `;

  // Set FOOTER layout
  FOOTER.innerHTML = ``;

  updateMenuDom('guide');

  playMusic('road-24-welcome');
  
}

function onStarterClick(starterId) {
  CURRENTLY_SELECTED_BLUE_TEAM = starterId;
  const buttonA = document.getElementById('starterA');
  const buttonB = document.getElementById('starterB');
  const buttonC = document.getElementById('starterC');
  switch (CURRENTLY_SELECTED_BLUE_TEAM) {
    case 'A':
      buttonA.classList.add('selected');
      buttonB.classList.remove('selected');
      buttonC.classList.remove('selected');
      break;
    case 'B':
      buttonA.classList.remove('selected');
      buttonB.classList.add('selected');
      buttonC.classList.remove('selected');
      break;
    case 'C':
      buttonA.classList.remove('selected');
      buttonB.classList.remove('selected');
      buttonC.classList.add('selected');
      break;
    default:
      break;
  }
  setBlueTeam();
}
window.onStarterClick = onStarterClick;

function getGymChampionPokemonDom(gymChampionPokemon) {
  let user = getUser();
  let movesetStr = '';
  for (let atk of gymChampionPokemon.moveset) { movesetStr += `<li>${atk}</li>` }
  return `
    <div class="gym-champion-pokemon-container">
      
      <div class="pokemon-line">
        <div class="sprite-container">
          <img src="${APP_ORIGIN}assets/medias/images/sprites/${user.PREFERED_SPRITES} - front/0${gymChampionPokemon.pokemon.id}.png" />
        </div>
        <span class="name-container">${gymChampionPokemon.pokemon.name}</span>
        <div class="types-container">
          <div class="type-badge" style="--color: var(--TYPE-${gymChampionPokemon.pokemon.type1});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${gymChampionPokemon.pokemon.type1}.svg" style="/* filter: ${getFilterStringForHexValue(getCssRootVariableValue(`--TYPE-${gymChampionPokemon.pokemon.type1}`))}; */" />
          </div>
          ${
            gymChampionPokemon.pokemon.type2 !== null
            ? `<div class="type-badge" style="--color: var(--TYPE-${gymChampionPokemon.pokemon.type2});">
                <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${gymChampionPokemon.pokemon.type2}.svg" style="/* filter: ${getFilterStringForHexValue(getCssRootVariableValue(`--TYPE-${gymChampionPokemon.pokemon.type2}`))}; */" />
              </div>`
            : `<div class="type-badge" style="--color: var(--TYPE-${gymChampionPokemon.pokemon.type1}); opacity: 0;">
                <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${gymChampionPokemon.pokemon.type1}.svg" style="/* filter: ${getFilterStringForHexValue(getCssRootVariableValue(`--TYPE-${gymChampionPokemon.pokemon.type1}`))}; */" />
              </div>`
          }
        </div>
      </div>
      <b>Niveau ${gymChampionPokemon.lvl}</b>
      <ul>
          ${movesetStr}
      </ul>
    </div>
  `;
}

function getGymChampionDom(gymChampion) {
  let prep = 'de ';
  if (gymChampion.name == 'Ondine' || gymChampion.name == 'Erika' || gymChampion.name == 'Auguste' || gymChampion.name == 'Olga' || gymChampion.name == 'Aldo' || gymChampion.name == 'Agatha') {
    prep = 'd\'';
  } else if (gymChampion.name == 'Major Bob') {
    prep = 'du ';
  }
  let str = `
  <div class="gym-champion-container">
    <div class="champion-identity">
      <div class="left-area">
        ${gymChampion.team.length > 4 ? `<span>Membre</span>` : `<span>Champion${gymChampion.genre == 'F' ? 'ne' : ''}</span>`}
        <img src="${APP_ORIGIN}assets/medias/images/sprites/${gymChampion.name.toLowerCase()}_RB.png" />
        <span>${gymChampion.name}</span>
      </div>
      <div class="right-area">
        <span>Spécialité</span>
         <div class="type-badge" style="--color: var(--TYPE-${gymChampion.type});">
          <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${gymChampion.type}.svg" style="/* filter: ${getFilterStringForHexValue(getCssRootVariableValue(`--TYPE-${gymChampion.type}`))}; */" />
        </div>
        <span>${gymChampion.type}</span>        
      </div>
      
    </div>
    
    <div class="lzr-drawer lzr-outlined">
      <div class="tile-header">
        <div>
          <span class="header-title">Équipe ${prep}${gymChampion.name}</span>
        </div>
        <div class="tile-caret">
          ${getSvgIcon('chevron-right', 'm', null)}
        </div>
        <input type="checkbox">
      </div>
      <div class="expandable-wrapper">
        <div class="expandable-inner">
          <div class="inner-body">
            <div class="champion-pokemons">
            
  `;
  for (let pokemon of gymChampion.team) {
    str += getGymChampionPokemonDom(pokemon);
  }
  str += `
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  `;
  return str;
}

function getGymDom(gym) {
  return `
    <div class="lzr-drawer">
      <div class="tile-header">
        <div>
          <h4 class="header-title">${gym.town}</h4>
        </div>
        <div class="tile-caret">
          ${getSvgIcon('chevron-right', 'm', null)}
        </div>
        <input type="checkbox">
      </div>
      <div class="expandable-wrapper">
        <div class="expandable-inner">
          <div class="inner-body">
            <div class="gym-container">
              <div class="top-area">
                <span>Badge ${gym.badge}</span>
                <img src="${APP_ORIGIN}assets/medias/images/sprites/badges/${gym.badge}.png" />
              </div>
              ${getGymChampionDom(gym.champion)}
            </div>
          </div>
        </div>
      </div>
    </div>
    
  `;
}

function getGymsDom() {
  let str = ``;
  for (let gym of GYMS) {
    str +=  getGymDom(gym);
  }
  return str;
}

function getEliteDom(elite) {
  return `
    <div class="lzr-drawer">
      <div class="tile-header">
        <div>
          <h4 class="header-title">${elite.name == 'Olga' ? 'Première' : elite.name == 'Aldo' ? 'Deuxième' : elite.name == 'Agatha' ? 'Troisième' : elite.name == 'Peter' ? 'Quatrième' : ''} Salle</h4>
        </div>
        <div class="tile-caret">
          ${getSvgIcon('chevron-right', 'm', null)}
        </div>
        <input type="checkbox">
      </div>
      <div class="expandable-wrapper">
        <div class="expandable-inner">
          <div class="inner-body">
            <div class="gym-container">
              ${getGymChampionDom(elite)}
            </div>
          </div>
        </div>
      </div>
    </div>
    
  `;
}

function getEliteFourDom() {
  let str = ``;
  for (let elite of ELITE_FOUR) {
    str += getEliteDom(elite);
  }
  return str;
}

function setBlueTeam() {
  let blueTeamContainer = document.getElementById('blueTeam');
  let currentTeam = CURRENTLY_SELECTED_BLUE_TEAM == 'A' ? BLUE_TEAM_A : CURRENTLY_SELECTED_BLUE_TEAM == 'B' ? BLUE_TEAM_B : BLUE_TEAM_C;
  let str = '';
  for (let pokemon of currentTeam) {
    str += getGymChampionPokemonDom(pokemon);
  }
  blueTeamContainer.innerHTML = str;
}