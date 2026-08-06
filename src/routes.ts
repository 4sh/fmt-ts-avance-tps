// =============================================================================
// TP 5.1 - Partie 2 : SOLUTION
// =============================================================================

import type { Equal, Expect } from "./type-tests.ts";

export const ROUTES = [
  "/settings",
  "/users/:userId",
  "/users/:userId/posts/:postId",
] as const;

export type RoutePattern = typeof ROUTES[number];

// -----------------------------------------------------------------------------
// Étape 1a — LastParam : nom du paramètre en fin de chaîne
//   Le pattern `${string}:${infer P}` capture tout ce qui suit le dernier `:`
//   grâce à la nature "gourmande" de `${string}`.
// -----------------------------------------------------------------------------
export type LastParam<S extends string> =
  S extends `${string}:${infer P}` ? P : never;

type _result_1a_settings = LastParam<"/settings">;
type _result_1a_users = LastParam<"/users/:userId">;

type _test_1a = [
  Expect<Equal<_result_1a_settings, never>>,
  Expect<Equal<_result_1a_users, "userId">>,
];

// -----------------------------------------------------------------------------
// Étape 1b — ExtractParams : tous les noms de paramètres
//   L'étape 1a ne gère qu'un seul paramètre. Pour "/users/:userId/posts/:postId"
//   on veut l'union "userId" | "postId".
//
//   Astuce : distinguer deux cas via des patterns template literal, et récurser
//   sur la portion de chaîne qui reste à traiter.
//   Astuce: `${string}:` est "glouton": il consommera tous les ":" sauf le dernier
//
//   SOLUTION:
//   Deux cas :
//     - le paramètre est suivi d'un "/" : on capture P puis on récurse sur Rest
//     - le paramètre est en fin de chaîne : cas terminal (comme LastParam)
// -----------------------------------------------------------------------------
export type ExtractParams<S extends string> =
  S extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<Rest>
    : S extends `${string}:${infer Param}`
      ? Param
      : never;

type _result_1b_settings = ExtractParams<"/settings">;
type _result_1b_users = ExtractParams<"/users/:userId">;
type _result_1b_posts = ExtractParams<"/users/:userId/posts/:postId">;

type _test_1b = [
  Expect<Equal<_result_1b_settings, never>>,
  Expect<Equal<_result_1b_users, "userId">>,
  Expect<Equal<_result_1b_posts, "userId" | "postId">>,
];

// -----------------------------------------------------------------------------
// Étape 2 — ParamsOf : objet des paramètres attendus
//   Mapped Type sur l'union renvoyée par ExtractParams.
// -----------------------------------------------------------------------------
export type ParamsOf<P extends string> = ExtractParams<P> extends never
  ? never
  : { [K in ExtractParams<P>]: string };

type _result_2_settings = ParamsOf<"/settings">;
type _result_2_users = ParamsOf<"/users/:userId">;
type _result_2_posts = ParamsOf<"/users/:userId/posts/:postId">;

type _test_2 = [
  Expect<Equal<_result_2_settings, never>>,
  Expect<Equal<_result_2_users, { userId: string }>>,
  Expect<Equal<_result_2_posts, { userId: string; postId: string }>>,
];

// -----------------------------------------------------------------------------
// Étape 3 — navigate() typesafe
//   À faire en deux temps :
//     (a) Version simple : `params` est toujours passé
//         → décommentez toutes les lignes et vérifier les expectations en commentaire
//         → problème : navigate("/settings", { foo: "bar" }) est passant alors qu'il ne devrait pas
//
//     (b) Modifier ParamsOf pour faire en sorte d'avoir never lorsqu'aucun paramètre n'est attendu
// -----------------------------------------------------------------------------
export function navigate<P extends RoutePattern>(path: P, params?: ParamsOf<P>): void {
  const paramsRecords = (params ?? {}) as Record<string, string>;
  const url = path.replace(/:(\w+)/g, (_, k) => paramsRecords[k] ?? `:${k}`);
  console.log("→", url);
}

// -----------------------------------------------------------------------------
// Cas d'utilisation
// -----------------------------------------------------------------------------

navigate("/settings");                                          // ✅
navigate("/users/:userId", { userId: "42" });                   // ✅
navigate("/users/:userId/posts/:postId", {                      // ✅
  userId: "1",
  postId: "10",
});

// navigate("/users/:userId", { id: "42" });                    // ❌ mauvais nom
// navigate("/users/:userId/posts/:postId", { userId: "1" });   // ❌ postId manquant
// navigate("/unknown");                                        // ❌ route inconnue
// navigate("/settings", { foo: "bar" });                       // ❌ pas de params attendus
