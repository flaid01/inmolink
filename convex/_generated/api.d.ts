/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as comparisons from "../comparisons.js";
import type * as favorites from "../favorites.js";
import type * as http from "../http.js";
import type * as importData from "../importData.js";
import type * as properties from "../properties.js";
import type * as router from "../router.js";
import type * as sampleData from "../sampleData.js";
import type * as seed from "../seed.js";
import type * as storage from "../storage.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  auth: typeof auth;
  comparisons: typeof comparisons;
  favorites: typeof favorites;
  http: typeof http;
  importData: typeof importData;
  properties: typeof properties;
  router: typeof router;
  sampleData: typeof sampleData;
  seed: typeof seed;
  storage: typeof storage;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
