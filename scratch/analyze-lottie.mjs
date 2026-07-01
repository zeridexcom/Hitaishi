import fs from "fs";
import path from "path";

const dir = "g:/iit/hitaishi/public/unpacked/animations";
const files = fs.readdirSync(dir);
const file = path.join(dir, files[0]);

const data = JSON.parse(fs.readFileSync(file, "utf8"));
console.log("Composition width:", data.w, "height:", data.h);
console.log("Total layers:", data.layers.length);

data.layers.forEach((l, index) => {
  console.log(`Layer ${index}: Name="${l.nm}" Type=${l.ty} (1=Solid, 3=Null, 4=Shape)`);
  if (l.ty === 4 && l.shapes) {
    l.shapes.forEach((s) => {
      if (s.it) {
        s.it.forEach((item) => {
          if (item.ty === "fl") {
            console.log(`  -> Fill Color (normalized RGB):`, item.c?.k);
          }
        });
      }
    });
  }
});
