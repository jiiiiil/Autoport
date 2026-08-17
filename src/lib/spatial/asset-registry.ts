export type SpatialAssetCategory = "character" | "technology" | "object" | "ui";

export interface SpatialAssetItem {
  id: string;
  name: string;
  category: SpatialAssetCategory;
  svgIcon?: string;
  pose?: string;
  defaultScale?: number;
}

export const SPATIAL_ASSET_REGISTRY: Record<string, SpatialAssetItem> = {
  // Developer Character Poses
  "developer-idle": { id: "developer-idle", name: "Developer (Idle)", category: "character", pose: "idle", defaultScale: 1 },
  "developer-coding": { id: "developer-coding", name: "Developer (Coding)", category: "character", pose: "coding", defaultScale: 1 },
  "developer-pointing": { id: "developer-pointing", name: "Developer (Pointing)", category: "character", pose: "pointing", defaultScale: 1 },
  "developer-walking": { id: "developer-walking", name: "Developer (Walking)", category: "character", pose: "walking", defaultScale: 1 },
  "developer-celebrating": { id: "developer-celebrating", name: "Developer (Celebrating)", category: "character", pose: "celebrating", defaultScale: 1 },

  // Tech Icons & Objects
  react: { id: "react", name: "React.js", category: "technology", defaultScale: 1 },
  node: { id: "node", name: "Node.js", category: "technology", defaultScale: 1 },
  mongodb: { id: "mongodb", name: "MongoDB", category: "technology", defaultScale: 1 },
  express: { id: "express", name: "Express.js", category: "technology", defaultScale: 1 },
  javascript: { id: "javascript", name: "JavaScript", category: "technology", defaultScale: 1 },
  typescript: { id: "typescript", name: "TypeScript", category: "technology", defaultScale: 1 },
  html: { id: "html", name: "HTML5", category: "technology", defaultScale: 1 },
  css: { id: "css", name: "CSS3", category: "technology", defaultScale: 1 },
  git: { id: "git", name: "Git", category: "technology", defaultScale: 1 },
  github: { id: "github", name: "GitHub", category: "technology", defaultScale: 1 },
  s3: { id: "s3", name: "AWS S3 / Cloud", category: "technology", defaultScale: 1 },

  // Hardware & Spatial Objects
  laptop: { id: "laptop", name: "MacBook Pro Laptop", category: "object", defaultScale: 1 },
  desktop: { id: "desktop", name: "3D Desktop Setup", category: "object", defaultScale: 1 },
  phone: { id: "phone", name: "Cyber Phone", category: "object", defaultScale: 1 },
  keyboard: { id: "keyboard", name: "Mechanical Keyboard", category: "object", defaultScale: 1 },
  codepanel: { id: "codepanel", name: "Code IDE Panel", category: "ui", defaultScale: 1 },
  rocket: { id: "rocket", name: "Launch Rocket", category: "object", defaultScale: 1 },
  graduation: { id: "graduation", name: "Graduation Cap", category: "object", defaultScale: 1 },
  books: { id: "books", name: "Stack of Books", category: "object", defaultScale: 1 },
  certificate: { id: "certificate", name: "Verified Credential", category: "object", defaultScale: 1 },
  cloud: { id: "cloud", name: "Cloud Infrastructure", category: "object", defaultScale: 1 },
  database: { id: "database", name: "Database Node", category: "object", defaultScale: 1 },
  globe: { id: "globe", name: "Spatial Globe", category: "object", defaultScale: 1 },
  target: { id: "target", name: "Target Goal", category: "object", defaultScale: 1 },
  trophy: { id: "trophy", name: "Award Trophy", category: "object", defaultScale: 1 },
};

export function getSpatialAsset(id: string): SpatialAssetItem {
  return SPATIAL_ASSET_REGISTRY[id] || SPATIAL_ASSET_REGISTRY["laptop"];
}
