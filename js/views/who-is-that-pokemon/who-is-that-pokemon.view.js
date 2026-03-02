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

let POKEMON_POOL_2 = [];

// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

export function render() {
  let user = getUser();
  // Set HEADER layout
  if (isPhone || isTablet) {
    HEADER_TITLE.innerHTML = 'Qui est ce Pokémon ?';
  }
  if (isLaptopOrUp) {
    HEADER_TITLE.innerHTML = APP_NAME;
  }

  // Set MAIN layout
  MAIN.innerHTML = `
    <div id="gifContainer" class="gif-container">
    </div>
    <div id="pageContainer" class="page-container">
      <button id="playGameButton" class="lzr-button lzr-solid" onclick="onPlayMiniGameClick()" style="width: 100%;">Jouer</button>
    </div>
  `;

  // Set FOOTER layout
  FOOTER.innerHTML = ``;

  updateMenuDom('who-is-that-pokemon');
  
}

function onPlayMiniGameClick() {
  if (POKEMON_POOL_2.length == 0) {
    POKEMON_POOL_2 = [...POKEMONS_LIST];
  }
  let rndPokemon = POKEMON_POOL_2[getRandomIntegerBetween(0, POKEMON_POOL_2.length - 1)];
  document.getElementById('gifContainer').innerHTML = `
    <img class="background-gif" src="${APP_ORIGIN}assets/medias/images/wtp.gif" />
    <img id="artworkBg" class="artwork background mini" src="${APP_ORIGIN}assets/medias/images/artworks/${rndPokemon.id}.png" style="--bg-url: '${APP_ORIGIN}assets/medias/images/artworks/${rndPokemon.id}.png'" />
    <img id="artwork" class="artwork mini" src="${APP_ORIGIN}assets/medias/images/artworks/${rndPokemon.id}.png" style="--bg-url: '${APP_ORIGIN}assets/medias/images/artworks/${rndPokemon.id}.png'" />
    <img id="artworkFg" class="artwork foreground mini visible" src="${APP_ORIGIN}assets/medias/images/artworks/${rndPokemon.id}.png" style="--bg-url: '${APP_ORIGIN}assets/medias/images/artworks/${rndPokemon.id}.png'" />
    <img id="foreground" class="foreground-png hidden" src="${APP_ORIGIN}assets/medias/images/wtp.png" />
  `;

  document.getElementById('pageContainer').innerHTML = '';

  setTimeout(() => {
    document.getElementById('artworkBg').classList.remove('mini');
    document.getElementById('artwork').classList.remove('mini');
    document.getElementById('artworkFg').classList.remove('mini');
  }, 950);

  setTimeout(() => {
    document.getElementById('foreground').classList.remove('hidden');
  }, 1000);

  setTimeout(() => {
    document.getElementById('artworkFg').classList.remove('visible');
  }, 3700);

  setTimeout(() => {
    document.getElementById('pageContainer').innerHTML = `<div class="pokemon-name">#${rndPokemon.id}<br>${rndPokemon.name}</div>`;
  }, 3900);

  setTimeout(() => {
    document.getElementById('gifContainer').innerHTML ='';
    document.getElementById('pageContainer').innerHTML = `
      <button id="playGameButton" class="lzr-button lzr-solid" onclick="onPlayMiniGameClick()" style="width: 100%;">Jouer</button>
    `;
  }, 7000);

  POKEMON_POOL_2.splice(POKEMON_POOL_2.indexOf(rndPokemon), 1);
  console.log(`Pokémon restants: ${POKEMON_POOL_2.length}`);
}
window.onPlayMiniGameClick = onPlayMiniGameClick;