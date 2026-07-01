import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Paths
const unpackedDir = "g:/iit/hitaishi/public/unpacked";
const animationsDir = path.join(unpackedDir, "animations");
const files = fs.readdirSync(animationsDir);
const jsonFilePath = path.join(animationsDir, files[0]);

// Read Lottie JSON
const lottieData = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
console.log("Original layers count:", lottieData.layers.length);

// Filter out "Shape Layer 1" (which draws the solid white background)
const originalLayers = lottieData.layers;
lottieData.layers = originalLayers.filter((layer) => layer.nm !== "Shape Layer 1");
console.log("Modified layers count:", lottieData.layers.length);

// Save Lottie JSON back
fs.writeFileSync(jsonFilePath, JSON.stringify(lottieData), "utf8");
console.log("Saved transparent Lottie JSON.");
