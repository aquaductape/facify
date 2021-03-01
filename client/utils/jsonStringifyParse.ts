export function JSON_Stringify_Parse<T>(input: T): T;
export function JSON_Stringify_Parse<T>(input: T[]): T[] {
  return JSON.parse(JSON.stringify(input));
}
