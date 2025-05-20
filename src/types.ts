export type PokemonName = {
  lang: "fr"|"en",
  name: string,
}

export type PokemonGender = "male"|"female"

export type Reference = {
  name: string, url: string
}

export type PokemonAbility = {
  ability: Reference,
  is_hidden: boolean, slot: number
}

export type PokemonType = {
  slot: number,
  type: Reference
}

export type PokemonStat = {
  base_stat: number,
  effort: number,
  stat: Reference
}

export type Pokemon = {
  id: number,
  name: string,
  names: PokemonName[],
  genders: PokemonGender[],
  abilities: PokemonAbility[],
  types: PokemonType[],
  stats: PokemonStat[],
}
