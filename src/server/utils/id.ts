import { v4 as uuidv4 } from "uuid";

export function generateId(): string {
  return uuidv4();
}

export function generateSlug(): string {
  const adjectives = ["swift", "bright", "cool", "bold", "calm", "dark", "eager", "fair", "glad", "keen"];
  const nouns = ["tiger", "eagle", "river", "stone", "flame", "storm", "cloud", "field", "ocean", "star"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 9000 + 1000);
  return `${adj}-${noun}-${num}`;
}
