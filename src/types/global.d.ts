export * from "./api/response.types.js";
export * from "./api/auth.types.js";
export * from "./save/master/user.types.js";

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
