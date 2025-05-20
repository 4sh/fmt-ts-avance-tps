import { match } from "ts-pattern";
import {
  Pokemon,
  PokemonGender,
  NORMAL_SPRITE_NAMES,
  SHINY_SPRITE_NAMES,
  SpriteName,
  POKEMON_PARSER, PokemonTypeName,
} from "./types";
import {z} from "zod";
import {fetchRawPokemons} from "./pokemon-api";

function toGenderLabel(gender: PokemonGender): string {
  const genderLabel = match(gender)
    .with('male', () => 'M')
    .with('female', () => 'F')
    .with('genderless', () => '-')
    .exhaustive();

  console.log(`Gender label: ${genderLabel}`)
  return genderLabel;
}


function showStatus(htmlContent: string) {
  const $status = document.querySelector(`#status`)
  if($status) {
    $status.innerHTML = htmlContent;
  } else {
    console.error(`no #status found !`)
  }
}

function compareTypes(attackingType: PokemonTypeName, defendingType: PokemonTypeName) {
  // TODO: change me !
  return "Unknown result !";
}

async function loadPokemons() {
  const result = await fetchRawPokemons(async updated => {
    showStatus(match(updated)
      .with({status: 'initiated'}, () => `<em>Initializing</em>...`)
      .with({status: 'loading'}, () => `<em>Loading...</em>...`)
      .with({status: 'error'}, ({ errorMessage }) => `<span style="color: red">Error occured: ${errorMessage}</span>`)
      .with({status: 'completed'}, ({ rawJson }) => `<span style="color: blue">Received ${rawJson.length} pokemon(s) !</span>`)
      .exhaustive()
    )
  });
  if(result.status === 'error') {
    throw new Error(result.errorMessage);
  }

  const jsonResp = result.rawJson;

  const parsingResult = z.array(POKEMON_PARSER).safeParse(jsonResp);
  if(parsingResult.success) {
    return parsingResult.data;
  } else {
    console.log([
      `Pokemon parsing errors detected:`,
      ...parsingResult.error.errors.map(err => {
        const invalidUnionMessage = match(err).with({code: 'invalid_union'}, ({unionErrors}) =>
          // only first union error / issue is relevant in our case
          match(unionErrors[0].issues[0])
            .with({ code: 'invalid_literal'}, ({ received }) => `Invalid expected literal: ${received}`)
            .otherwise(() => '')
        ).otherwise(() => '')

        return `- ${err.path.join(".")}: ${err.message} - ${invalidUnionMessage}`
      })
    ].join("\n"));
    return [];
  }
}

function showPokemon(predicate: (pokemon: Pokemon) => boolean) {
  const pokemon = POKEMONS.find(predicate);
  if(!pokemon) {
    console.log(`No pokemon found matching predicate ${predicate.toString()}`)
    return;
  }

  const frName = pokemon.names.find(n => n.lang === 'fr');
  let text = [
    `[${pokemon.id}] ${pokemon.name} ${frName ? `(FR: ${frName.name})` : ''}`,
    `${pokemon.stats.map(st => `${st.stat.name}:${st.base_stat}`).join(", ")}`,
    `Genders: ${pokemon.genders.map(gender => toGenderLabel(gender)).join("/")}`,
    `Types: ${pokemon.types.map(t => t.type.name).join(", ")}`,
    `Abilities: ${pokemon.abilities.map(ab => ab.ability.name).join(", ")}`,
  ].join('\n');

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

  /* TODO: Uncomment once pokemon sprites will be handled with zod
  console.log(pokemon.sprites.back_default?.toLowerCase())
  console.log(pokemon.sprites.front_default?.toLowerCase())
  console.log(pokemon.sprites.front_shiny?.toLowerCase())
  console.log(pokemon.sprites.front_shiny_female?.toLowerCase())
  console.log(pokemon.sprites.other?.dream_world?.back_shiny?.toLowerCase())
  console.log(pokemon.sprites.other?.dream_world?.back_female?.toLowerCase())
  console.log(pokemon.sprites.other?.dream_world?.front_female?.toLowerCase())
  console.log(pokemon.sprites.versions?.['generation-i']?.['red-blue']?.back_shiny_female?.toLowerCase())
   */

  const spritePictures = SPRITES_KNOWN_PATHS.reduce((content, path) => {
    const pathSpritePictures = [NORMAL_SPRITE_NAMES, SHINY_SPRITE_NAMES].map(row =>
      row.map(spriteName => {
        const sprite = spritesPath(pokemon, path, spriteName);
        return sprite ? `<img src="${sprite}" alt="${spriteName}" title="${spriteName}" style="max-height: 96px; border: 1px solid gray;" />` : ''
      }).join("")
    ).join("<br/>")

    if (pathSpritePictures && pathSpritePictures !== '<br/>') {
      return `${content}<h4>${path.join(" > ")}</h4>${pathSpritePictures}`;
    } else {
      return content;
    }
  }, '');

  document.querySelector("#sprites")!.innerHTML = `<h2>Assets</h2>${spritePictures}`
}

function spritesPath(pokemon: Pokemon, spritePath: string[], spriteName: SpriteName) {
  // TODO: to uncomment once sprites will be handled with zod
  /*
  const targetNode = spritePath.reduce(
    (node: PokemonSprites | undefined, spritePath: string) => node === undefined ? undefined : node[spritePath],
    pokemon.sprites
  );
  return targetNode ? targetNode[spriteName] : undefined;
   */
  return undefined;
}

function findPokemonById() {
  const id = Number(document.querySelector("input")?.value);
  showPokemon(pokemon => pokemon.id === id);
}

function findPokemonByName() {
  const name = document.querySelector("input")?.value;
  showPokemon(pokemon => pokemon.name.toLowerCase() === name?.toLowerCase());
}

function comparePokemonTypes() {
  const attackingType = (document.querySelector("#attackingType") as HTMLSelectElement).value as PokemonTypeName;
  const defendingType = (document.querySelector("#defendingType") as HTMLSelectElement).value as PokemonTypeName;

  document.querySelector("#pokemon-type-comparison")!.innerHTML = compareTypes(attackingType, defendingType);
}

let POKEMONS: Pokemon[] = [];

async function main() {
  POKEMONS = await loadPokemons();
  console.log(`All ${POKEMONS.length} pokemons loaded successfully !`)

  document.querySelector("#pokemons-count")!.innerHTML = `<strong>${POKEMONS.length}</strong> Pokemon(s) loaded !`
  document.querySelector("#showPokemonById")!.addEventListener('click', findPokemonById);
  document.querySelector("#showPokemonByName")!.addEventListener('click', findPokemonByName);

  const uniquePokemonTypes = POKEMONS.reduce((types, pokemon) => {
    pokemon.types.forEach(pokemonType => types.add(pokemonType.type.name))
    return types;
  }, new Set<string>())
  const pokemonTypeOptions = [...uniquePokemonTypes].sort().map(type => `<option value="${type}">${type}</option>`).join("\n")
  document.querySelectorAll("#attackingType, #defendingType").forEach(selectNode => {
    selectNode.innerHTML = pokemonTypeOptions;
  })
  document.querySelector("#comparePokemonTypes")!.addEventListener('click', comparePokemonTypes);

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
