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


// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

export function render() {
  let user = getUser();
  // Set HEADER layout
  if (isPhone || isTablet) {
    HEADER_TITLE.innerHTML = 'Table des Types';
  }
  if (isLaptopOrUp) {
    HEADER_TITLE.innerHTML = APP_NAME;
  }

  // Set MAIN layout
  MAIN.innerHTML = `
    
    <div class="page-container">
      ${ isLaptopOrUp ? `<h1>Table des Types</h1>` : ''}
      
      <p>
        Selon les types des Pokémon combattants, les capacités lancées peuvent avoir une efficacité variable.<br>
        Chaque type est ainsi caractérisé par des <b>faiblesses</b> et des <b>résistances</b>.<br>
        Ces caractéristiques sont regroupées dans cette table des types.
      </p>
    </div>
    

    <div class="table-container">
      <div class="table-row"><!-- line 0 - defense legend -->
        <div class="table-cell origin-cell"><span>DEF</span><span>ATK</span></div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.NOR});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.NOR}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.FEU});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.FEU}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.EAU});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.EAU}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.PLA});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.PLA}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.ELE});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.ELE}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.GLA});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.GLA}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.COM});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.COM}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.PSN});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.PSN}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.SOL});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.SOL}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.VOL});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.VOL}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.PSY});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.PSY}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.INS});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.INS}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.ROC});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.ROC}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.SPE});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.SPE}.svg" />
          </div>
        </div>
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.DRA});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.DRA}.svg" />
          </div>
        </div>
      </div>
      <div class="table-row"><!-- line 1 - Normal attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.NOR});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.NOR}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell">1</div> <!-- vs fe -->
        <div class="table-cell">1</div> <!-- vs ea -->
        <div class="table-cell">1</div> <!-- vs pl -->
        <div class="table-cell">1</div> <!-- vs el -->
        <div class="table-cell">1</div> <!-- vs gl -->
        <div class="table-cell">1</div> <!-- vs co -->
        <div class="table-cell">1</div> <!-- vs po -->
        <div class="table-cell">1</div> <!-- vs so -->
        <div class="table-cell">1</div> <!-- vs vo -->
        <div class="table-cell">1</div> <!-- vs ps -->
        <div class="table-cell">1</div> <!-- vs in -->
        <div class="table-cell not-very-effective">½</div> <!-- vs ro -->
        <div class="table-cell uneffective">0</div> <!-- vs sp -->
        <div class="table-cell">1</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 2 - Feu attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.FEU});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.FEU}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell not-very-effective">½</div> <!-- vs fe -->
        <div class="table-cell not-very-effective">½</div> <!-- vs ea -->
        <div class="table-cell very-effective">2</div> <!-- vs pl -->
        <div class="table-cell">1</div> <!-- vs el -->
        <div class="table-cell very-effective">2</div> <!-- vs gl -->
        <div class="table-cell">1</div> <!-- vs co -->
        <div class="table-cell">1</div> <!-- vs po -->
        <div class="table-cell">1</div> <!-- vs so -->
        <div class="table-cell">1</div> <!-- vs vo -->
        <div class="table-cell">1</div> <!-- vs ps -->
        <div class="table-cell very-effective">2</div> <!-- vs in -->
        <div class="table-cell not-very-effective">½</div> <!-- vs ro -->
        <div class="table-cell">1</div> <!-- vs sp -->
        <div class="table-cell not-very-effective">½</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 3 - Eau attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.EAU});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.EAU}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell very-effective">2</div> <!-- vs fe -->
        <div class="table-cell not-very-effective">½</div> <!-- vs ea -->
        <div class="table-cell not-very-effective">½</div> <!-- vs pl -->
        <div class="table-cell">1</div> <!-- vs el -->
        <div class="table-cell">1</div> <!-- vs gl -->
        <div class="table-cell">1</div> <!-- vs co -->
        <div class="table-cell">1</div> <!-- vs po -->
        <div class="table-cell very-effective">2</div> <!-- vs so -->
        <div class="table-cell">1</div> <!-- vs vo -->
        <div class="table-cell">1</div> <!-- vs ps -->
        <div class="table-cell">1</div> <!-- vs in -->
        <div class="table-cell very-effective">2</div> <!-- vs ro -->
        <div class="table-cell">1</div> <!-- vs sp -->
        <div class="table-cell not-very-effective">½</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 4 - Plante attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.PLA});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.PLA}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell not-very-effective">½</div> <!-- vs fe -->
        <div class="table-cell very-effective">2</div> <!-- vs ea -->
        <div class="table-cell not-very-effective">½</div> <!-- vs pl -->
        <div class="table-cell">1</div> <!-- vs el -->
        <div class="table-cell">1</div> <!-- vs gl -->
        <div class="table-cell">1</div> <!-- vs co -->
        <div class="table-cell not-very-effective">½</div> <!-- vs po -->
        <div class="table-cell very-effective">2</div> <!-- vs so -->
        <div class="table-cell not-very-effective">½</div> <!-- vs vo -->
        <div class="table-cell">1</div> <!-- vs ps -->
        <div class="table-cell not-very-effective">½</div> <!-- vs in -->
        <div class="table-cell very-effective">2</div> <!-- vs ro -->
        <div class="table-cell">1</div> <!-- vs sp -->
        <div class="table-cell not-very-effective">½</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 5 - Electrik attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.ELE});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.ELE}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell">1</div> <!-- vs fe -->
        <div class="table-cell very-effective">2</div> <!-- vs ea -->
        <div class="table-cell not-very-effective">½</div> <!-- vs pl -->
        <div class="table-cell not-very-effective">½</div> <!-- vs el -->
        <div class="table-cell">1</div> <!-- vs gl -->
        <div class="table-cell">1</div> <!-- vs co -->
        <div class="table-cell">1</div> <!-- vs po -->
        <div class="table-cell uneffective">0</div> <!-- vs so -->
        <div class="table-cell very-effective">2</div> <!-- vs vo -->
        <div class="table-cell">1</div> <!-- vs ps -->
        <div class="table-cell">1</div> <!-- vs in -->
        <div class="table-cell">1</div> <!-- vs ro -->
        <div class="table-cell">1</div> <!-- vs sp -->
        <div class="table-cell not-very-effective">½</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 6 - Glace attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.GLA});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.GLA}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell">1</div> <!-- vs fe -->
        <div class="table-cell not-very-effective">½</div> <!-- vs ea -->
        <div class="table-cell very-effective">2</div> <!-- vs pl -->
        <div class="table-cell">1</div> <!-- vs el -->
        <div class="table-cell not-very-effective">½</div> <!-- vs gl -->
        <div class="table-cell">1</div> <!-- vs co -->
        <div class="table-cell">1</div> <!-- vs po -->
        <div class="table-cell very-effective">2</div> <!-- vs so -->
        <div class="table-cell very-effective">2</div> <!-- vs vo -->
        <div class="table-cell">1</div> <!-- vs ps -->
        <div class="table-cell">1</div> <!-- vs in -->
        <div class="table-cell">1</div> <!-- vs ro -->
        <div class="table-cell">1</div> <!-- vs sp -->
        <div class="table-cell very-effective">2</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 7 - Combat attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.COM});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.COM}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell very-effective">2</div> <!-- vs no -->
        <div class="table-cell">1</div> <!-- vs fe -->
        <div class="table-cell">1</div> <!-- vs ea -->
        <div class="table-cell">1</div> <!-- vs pl -->
        <div class="table-cell">1</div> <!-- vs el -->
        <div class="table-cell very-effective">2</div> <!-- vs gl -->
        <div class="table-cell">1</div> <!-- vs co -->
        <div class="table-cell not-very-effective">½</div> <!-- vs po -->
        <div class="table-cell">1</div> <!-- vs so -->
        <div class="table-cell not-very-effective">½</div> <!-- vs vo -->
        <div class="table-cell not-very-effective">½</div> <!-- vs ps -->
        <div class="table-cell not-very-effective">½</div> <!-- vs in -->
        <div class="table-cell very-effective">2</div> <!-- vs ro -->
        <div class="table-cell uneffective">0</div> <!-- vs sp -->
        <div class="table-cell">1</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 8 - Poison attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.PSN});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.PSN}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell">1</div> <!-- vs fe -->
        <div class="table-cell">1</div> <!-- vs ea -->
        <div class="table-cell very-effective">2</div> <!-- vs pl -->
        <div class="table-cell">1</div> <!-- vs el -->
        <div class="table-cell">1</div> <!-- vs gl -->
        <div class="table-cell">1</div> <!-- vs co -->
        <div class="table-cell not-very-effective">½</div> <!-- vs po -->
        <div class="table-cell not-very-effective">½</div> <!-- vs so -->
        <div class="table-cell">1</div> <!-- vs vo -->
        <div class="table-cell">1</div> <!-- vs ps -->
        <div class="table-cell very-effective">2</div> <!-- vs in -->
        <div class="table-cell not-very-effective">½</div> <!-- vs ro -->
        <div class="table-cell not-very-effective">½</div> <!-- vs sp -->
        <div class="table-cell">1</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 9 - Sol attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.SOL});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.SOL}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell very-effective">2</div> <!-- vs fe -->
        <div class="table-cell">1</div> <!-- vs ea -->
        <div class="table-cell not-very-effective">½</div> <!-- vs pl -->
        <div class="table-cell very-effective">2</div> <!-- vs el -->
        <div class="table-cell">1</div> <!-- vs gl -->
        <div class="table-cell">1</div> <!-- vs co -->
        <div class="table-cell very-effective">2</div> <!-- vs po -->
        <div class="table-cell">1</div> <!-- vs so -->
        <div class="table-cell uneffective">0</div> <!-- vs vo -->
        <div class="table-cell">1</div> <!-- vs ps -->
        <div class="table-cell not-very-effective">½</div> <!-- vs in -->
        <div class="table-cell very-effective">2</div> <!-- vs ro -->
        <div class="table-cell">1</div> <!-- vs sp -->
        <div class="table-cell">1</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 10 - Vol attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.VOL});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.VOL}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell">1</div> <!-- vs fe -->
        <div class="table-cell">1</div> <!-- vs ea -->
        <div class="table-cell very-effective">2</div> <!-- vs pl -->
        <div class="table-cell not-very-effective">½</div> <!-- vs el -->
        <div class="table-cell">1</div> <!-- vs gl -->
        <div class="table-cell very-effective">2</div> <!-- vs co -->
        <div class="table-cell">1</div> <!-- vs po -->
        <div class="table-cell">1</div> <!-- vs so -->
        <div class="table-cell">1</div> <!-- vs vo -->
        <div class="table-cell">1</div> <!-- vs ps -->
        <div class="table-cell very-effective">2</div> <!-- vs in -->
        <div class="table-cell not-very-effective">½</div> <!-- vs ro -->
        <div class="table-cell">1</div> <!-- vs sp -->
        <div class="table-cell">1</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 11 - Psy attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.PSY});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.PSY}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell">1</div> <!-- vs fe -->
        <div class="table-cell">1</div> <!-- vs ea -->
        <div class="table-cell">1</div> <!-- vs pl -->
        <div class="table-cell">1</div> <!-- vs el -->
        <div class="table-cell">1</div> <!-- vs gl -->
        <div class="table-cell very-effective">2</div> <!-- vs co -->
        <div class="table-cell very-effective">2</div> <!-- vs po -->
        <div class="table-cell">1</div> <!-- vs so -->
        <div class="table-cell">1</div> <!-- vs vo -->
        <div class="table-cell not-very-effective">½</div> <!-- vs ps -->
        <div class="table-cell">1</div> <!-- vs in -->
        <div class="table-cell">1</div> <!-- vs ro -->
        <div class="table-cell">1</div> <!-- vs sp -->
        <div class="table-cell">1</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 12 - Insecte attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.INS});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.INS}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell not-very-effective">½</div> <!-- vs fe -->
        <div class="table-cell">1</div> <!-- vs ea -->
        <div class="table-cell very-effective">2</div> <!-- vs pl -->
        <div class="table-cell">1</div> <!-- vs el -->
        <div class="table-cell">1</div> <!-- vs gl -->
        <div class="table-cell not-very-effective">½</div> <!-- vs co -->
        <div class="table-cell very-effective">2</div> <!-- vs po -->
        <div class="table-cell">1</div> <!-- vs so -->
        <div class="table-cell not-very-effective">½</div> <!-- vs vo -->
        <div class="table-cell very-effective">2</div> <!-- vs ps -->
        <div class="table-cell">1</div> <!-- vs in -->
        <div class="table-cell">1</div> <!-- vs ro -->
        <div class="table-cell not-very-effective">½</div> <!-- vs sp -->
        <div class="table-cell">1</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 13 - Roche attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.ROC});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.ROC}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell very-effective">2</div> <!-- vs fe -->
        <div class="table-cell">1</div> <!-- vs ea -->
        <div class="table-cell">1</div> <!-- vs pl -->
        <div class="table-cell">1</div> <!-- vs el -->
        <div class="table-cell very-effective">2</div> <!-- vs gl -->
        <div class="table-cell not-very-effective">½</div> <!-- vs co -->
        <div class="table-cell">1</div> <!-- vs po -->
        <div class="table-cell not-very-effective">½</div> <!-- vs so -->
        <div class="table-cell very-effective">2</div> <!-- vs vo -->
        <div class="table-cell">1</div> <!-- vs ps -->
        <div class="table-cell very-effective">2</div> <!-- vs in -->
        <div class="table-cell">1</div> <!-- vs ro -->
        <div class="table-cell">1</div> <!-- vs sp -->
        <div class="table-cell">1</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 14 - Spectre attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.SPE});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.SPE}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell uneffective">0</div> <!-- vs no -->
        <div class="table-cell">1</div> <!-- vs fe -->
        <div class="table-cell">1</div> <!-- vs ea -->
        <div class="table-cell">1</div> <!-- vs pl -->
        <div class="table-cell">1</div> <!-- vs el -->
        <div class="table-cell">1</div> <!-- vs gl -->
        <div class="table-cell">1</div> <!-- vs co -->
        <div class="table-cell">1</div> <!-- vs po -->
        <div class="table-cell">1</div> <!-- vs so -->
        <div class="table-cell">1</div> <!-- vs vo -->
        <div class="table-cell uneffective">0</div> <!-- vs ps -->
        <div class="table-cell">1</div> <!-- vs in -->
        <div class="table-cell">1</div> <!-- vs ro -->
        <div class="table-cell very-effective">2</div> <!-- vs sp -->
        <div class="table-cell">1</div> <!-- vs dr -->
      </div>
      <div class="table-row"><!-- line 15 - Dragon attack -->
        <div class="table-cell">
          <div class="type-badge" style="--size: 16px; --color: var(--TYPE-${TYPES.DRA});">
            <img class="type-icon" src="${APP_ORIGIN}assets/medias/images/types/${TYPES.DRA}.svg" />
          </div>
        </div> <!-- Type icon -->
        <div class="table-cell">1</div> <!-- vs no -->
        <div class="table-cell">1</div> <!-- vs fe -->
        <div class="table-cell">1</div> <!-- vs ea -->
        <div class="table-cell">1</div> <!-- vs pl -->
        <div class="table-cell">1</div> <!-- vs el -->
        <div class="table-cell">1</div> <!-- vs gl -->
        <div class="table-cell">1</div> <!-- vs co -->
        <div class="table-cell">1</div> <!-- vs po -->
        <div class="table-cell">1</div> <!-- vs so -->
        <div class="table-cell">1</div> <!-- vs vo -->
        <div class="table-cell">1</div> <!-- vs ps -->
        <div class="table-cell">1</div> <!-- vs in -->
        <div class="table-cell">1</div> <!-- vs ro -->
        <div class="table-cell">1</div> <!-- vs sp -->
        <div class="table-cell very-effective">2</div> <!-- vs dr -->
      </div>
    </div>

    <div class="page-container types-table-page">

      <h2>Faiblesse</h2>
      <p>
        Un Pokémon a pour faiblesse un type dont la puissance des attaques augmente face au type du Pokémon défenseur. 
        Ainsi, l'attaque adverse a une capacité qui est multipliée par 2.
      </p>
      <p>
        Une attaque efficace sur le Pokémon défenseur est ainsi indiquée dans les jeux vidéo par la phrase « C'est super efficace ! » après l'attaque.
      </p>
      <p>
        Dans le cas des Pokémon à deux types, si l'attaque est d'un type efficace sur les deux types du Pokémon défenseur, la capacité est multipliée logiquement par 4.
      </p>

      <h2>Neutralité</h2>
      <p>
        Encore dans le cas des deux types, un Pokémon peut subir une attaque dont un de ses types y est sensible, l'autre résistant, ramenant le coefficient d'efficacité à x1. 
        Le type Normal est très spécialement concerné aussi bien en matière d'attaque qu'en défense, 
        vu sa neutralité pour tous les types sauf les types Roche, Acier et Combat (voir le tableau). 
        Dans le cas du type Spectre, il existe une immunité réciproque.
      </p>
      <p>
        Ainsi, les dégâts resteront constants, ne mettant en compte que le facteur du <b>STAB</b> ("Same Type Attack Bonus", non inclus dans le tableau).
      </p>

      <h2>Résistance</h2>
      <p>
        Un Pokémon a pour résistance un type dont la puissance des attaques diminue face au type du Pokémon défenseur. 
        Ainsi, l'attaque adverse a une puissance divisée par 2 (généralement notée multipliée par ½).
      </p>
      <p>
        Une attaque faible sur le Pokémon défenseur est ainsi indiquée dans les jeux vidéo par la phrase « Ce n'est pas très efficace… »
      </p>
      <p>
        Dans le cas des Pokémon à deux types, si les deux types du Pokémon défenseur sont résistants au type de l'attaque, 
        la capacité est divisée logiquement par 4 (ou multipliée par ¼).
      </p>

      <h2>Immunité</h2>
      <p>
        Certains types sont totalement inefficaces sur d'autres. Dans ces cas, l'attaque effectuée n'a absolument aucun effet, aussi bien en termes de retrait de PV que pour certaines attaques de changement de statut. 
      </p>
      <p>
        Dans les jeux vidéo, une attaque n'ayant rien fait sera signalée par « Cela n'affecte pas (Pokémon)… ».
      </p>

    </div>
  `;

  // Set FOOTER layout
  FOOTER.innerHTML = ``;

  updateMenuDom('types-table');
  
}
