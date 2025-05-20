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
  abilities: PokemonAbility[],
  types: PokemonType[],
  stats: PokemonStat[],
}
