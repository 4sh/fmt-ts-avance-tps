// =============================================================================
// TP 5.1 - Partie 1 : typer des clefs d'internationalisation (i18n)
// =============================================================================
//
// Contexte : l'objet TRANSLATIONS contient les libellés de l'application, sous
// forme arborescente. La fonction t(key) permet de récupérer un libellé depuis
// son chemin ("user.address.city"). Aujourd'hui, elle accepte n'importe quelle
// string : une typo n'est détectée qu'au runtime, aucune autocomplétion.
//
// Objectif : rendre t() typesafe en dérivant un type depuis la valeur
// TRANSLATIONS elle-même (source de vérité unique).
//
// On progresse par petites étapes :
//   1a. TopKeys<T>        → clefs de premier niveau seulement
//   1b. Depth2KeysMap<T>  → structure intermédiaire clef → sous-chemin
//                           puis on en déduit Depth2Keys<T> à plat
//   1c. Paths<T>          → tous les chemins possibles, quelle que soit la
//                           profondeur (intermédiaires + feuilles)
//   1d. Leaves<T>         → uniquement les chemins-feuilles
//
//   2.  Get<T, P>         → résoudre le type de la valeur pointée par un chemin
//
//   3.  t()               → assembler le tout pour rendre la fonction typesafe
//
// Chaque étape possède son propre test `Expect<Equal<...>>` juste en dessous :
// tant qu'un test est rouge, l'étape n'est pas résolue.
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
// TODO Étape 1a — TopKeys<T> : clefs de premier niveau uniquement
//   Attendu : TopKeys<typeof TRANSLATIONS> = "common" | "user"
//   Astuce : il faut utiliser `keyof`.
// -----------------------------------------------------------------------------
export type TopKeys<T> = never; // à remplacer

// Résultat "under test" : hover sur `_result_1a` pour voir le type calculé
type _result_1a = TopKeys<typeof TRANSLATIONS>;

type _test_1a = Expect<Equal<
  _result_1a,
  "common" | "user"
>>;

// -----------------------------------------------------------------------------
// TODO Étape 1b — Depth2KeysMap<T> puis Depth2Keys<T>
//   Attendu Depth2KeysMap: Depth2KeysMap<typeof TRANSLATION> = {
//     (readonly) "common": "common.ok" | "common.cancel",
//     (readonly) "user": "user.name" | "user.address"
//   }
//   Astuce Depth2KeysMap: Mapped Type sur les clefs + template literal `${K}.${SousClef}`
//   Question: d'où viennent les readonly ? comment les enlever ?
//
//   Attendu Depth2Keys: "common.ok" | "common.cancel" | "user.name" | "user.address"
//   Astuce Depth2Keys: extraire les valeurs de l'objet Depth2KeysMap<T>
// -----------------------------------------------------------------------------
export type Depth2KeysMap<T> = never; // à remplacer (structure intermédiaire)

// Résultat "under test" : hover sur `_result_1b_map` pour voir la structure
type _result_1b_map = Depth2KeysMap<typeof TRANSLATIONS>;

type _test_1b_map = Expect<Equal<
  _result_1b_map,
  {
    readonly "common": "common.ok" | "common.cancel",
    readonly "user": "user.name" | "user.address"
  }
>>;

export type Depth2Keys<T> = never; // à remplacer (union à plat)

// Résultat "under test" : hover sur `_result_1b` pour voir le type calculé
type _result_1b = Depth2Keys<typeof TRANSLATIONS>;

type _test_1b = Expect<Equal<
  _result_1b,
  "common.ok" | "common.cancel" | "user.name" | "user.address"
>>;

// -----------------------------------------------------------------------------
// TODO Étape 1c — Paths<T> : tous les chemins possibles (récursif)
//   Attendu : Paths<typeof TRANSLATIONS> =
//     | "common" | "common.ok" | "common.cancel"
//     | "user" | "user.name"
//     | "user.address" | "user.address.city" | "user.address.zip"
//   Astuce : passer de Depth2Keys à Paths, c'est remplacer `keyof T[K]` par un
//   appel récursif à Paths<T[K]>. Cas d'arrêt : quand T n'est pas un objet.
//   Pour chaque clef K, on veut à la fois :
//     - K seule (chemin intermédiaire)
//     - concaténation de K et Paths<T[K]> (sous-chemins)
// -----------------------------------------------------------------------------
export type Paths<T> = never; // à remplacer

// Résultat "under test" : hover sur `_result_1c` pour voir le type calculé
type _result_1c = Paths<typeof TRANSLATIONS>;

type _test_1c = Expect<Equal<
  _result_1c,
  | "common" | "common.ok" | "common.cancel"
  | "user" | "user.name"
  | "user.address" | "user.address.city" | "user.address.zip"
>>;

// -----------------------------------------------------------------------------
// TODO Étape 1d — Leaves<T> : uniquement les chemins-feuilles
//   Attendu : Leaves<typeof TRANSLATIONS> =
//     "common.ok" | "common.cancel"
//     | "user.name"
//     | "user.address.city" | "user.address.zip"
//   Astuce : reprendre Paths et ne PAS générer la branche "K seule" quand T[K]
//   est un objet (dans ce cas seuls les sous-chemins sont des feuilles).
// -----------------------------------------------------------------------------
export type Leaves<T> = never; // à remplacer

// Résultat "under test" : hover sur `_result_1d` pour voir le type calculé
type _result_1d = Leaves<typeof TRANSLATIONS>;

type _test_1d = Expect<Equal<
  _result_1d,
  | "common.ok" | "common.cancel"
  | "user.name"
  | "user.address.city" | "user.address.zip"
>>;

// -----------------------------------------------------------------------------
// TODO Étape 2 — Get<T, P> : résoudre la valeur pointée par un chemin
//   Attendu : Get<typeof TRANSLATIONS, "user.address.city"> = "Ville"
//   Astuce : `P extends \`${infer K}.${infer Rest}\`` + récursion sur Rest.
//   Cas de base : P est une clef directe de T.
// -----------------------------------------------------------------------------
export type Get<T, P extends string> = unknown; // à remplacer

// Résultats "under test" : hover pour voir les types calculés
type _result_2_city = Get<typeof TRANSLATIONS, "user.address.city">;
type _result_2_ok = Get<typeof TRANSLATIONS, "common.ok">;

type _test_2 = [
  Expect<Equal<_result_2_city, "Ville">>,
  Expect<Equal<_result_2_ok, "OK">>,
];

// -----------------------------------------------------------------------------
// TODO Étape 3 — typer la fonction t
//   - le paramètre `key` doit être contraint à Leaves<typeof TRANSLATIONS>
//   - le retour doit utiliser le type Get qu'on a défini précédemment
//   - conseil : `<const P extends ...>` pour préserver le littéral côté appelant
// -----------------------------------------------------------------------------
export function t(key: string): string {
  return key
    .split(".")
    .reduce<any>((acc, k) => acc?.[k], TRANSLATIONS);
}

// Cas d'utilisation (à décommenter une fois t() typée)
// const city = t("user.address.city");    // devrait être typé "Ville" (littéral)
// const ok   = t("common.ok");            // devrait être typé "OK"

// t("user.adress.city");                  // ❌ (typo) doit ÊTRE une erreur de compilation
// t("user");                              // ❌ ce n'est pas une feuille
// t("user.name.foo");                     // ❌ chemin invalide
