import { ColorSpace, isRGBBased, CSSSpace } from "../color-spaces";
import { parse } from "./parse";
import { convertColorToSpace } from "../spaces/convertColorToSpace";
import { stringify } from "./stringify";
import { forceIntoGamut } from "./gamut-correction";

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
