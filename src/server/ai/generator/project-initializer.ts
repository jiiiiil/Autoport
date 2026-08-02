// @ts-nocheck
import type { GeneratorContext, GeneratedFile } from "./types";

export function generateProjectFiles(ctx: GeneratorContext): GeneratedFile[] {
  const { manifest } = ctx;

  const readme: GeneratedFile = {
    path: "README.md",
    content: `# ${manifest.projectManifest.name}

A ${manifest.blueprint.profession} portfolio built with ${manifest.blueprint.framework} and ${manifest.blueprint.styling}.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Scripts

| Command | Description |
|---------|-------------|
| \`npm run dev\` | Start development server |
| \`npm run build\` | Build for production |
| \`npm start\` | Start production server |
| \`npm run lint\` | Run linter |

## Tech Stack

- **Framework:** ${manifest.blueprint.framework}
- **Language:** ${manifest.blueprint.language}
- **Styling:** ${manifest.blueprint.styling}
- **Animation:** ${manifest.blueprint.animations.library}
- **Icons:** ${manifest.blueprint.libraries.icons.join(", ")}

## Project Structure

\`\`\`
${manifest.projectManifest.fileStructure.srcDir}/
├── ${manifest.projectManifest.fileStructure.componentsDir.split("/").pop()}/     # React components
│   └── sections/  # Page sections
├── ${manifest.projectManifest.fileStructure.hooksDir.split("/").pop()}/       # Custom hooks
├── ${manifest.projectManifest.fileStructure.libDir.split("/").pop()}/         # Libraries & providers
├── ${manifest.projectManifest.fileStructure.stylesDir.split("/").pop()}/       # Global styles
├── ${manifest.projectManifest.fileStructure.typesDir.split("/").pop()}/        # TypeScript types
└── ${manifest.projectManifest.fileStructure.utilsDir.split("/").pop()}/       # Utility functions
\`\`\`
`,
    type: "config",
  };

  return [readme];
}
