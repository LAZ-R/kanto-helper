import { APP_NAME, APP_VERSION } from "../../../app-properties.js";
import { playMusic } from "../../services/music.service.js";
import { POKEMONS_LIST } from "../../data/pokemons.data.js";
import { ICONS } from "../../data/svgIcons.data.js";
import { APP_BASE_PATH, APP_ORIGIN, toExternalPath } from "../../router.js";
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
let isFirstBall = true;
let isPlayingAudio = false;
let POKEMON_POOL = [];

// FUNCTIONS //////////////////////////////////////////////////////////////////////////////////////

export function render() {
  let user = getUser();
  // Set HEADER layout
  if (isPhone || isTablet) {
    HEADER_TITLE.innerHTML = '';
  }
  if (isLaptopOrUp) {
    HEADER_TITLE.innerHTML = APP_NAME;
  }

  POKEMON_POOL = [];
  POKEMON_POOL = [...POKEMONS_LIST];
  POKEMON_POOL.shift();

  // Set MAIN layout
  MAIN.innerHTML = `
    <div class="gb-screen-container">
      <div class="gb-screen">
        <div class="slideshow" id="pokemonSlideshow">
          <div id="pokemonSlide" class="sprite-container in" onclick="onHomepageSpriteClick('001')">
            <img src="${APP_ORIGIN}assets/medias/images/sprites/${user.PREFERED_SPRITES} - front/0001.png" />
          </div>
        </div>
        <img id="pokeball" class="ball-sprite" src="${APP_ORIGIN}assets/medias/images/sprites/ball.png" />
        <img class="red-sprite" src="${APP_ORIGIN}assets/medias/images/sprites/red.png" />
        <img class="credits" src="${APP_ORIGIN}assets/medias/images/credits.png" />
        <img id="titleScreenLogo" class="title hidden" src="${APP_ORIGIN}assets/medias/images/title-screen-logo.png" />
        <img id="titleScreenVersion" class="version hidden" src="${APP_ORIGIN}assets/medias/images/title-screen-version.png" />
      </div>
    </div>
    <div class="page-container">
      ${ isLaptopOrUp ? `<h1>Accueil</h1>` : ''}
      <p>
        Bienvenue sur <b>KANTO helper</b>, l'appli dédiée à la 1ère génération de Pokémon !
      </p>
      <br>
      <p>
        Ici, vous trouverez toute l'aide nécessaire pour mener à bien votre quête, et devenir Maître Pokémon:
      </p>
      <ul>
        <li>un Pokédex ;</li>
        <li>un guide complet de l'aventure ;</li>
        <li>une carte de Kanto ;</li>
        
        <li>et bien d'autres informations !</li>
      </ul>
    </div>
  `;

  // Set FOOTER layout
  FOOTER.innerHTML = ``;

  updateMenuDom('homepage');

  playMusic('title-screen');

  isFirstBall = true;

  let pokemonAminationInterval = setInterval(() => {
    switchPokemon();
  }, 5000);

  navigation.addEventListener('navigate', (navEvent) => {
    clearInterval(pokemonAminationInterval);
  });

  let ballAminationInterval = setInterval(() => {
    if (isFirstBall) {
      isFirstBall = false;
      bounceBall();
    } else {
      let rnd = getRandomIntegerBetween(0, 100);
      if (rnd < 50) {
        bounceBall();
      }
    }
  }, 5000);

  navigation.addEventListener('navigate', (navEvent) => {
    clearInterval(ballAminationInterval);
  });

  setTimeout(() => {
    document.getElementById('titleScreenLogo').classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('titleScreenVersion').classList.remove('hidden');
    }, 1000);
  }, 500);


  
}

function switchPokemon() {
  let user = getUser();
  let pokemonSlide1 = document.getElementById('pokemonSlide');
  pokemonSlide1.classList.add('slide-out');

  setTimeout(() => {
    let slideshow = document.getElementById('pokemonSlideshow');
    slideshow.innerHTML = '';
    if (POKEMON_POOL.length == 0) {
      POKEMON_POOL = [...POKEMONS_LIST];
    }
    let pokemon = POKEMON_POOL[getRandomIntegerBetween(0, POKEMON_POOL.length - 1)] ;
    slideshow.innerHTML = `
    <div id="pokemonSlide" class="sprite-container slide-in" onclick="onHomepageSpriteClick('${pokemon.id}')">
      <img src="${APP_ORIGIN}assets/medias/images/sprites/${user.PREFERED_SPRITES} - front/0${pokemon.id}.png" />
    </div>`;
  
    let pokemonSlide2 = document.getElementById('pokemonSlide');
    pokemonSlide2.classList.add('slide-in');

    POKEMON_POOL.splice(POKEMON_POOL.indexOf(pokemon), 1);
    console.log(`Pokémon restants: ${POKEMON_POOL.length}`);
  }, 1000);

}

function onHomepageSpriteClick(pokemonId) {
  let user = getUser();
  if (!user.SOUND_EFFECTS) return;
  let cry = new Audio(`${APP_ORIGIN}assets/medias/audio/cries/${pokemonId}.ogg`);
  if (!isPlayingAudio) {
    console.log(pokemonId);
    isPlayingAudio = true;
    cry.play();
    cry.addEventListener('ended', () => {
      isPlayingAudio = false;
    })
  }
}
window.onHomepageSpriteClick = onHomepageSpriteClick;

function bounceBall() {
  setTimeout(() => {
    let ballElement = document.getElementById('pokeball');
    ballElement.classList.add('bounce');
  
    setTimeout(() => {
      ballElement.classList.remove('bounce');
    }, 200);
  }, 500);
}