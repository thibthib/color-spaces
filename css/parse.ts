import { parse as colorParse } from "./color";
import { parse as hexadecimalParse } from "./hexadecimal";
import { parse as hslParse } from "./hsl";
import { parse as labParse } from "./lab";
import { parse as lchParse } from "./lch";
import { parse as rgbParse } from "./rgb";
import { CSSColor } from "../color";

export const parse = (color: string): CSSColor | null => {
  if (color.includes("color(")) {
    return colorParse(color);
  } else if (color.includes("hsl(")) {
    return hslParse(color);
  } else if (color.includes("lab(")) {
    return labParse(color);
  } else if (color.includes("lch(")) {
    return lchParse(color);
  } else if (color.startsWith("#")) {
    return hexadecimalParse(color);
  }
  return rgbParse(color);
};
