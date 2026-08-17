import type { PortfolioObject } from "@/lib/portfolio/types";
import { getSpatialAsset, type SpatialAssetItem } from "./asset-registry";

export interface MappedSpatialScene {
  characterPose: string;
  primaryObjects: SpatialAssetItem[];
  secondaryObjects: SpatialAssetItem[];
  techObjects: SpatialAssetItem[];
}

export function mapPortfolioToSpatialAssets(portfolio: PortfolioObject): MappedSpatialScene {
  const skills = portfolio.sections?.skills || [];
  const skillNames = skills.map((s) => s.name.toLowerCase());

  const techObjects: SpatialAssetItem[] = [];

  const addTechIfMatches = (keyword: string, assetId: string) => {
    if (skillNames.some((s) => s.includes(keyword))) {
      techObjects.push(getSpatialAsset(assetId));
    }
  };

  addTechIfMatches("react", "react");
  addTechIfMatches("node", "node");
  addTechIfMatches("mongo", "mongodb");
  addTechIfMatches("express", "express");
  addTechIfMatches("script", "javascript");
  addTechIfMatches("type", "typescript");
  addTechIfMatches("html", "html");
  addTechIfMatches("css", "css");
  addTechIfMatches("git", "git");
  addTechIfMatches("aws", "s3");

  if (techObjects.length === 0) {
    techObjects.push(getSpatialAsset("react"), getSpatialAsset("node"), getSpatialAsset("javascript"));
  }

  const primaryObjects: SpatialAssetItem[] = [
    getSpatialAsset("laptop"),
    getSpatialAsset("codepanel"),
  ];

  const secondaryObjects: SpatialAssetItem[] = [
    getSpatialAsset("phone"),
    getSpatialAsset("cloud"),
    getSpatialAsset("database"),
    getSpatialAsset("rocket"),
  ];

  return {
    characterPose: "developer-idle",
    primaryObjects,
    secondaryObjects,
    techObjects,
  };
}
