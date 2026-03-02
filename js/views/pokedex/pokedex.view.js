import { APP_NAME, APP_VERSION } from "../../../app-properties.js";
import { playMusic } from "../../services/music.service.js";
import { POKEMONS_LIST } from "../../data/pokemons.data.js";
import { ICONS } from "../../data/svgIcons.data.js";
import { APP_BASE_PATH, APP_ORIGIN, toExternalPath } from "../../router.js";
import { getSvgIcon } from "../../services/icons.service.js";
import { hideSideBar, showSideBar, updateMenuDom } from "../../services/menu.service.js";
import { getUser } from "../../services/storage.service.js";
import { showToast } from "../../services/toast.service.js";
import { isLaptopOrUp, isPhone, isTablet } from "../../utils/breakpoints.js";
import { getFilterStringForHexValue } from "../../utils/factory/filter.js"
import { getCssRootVariableValue } from "../../utils/UTILS.js";

// VARIABLES //////////////////////////////////////////////////////////////////////////////////////
const HEADER_ICON_CONTAINER = document.getElementById('headerIconContainer');
const HEADER_TITLE = document.getElementById('headerTitle');
const MAIN = document.getElementById('main');
const FOOTER = document.getElementById('footer');

const loremIpsum = `
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vitae imperdiet est, nec fringilla sem. Donec lectus ex, dignissim non vestibulum et, consectetur vitae erat. Phasellus et tortor nec risus semper rutrum porta vitae odio. Sed at mollis turpis. Integer pulvinar lobortis mi, lobortis dictum mi commodo in. Fusce augue metus, scelerisque ac molestie et, ultricies vitae purus. Sed at pharetra augue, at eleifend metus.
    <br>
    Aenean lorem odio, fringilla et hendrerit nec, hendrerit et felis. Maecenas interdum porta tellus, nec ultrices lectus commodo sit amet. Vivamus a turpis metus. Nunc mattis velit non enim aliquam volutpat. Aenean eleifend risus sed augue facilisis, congue pretium ipsum consequat. Suspendisse eu nulla placerat, mattis nisl eu, feugiat nisl. Nulla felis risus, aliquet eu posuere eu, imperdiet sed velit. Sed ac tellus cursus, mollis sapien id, dapibus nisl. Proin mauris nisi, blandit quis efficitur vulputate, venenatis ut nisl. Phasellus viverra quis nunc iaculis rutrum. Duis at tortor convallis, eleifend nunc venenatis, dapibus neque. Duis imperdiet mollis lacus mattis bibendum. Curabitur sit amet tellus gravida, viverra libero id, tincidunt orci.
  </p>
`;      
const options = `
  <option value="option 1" selected>option 1</option>
  <option value="option 2">option 2</option>
`;

// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

export function render() {
  // Set HEADER layout
  if (isPhone || isTablet) {
    HEADER_TITLE.innerHTML = 'Pokédex';
  }
  if (isLaptopOrUp) {
    HEADER_TITLE.innerHTML = APP_NAME;
  }

  // Set MAIN layout
  MAIN.innerHTML = getPokemonsDom();

  // Set FOOTER layout
  FOOTER.innerHTML = ``;

  updateMenuDom('pokedex');

  playMusic('oak-lab');

  /* setTimeout(() => {
    showSideBar();
  }, 3000); */
}

function getPokemonDom(pokemon) {
  let user = getUser();

  let str = `
  <a class="pokemon-line" href="${toExternalPath(`/pokedex/pokemon?id=${pokemon.id}`)}">
    <span class="id-container">#${pokemon.id}</span>
    <div class="sprite-container">
      <img src="${APP_ORIGIN}assets/medias/images/sprites/${user.PREFERED_SPRITES} - front/0${pokemon.id}.png" />
    </div>
    <span class="name-container">${pokemon.name}</span>
    <div class="types-container">
      <div class="type-badge" style="--color: var(--TYPE-${pokemon.type1});">
        <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${pokemon.type1}.svg" style="/* filter: ${getFilterStringForHexValue(getCssRootVariableValue(`--TYPE-${pokemon.type1}`))}; */" />
      </div>
      ${
        pokemon.type2 !== null
        ? `<div class="type-badge" style="--color: var(--TYPE-${pokemon.type2});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${pokemon.type2}.svg" style="/* filter: ${getFilterStringForHexValue(getCssRootVariableValue(`--TYPE-${pokemon.type2}`))}; */" />
          </div>`
        : `<div class="type-badge" style="--color: var(--TYPE-${pokemon.type1}); opacity: 0;">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${pokemon.type1}.svg" style="/* filter: ${getFilterStringForHexValue(getCssRootVariableValue(`--TYPE-${pokemon.type1}`))}; */" />
          </div>`
      }
    </div>
  </a>
  `;
  return str;
}

function getPokemonsDom() {
  let str = '<div class="pokedex-list">';
  for (let pokemon of POKEMONS_LIST) {
    str += getPokemonDom(pokemon);
  }
  str += '</div>';
  return str;
}