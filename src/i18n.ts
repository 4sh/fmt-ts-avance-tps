// =============================================================================
// TP 5.1 - Partie 1 : SOLUTION
// =============================================================================

import type { Equal, Expect } from "./type-tests.ts";

export const TRANSLATIONS = {
  common: {
    ok: "OK",
    cancel: "Annuler",
  },
  user: {
    name: "Nom",
    address: {
      city: "Ville",
      zip: "Code postal",
    },
  },
} as const;

// -----------------------------------------------------------------------------
// Étape 1a — TopKeys : clefs de premier niveau
// -----------------------------------------------------------------------------
export type TopKeys<T> = keyof T & string;

type _result_1a = TopKeys<typeof TRANSLATIONS>;

type _test_1a = Expect<Equal<
  _result_1a,
  "common" | "user"
>>;

// -----------------------------------------------------------------------------
// Étape 1b — Depth2KeysMap puis Depth2Keys
//   (i) On construit d'abord une structure intermédiaire clef → sous-chemin.
//       Version verbeuse (avec des gardes `extends string` explicites) :
//         type Depth2KeysMap<T> = {
//           [k in keyof T]: k extends string
//             ? keyof T[k] extends string
//               ? `${k}.${keyof T[k]}`
//               : never
//             : never
//         };
//
//       En mettant "& string" dans [k in keyof T & string] on peut enlever les "readonly"
//       + supprimer la contrainte "k extends string":
//         type Depth2KeysMap<T> = {
//           [k in keyof T & string]:
//             keyof T[k] extends string
//               ? `${k}.${keyof T[k]}`
//               : never
//         };
//
//       Version idiomatique équivalente, en utilisant `& string` de la même façon sur
//       le template literal:
// -----------------------------------------------------------------------------
export type Depth2KeysMap<T> = {
  [k in keyof T & string]: `${k}.${keyof T[k] & string}`;
};

type _result_1b_map = Depth2KeysMap<typeof TRANSLATIONS>;
// hover _result_1b_map = {
//   common: "common.ok" | "common.cancel";
//   user:   "user.name" | "user.address";
// }

type _test_1b_map = Expect<Equal<
  _result_1b_map,
  {
    "common": "common.ok" | "common.cancel",
    "user": "user.name" | "user.address"
  }
>>;

// (ii) On aplatit en une union en indexant par toutes les clefs
export type Depth2Keys<T> = Depth2KeysMap<T>[keyof T & string];

type _result_1b = Depth2Keys<typeof TRANSLATIONS>;

type _test_1b = Expect<Equal<
  _result_1b,
  "common.ok" | "common.cancel" | "user.name" | "user.address"
>>;

// -----------------------------------------------------------------------------
// Étape 1c — Paths : tous les chemins possibles (récursif)
//   Depuis Depth2Keys, on remplace `keyof T[K]` par un appel récursif Paths<T[K]>.
//   Pour chaque clef K, on émet à la fois K seule ET la concaténation avec les
//   sous-chemins récursifs.
// -----------------------------------------------------------------------------
export type Paths<T> = T extends object
  ? {
      [K in keyof T & string]: K | `${K}.${Paths<T[K]>}`;
    }[keyof T & string]
  : never;

type _result_1c = Paths<typeof TRANSLATIONS>;

type _test_1c = Expect<Equal<
  _result_1c,
  | "common" | "common.ok" | "common.cancel"
  | "user" | "user.name"
  | "user.address" | "user.address.city" | "user.address.zip"
>>;

// -----------------------------------------------------------------------------
// Étape 1d — Leaves : uniquement les chemins-feuilles
//   Même récursion que Paths, mais on n'émet K seule QUE si T[K] n'est pas un
//   objet (sinon la clef intermédiaire n'est pas une feuille).
// -----------------------------------------------------------------------------
export type Leaves<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${Leaves<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

type _result_1d = Leaves<typeof TRANSLATIONS>;

type _test_1d = Expect<Equal<
  _result_1d,
  | "common.ok" | "common.cancel"
  | "user.name"
  | "user.address.city" | "user.address.zip"
>>;

// -----------------------------------------------------------------------------
// Étape 2 — Get : résolution d'un chemin en son type de valeur
// -----------------------------------------------------------------------------
export type Get<T, P extends string> =
  P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? Get<T[K], Rest>
      : never
    : P extends keyof T
      ? T[P]
      : never;

type _result_2_city = Get<typeof TRANSLATIONS, "user.address.city">;
type _result_2_ok = Get<typeof TRANSLATIONS, "common.ok">;

type _test_2 = [
  Expect<Equal<_result_2_city, "Ville">>,
  Expect<Equal<_result_2_ok, "OK">>,
];

// -----------------------------------------------------------------------------
// Étape 3 — t() typesafe
//   - `const P` pour préserver le littéral côté appelant (sans `as const`)
//   - retour typé Get<typeof TRANSLATIONS, P> → littéral exact ("Ville")
// -----------------------------------------------------------------------------
export function t<const P extends Leaves<typeof TRANSLATIONS>>(
  key: P,
): Get<typeof TRANSLATIONS, P> {
  return key
    .split(".")
    .reduce<any>((acc, k) => acc?.[k], TRANSLATIONS);
}

// Cas d'utilisation
const city = t("user.address.city"); // type "Ville" (littéral !)
const ok = t("common.ok");            // type "OK"
console.log(city, ok);

// t("user.adress.city");             // ❌ Type '"user.adress.city"' is not assignable...
// t("user");                         // ❌ "user" n'appartient pas à Leaves<...>
// t("user.name.foo");                // ❌ chemin invalide
