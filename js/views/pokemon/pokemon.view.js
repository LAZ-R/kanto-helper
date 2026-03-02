import { APP_NAME, APP_VERSION } from "../../../app-properties.js";
import { POKEMONS_LIST, TYPES } from "../../data/pokemons.data.js";
import { ICONS } from "../../data/svgIcons.data.js";
import { APP_BASE_PATH, APP_ORIGIN, toExternalPath } from "../../router.js";
import { getSvgIcon } from "../../services/icons.service.js";
import { updateMenuDom } from "../../services/menu.service.js";
import { onOpenSpritesClick, onOpenStatsClick } from "../../services/settings-service.js";
import { getUser } from "../../services/storage.service.js";
import { showToast } from "../../services/toast.service.js";
import { isLaptopOrUp, isPhone, isTablet } from "../../utils/breakpoints.js";
import { getFilterStringForHexValue } from "../../utils/factory/filter.js";
import { getCssRootVariableValue } from "../../utils/UTILS.js";

// VARIABLES //////////////////////////////////////////////////////////////////////////////////////
const HEADER_TITLE = document.getElementById('headerTitle');
const MAIN = document.getElementById('main');
const FOOTER = document.getElementById('footer');
let cry = null;

// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

export function render() {
  let pokemonId = new URLSearchParams(window.location.search).get('id');
  let pokemon = null;
  let foundPokemon = POKEMONS_LIST.find((pokemon => pokemon.id === pokemonId));
  if (pokemonId == null || foundPokemon == undefined) {
    pokemon = {
      id          : `000`,
      name        : `MissingNo.`,
      type1       : TYPES.NOR,
      type2       : null,
      description : `Commentaire en cours de rédaction.`,
      pv          :  33,  
      attack      :  136,  
      defense     :  0,  
      speed       :  29,  
      special     :  6
    };
  } else {
    pokemon = foundPokemon;
  }
  let pokemonStatsAverage = ((pokemon.pv + pokemon.attack + pokemon.defense + pokemon.speed + pokemon.special) / 5).toFixed(0);
  cry = new Audio(`${APP_ORIGIN}assets/medias/audio/cries/${pokemon.id}.ogg`);
  let user = getUser();

  // Set HEADER layout
  if (isPhone || isTablet) {
    HEADER_TITLE.innerHTML = `#${pokemon.id}`;
  }
  if (isLaptopOrUp) {
    HEADER_TITLE.innerHTML = APP_NAME;
  }

  // Set MAIN layout
  MAIN.innerHTML = `
    <!-- ${ isLaptopOrUp ? `<h1>#${pokemon.id} - ${pokemon.name}</h1>` : '' } -->
    
    <div class="artwork-container">
      <button onclick="playPokemonCry()" class="artwork" style="--url: url('${APP_ORIGIN}assets/medias/images/artworks/${pokemon.id}.png')"></button>
    </div>

    <div class="page-container">
      <nav class="nav-container" style="margin-bottom: 8px;">
        ${pokemon.id === '001' ? '<span></span>' : `<a href="${toExternalPath(`/pokedex/pokemon?id=${prevId(pokemon.id)}`)}" class="lzr-button">${getSvgIcon('chevron-left', 'm')}</a>`}
        <span class="pokemon-id">${pokemon.name}</span>
        ${pokemon.id === '151' ? '<span></span>' : `<a href="${toExternalPath(`/pokedex/pokemon?id=${nextId(pokemon.id)}`)}" class="lzr-button">${getSvgIcon('chevron-right', 'm')}</a>`}
      </nav>

      <div class="types-container" style="margin-bottom: 16px;">
        <div class="type-block">
          <div class="type-badge" style="--color: var(--TYPE-${pokemon.type1});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${pokemon.type1}.svg" style="/* filter: ${getFilterStringForHexValue(getCssRootVariableValue(`--TYPE-${pokemon.type1}`))}; */" />
          </div>
          <span>${pokemon.type1}</span>
        </div>
        ${
          pokemon.type2 !== null
          ? `
          <div class="type-block">
            <div class="type-badge" style="--color: var(--TYPE-${pokemon.type2});">
              <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${pokemon.type2}.svg" style="/* filter: ${getFilterStringForHexValue(getCssRootVariableValue(`--TYPE-${pokemon.type2}`))}; */" />
            </div>
            <span>${pokemon.type2}</span>
          </div>
          ` : ''
        }
      </div>

      <p class="pokemon-description" style="margin-bottom: 16px;">${pokemon.description}</p>

      <div class="lzr-drawer" style="margin-bottom: 16px;">
        <div class="tile-header">
          <div>
            <span class="header-title">Statistiques</span>
          </div>
          <div class="tile-caret">
            ${getSvgIcon('chevron-right', 'm', null)}
          </div>
          <input type="checkbox" onclick="onOpenStatsClick(event)" ${user.OPENED_STATS ? 'checked' : ''}>
        </div>
        <div class="expandable-wrapper">
          <div class="expandable-inner">
            <div class="inner-body">
              <div class="stats-container" style="margin-bottom: 16px;">
                <div class="stat-pack"><span>PV</span><span>${pokemon.pv}</span></div>
                <div class="stat-pack"><span>ATK</span><span>${pokemon.attack}</span></div>
                <div class="stat-pack"><span>DEF</span><span>${pokemon.defense}</span></div>
                <div class="stat-pack"><span>VIT</span><span>${pokemon.speed}</span></div>
                <div class="stat-pack"><span>SPE</span><span>${pokemon.special}</span></div>
              </div>

              <div class="stats-average-container">
                <span>Moyenne</span>
                <span class="average-value" style="--value: ${pokemonStatsAverage}">${pokemonStatsAverage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lzr-drawer">
        <div class="tile-header">
          <div>
            <span class="header-title">Sprites</span>
          </div>
          <div class="tile-caret">
            ${getSvgIcon('chevron-right', 'm', null)}
          </div>
          <input type="checkbox" onclick="onOpenSpritesClick(event)" ${user.OPENED_SPRITES ? 'checked' : ''}>
        </div>
        <div class="expandable-wrapper">
          <div class="expandable-inner">
            <div class="inner-body">
              <div class="sprites-section">
                <div class="sprite-block">
                  <div class="version-container">
                    <span style="color: var(--color--error);">Rouge</span>
                    <span style="color: var(--color--success);">Verte</span>
                  </div>
                  <div class="sprite-container">
                    <img src="${APP_ORIGIN}assets/medias/images/sprites/RG - front/0${pokemon.id}.png" />
                  </div>
                </div>
                <div class="sprite-block">
                  <div class="version-container">
                    <span style="color: var(--color--error);">Rouge</span>
                    <span style="color: var(--color--info);">Bleue</span>
                  </div>
                  <div class="sprite-container">
                    <img src="${APP_ORIGIN}assets/medias/images/sprites/RB - front/0${pokemon.id}.png" />
                  </div>
                </div>
                <div class="sprite-block">
                  <div class="version-container">
                    <span style="color: #969900;">Jaune</span>
                  </div>
                  <div class="sprite-container">
                    <img src="${APP_ORIGIN}assets/medias/images/sprites/Y - front/0${pokemon.id}.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Set FOOTER layout
  FOOTER.innerHTML = ``;

  updateMenuDom('pokedex');

  if (user.SOUND_EFFECTS) {
    cry.play();
  }
}

export function nextId(id) {
  const n = Number(id)          // "001" -> 1
  const next = n + 1            // 2
  return String(next).padStart(3, "0") // "002"
}
export function prevId(id) {
  const n = Number(id)
  const prev = n - 1
  return String(prev).padStart(3, "0")
}

function playPokemonCry() {
  let user = getUser();
  if (user.SOUND_EFFECTS) {
    cry.play();
  }
}
window.playPokemonCry = playPokemonCry;