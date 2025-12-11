// src/types/global.d.ts
// Re-export semua types utama
export * from "./api/response.types.ts";
export * from "./api/auth.types.ts";
export * from "./save/master/user.types.ts";

// Global utility types
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
interface JsonArray extends Array<JsonValue> {}

// Environment types
type NodeEnv = "development" | "production" | "test";
