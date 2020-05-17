import { ColorSpace, isRGBBased, CSSSpace } from "../color-spaces";
import { parse } from "./parse";
import { LCH } from "../color";
import { convertColorToSpace } from "../spaces/convertColorToSpace";
import { stringify } from "./stringify";
import { forceIntoGamut } from "./gamut-correction";

const startLCH = parse("lch(60% 67 266)") as LCH;
const endLCH = parse("lch(79% 73 175)") as LCH;

export const convertCSSColor = (colorString: string, to: CSSSpace) => {
  let color = parse(colorString);

  if (color === null) {
    return null;
  }

  if (color.type === ColorSpace.LCH && isRGBBased(to)) {
    color = forceIntoGamut(color, to);
  }

  const converted = convertColorToSpace(color, to);
  return stringify(converted);
};
