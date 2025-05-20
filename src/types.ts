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

export const NORMAL_SPRITE_NAMES = [
  "front_default", "front_female", "front_gray", "front_transparent",
  "back_default", "back_female", "back_gray", "back_transparent"
] as const;
export const SHINY_SPRITE_NAMES = [
  "front_shiny", "front_shiny_female", "front_shiny_transparent",
  "back_shiny", "back_shiny_female", "back_shiny_transparent"
] as const;
export const SPRITE_NAMES = [
  ...NORMAL_SPRITE_NAMES, ...SHINY_SPRITE_NAMES
] as const

export type SpriteName = (typeof SPRITE_NAMES)[number]

export type PokemonSprites = unknown
/* ⬆️ Please, define a mapped type here, allowing to capture a sprites map
   Sprite map :
   - can be made of any of *SpriteName* keys, with value being a (potentially undefined) string
   - can be made of *any* string key, but in that case, value should be a PokemonSprites "sub-map"
*/

export type PokemonBase = {
  id: number,
  name: string,
  names: PokemonName[],
  genders: PokemonGender[],
  abilities: PokemonAbility[],
  types: PokemonType[],
  stats: PokemonStat[],
  sprites: PokemonSprites
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
