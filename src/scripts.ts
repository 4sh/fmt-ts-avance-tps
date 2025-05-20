import {Pokemon} from "./types.js";

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
    Genders: ${pokemon.genders.map(gender => {
      switch(gender) {
        case "male": return "M";
        case "female": return "F";
        default: throw new Error(`Unsupported gender: ${gender}`)
      }
    }).join("/")}
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

main();
