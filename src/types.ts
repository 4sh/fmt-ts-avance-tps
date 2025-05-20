import {z} from "zod";

export const POKEMON_NAME_PARSER = z.object({
  lang: z.union([z.literal("fr"), z.literal("en")]),
  name: z.string(),
})
export type PokemonName = z.infer<typeof POKEMON_NAME_PARSER>;

export const POKEMON_GENDER_PARSER = z.union([ z.literal("male"), z.literal("female"), z.literal("genderless") ]);
export type PokemonGender = z.infer<typeof POKEMON_GENDER_PARSER>

export const REFERENCE_PARSER = z.object({
  name: z.string(), url: z.string(),
})
export type Reference = z.infer<typeof REFERENCE_PARSER>

export const POKEMON_ABILITY_PARSER = z.object({
  ability: REFERENCE_PARSER,
  is_hidden: z.boolean(), slot: z.number(),
})
export type PokemonAbility = z.infer<typeof POKEMON_ABILITY_PARSER>

export const POKEMON_TYPE_PARSER = z.object({
  slot: z.number(),
  type: REFERENCE_PARSER,
})
export type PokemonTypeName = z.infer<typeof POKEMON_TYPE_PARSER>['type']['name'];
export type PokemonType = z.infer<typeof POKEMON_TYPE_PARSER>;

export const POKEMON_STAT_PARSER = z.object({
  base_stat: z.number(),
  effort: z.number(),
  stat: REFERENCE_PARSER
})
export type PokemonStat = z.infer<typeof POKEMON_STAT_PARSER>;

export const DURATION_PARSER = z.tuple([ z.number().nonnegative().finite(), z.literal('ms') ]);
export type Duration = z.infer<typeof DURATION_PARSER>;

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

export type PokemonSprites = ({
  [key in SpriteName]: string|null|undefined
} & {
  [key: string]: PokemonSprites|string|null|undefined
})

export const POKEMON_BASE_PARSER = z.object({
  id: z.number(),
  name: z.string(),
  names: z.array(POKEMON_NAME_PARSER),
  genders: z.array(POKEMON_GENDER_PARSER),
  abilities: z.array(POKEMON_ABILITY_PARSER),
  types: z.array(POKEMON_TYPE_PARSER),
  stats: z.array(POKEMON_STAT_PARSER),
  // sprites: PokemonSprites
})
export type PokemonBase = z.infer<typeof POKEMON_BASE_PARSER>;

export const POKEMON_KIND_MIXIN_PARSER = z.union([
  z.object({
    kind: z.union([
      z.literal("default"), z.literal("baby"), z.literal("legendary"),
      z.literal("mythical"), z.literal("other"),
    ])
  }),
  z.object({
    kind: z.literal("mega"),
    mega: z.object({
      counter_attack: z.number(),
      auto_regen: z.object({
        hp: z.number(), every: DURATION_PARSER,
        during: DURATION_PARSER, cooldown: DURATION_PARSER
      }),
    })
  })
])
export type PokemonKindMixin = z.infer<typeof POKEMON_KIND_MIXIN_PARSER>;

export const FLYING_POKEMON_MIXIN_PARSER = z.union([
  z.object({ can_fly: z.literal(false) }),
  z.object({
    can_fly: z.literal(true),
    fly: z.object({
      duration: DURATION_PARSER, cooldown: DURATION_PARSER,
    })
  })
])
export type FlyingPokemonMixin = z.infer<typeof FLYING_POKEMON_MIXIN_PARSER>;

export const POISONOUS_POKEMON_MIXIN_PARSER = z.union([
  z.object({ is_poisonous: z.literal(false) }),
  z.object({
    is_poisonous: z.literal(true),
    poisonous: z.object({
      rate: z.number(), every: DURATION_PARSER,
      during: DURATION_PARSER, damages: z.number(),
    })
  })
])
export type PoisonousPokemonMixin = z.infer<typeof POISONOUS_POKEMON_MIXIN_PARSER>;

export const POKEMON_PARSER = POKEMON_BASE_PARSER
  .and(POKEMON_KIND_MIXIN_PARSER)
  .and(FLYING_POKEMON_MIXIN_PARSER)
  .and(POISONOUS_POKEMON_MIXIN_PARSER);
export type Pokemon = z.infer<typeof POKEMON_PARSER>;
