export type PokemonName = {
  lang: "fr"|"en",
  name: string,
}

export type PokemonGender = "male"|"female"|"genderless"

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

export type Duration = [ number, 'ms' ]

export type PokemonBase = {
  id: number,
  name: string,
  names: PokemonName[],
  genders: PokemonGender[],
  abilities: PokemonAbility[],
  types: PokemonType[],
  stats: PokemonStat[],
}

export type PokemonKindMixin = (
  { kind: "default"|"baby"|"legendary"|"mythical"|"other" }
  | {
    kind: "mega",
    mega: {
      counter_attack: number,
      auto_regen: { hp: number, every: Duration, during: Duration, cooldown: Duration }
    }
  }
)

export type FlyingPokemonMixin = (
  { can_fly: false }
  | { can_fly: true, fly: { duration: Duration, cooldown: Duration } }
)

export type PoisonousPokemonMixin = (
  { is_poisonous: false }
  | { is_poisonous: true, poisonous: { rate: number, every: Duration, during: Duration, damages: number } }
)

export type Pokemon = PokemonBase & PokemonKindMixin & FlyingPokemonMixin & PoisonousPokemonMixin
