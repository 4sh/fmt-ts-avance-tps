import {Pokemon, PokemonGender, NORMAL_SPRITE_NAMES, SHINY_SPRITE_NAMES, SpriteName, PokemonSprites} from "./types.js";

const GENDER_LABEL: {[key in PokemonGender]: string} = {
  male: "M",
  female: "F",
  genderless: "-"
}

async function loadPokemons() {
  // Context starts from index.html (from where current script is imported)
  const TP_ROOT_PATH = `./`
  return await fetch(`${TP_ROOT_PATH}data/pokemons.json`).then(resp => resp.json())
}

function showPokemon(predicate: (pokemon: Pokemon) => boolean) {
  const pokemon = POKEMONS.find(predicate);
  if(!pokemon) {
    console.log(`No pokemon found matching predicate ${predicate.toString()}`)
    return;
  }

  const frName = pokemon.names.find(n => n.lang === 'fr');
  let text = `[${pokemon.id}] ${pokemon.name} ${frName ? `(FR: ${frName.name})` : ''}
    ${pokemon.stats.map(st => `${st.stat.name}:${st.base_stat}`).join(", ")}
    Genders: ${pokemon.genders.map(gender => GENDER_LABEL[gender]).join("/")}
    Types: ${pokemon.types.map(t => t.type.name).join(", ")}
    Abilities: ${pokemon.abilities.map(ab => ab.ability.name).join(", ")}
  `

  if(pokemon.can_fly) {
    text += `
    === Special: CAN FLY ! ===
    During ${pokemon.fly.duration[0]}${pokemon.fly.duration[1]} (CD: ${pokemon.fly.cooldown[0]}${pokemon.fly.cooldown[1]})
    `
  }

  if(pokemon.is_poisonous) {
    text += `
    === Special: POISONS ENNEMIES ! ===
    Rate: ${pokemon.poisonous.rate*100}%
    Poisons ${pokemon.poisonous.damages} every ${pokemon.poisonous.every[0]}${pokemon.poisonous.every[1]} during ${pokemon.poisonous.during[0]}${pokemon.poisonous.during[1]}
    `
  }

  if(pokemon.kind === 'mega') {
    text += `
    === MEGA FORM ===
    Counter attack: ${pokemon.mega.counter_attack}
    Auto-regen: ${pokemon.mega.auto_regen.hp} every ${pokemon.mega.auto_regen.every[0]}${pokemon.mega.auto_regen.every[1]} during ${pokemon.mega.auto_regen.during[0]}${pokemon.mega.auto_regen.during[1]} (CD: ${pokemon.mega.auto_regen.cooldown[0]}${pokemon.mega.auto_regen.cooldown[1]})
    `
  }

  document.querySelector("#result")!.innerHTML = text

  // Please, make console.log() tests below compile (without touching it, simply by defining proper Pokemon['sprites'] type)
  console.log(pokemon.sprites.back_default?.toLowerCase())
  console.log(pokemon.sprites.front_default?.toLowerCase())
  console.log(pokemon.sprites.front_shiny?.toLowerCase())
  console.log(pokemon.sprites.front_shiny_female?.toLowerCase())
  console.log(pokemon.sprites.other?.dream_world?.back_shiny?.toLowerCase())
  console.log(pokemon.sprites.other?.dream_world?.back_female?.toLowerCase())
  console.log(pokemon.sprites.other?.dream_world?.front_female?.toLowerCase())
  console.log(pokemon.sprites.versions?.['generation-i']?.['red-blue']?.back_shiny_female?.toLowerCase())

  const spritePictures = SPRITES_KNOWN_PATHS.reduce((content, path) => {
    const pathSpritePictures = [NORMAL_SPRITE_NAMES, SHINY_SPRITE_NAMES].map(row =>
      row.map(spriteName => {
        const sprite = spritesPath(pokemon, path, spriteName);
        return sprite ? `<img src="${sprite}" alt="${spriteName}" title="${spriteName}" style="max-height: 96px; border: 1px solid gray;" />` : ''
      }).join("")
    ).join("<br/>")

    if(pathSpritePictures && pathSpritePictures !== '<br/>') {
      return `${content}<h4>${path.join(" > ")}</h4>${pathSpritePictures}`;
    } else {
      return content;
    }
  }, '');

  document.querySelector("#sprites")!.innerHTML = `<h2>Assets</h2>${spritePictures}`
}

function spritesPath(pokemon: Pokemon, spritePath: string[], spriteName: SpriteName) {
  const targetNode = spritePath.reduce((node: PokemonSprites|undefined, spritePath: string) => node === undefined ? undefined : node[spritePath], pokemon.sprites);
  return targetNode ? targetNode[spriteName] : undefined;
}

function findPokemonById() {
  const id = Number(document.querySelector("input")?.value);
  showPokemon(pokemon => pokemon.id === id);
}
function findPokemonByName() {
  const name = document.querySelector("input")?.value;
  showPokemon(pokemon => pokemon.name.toLowerCase() === name?.toLowerCase());
}

let POKEMONS: Pokemon[] = [];
async function main() {
  POKEMONS = await loadPokemons();
  console.log(`All ${POKEMONS.length} pokemons loaded successfully !`)

  document.querySelector("#showPokemonById")!.addEventListener('click', findPokemonById);
  document.querySelector("#showPokemonByName")!.addEventListener('click', findPokemonByName);
  console.log("Button events initiated !")
}

const SPRITES_KNOWN_PATHS = [
  [],
  ["other", "dream_world"],
  ["other", "home"],
  ["other", "official-artwork"],
  ["other", "showdown"],
  ["versions", "generation-i", "red-blue"],
  ["versions", "generation-i", "yellow"],
  ["versions", "generation-ii", "crystal"],
  ["versions", "generation-ii", "gold"],
  ["versions", "generation-ii", "silver"],
  ["versions", "generation-iii", "emeral"],
  ["versions", "generation-iii", "firered-leafgreen"],
  ["versions", "generation-iii", "ruby-sapphire"],
  ["versions", "generation-iv", "diamond-pearl"],
  ["versions", "generation-iv", "heartgold-soulsilver"],
  ["versions", "generation-iv", "platinum"],
  ["versions", "generation-v", "black-white"],
  ["versions", "generation-v", "black-white", "animated"],
  ["versions", "generation-vi", "omegaruby-alphasapphire"],
  ["versions", "generation-vi", "x-y"],
  ["versions", "generation-vii", "icons"],
  ["versions", "generation-vii", "ultra-sun-ultra-moon"],
  ["versions", "generation-viii", "icons"]
]

main();
