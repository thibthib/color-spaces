import { convertColorToSpace } from "../spaces/convertColorToSpace";
import { RGBBasedSpace } from "../color-spaces";
import { LCH } from "../spaces/LCH";

const isLCHWithinRGBSpace = (color: LCH, rgbSpace: RGBBasedSpace) => {
  const rgb = convertColorToSpace(color, rgbSpace);
  const ε = 0.000005;
  return rgb.values.reduce(
    (a: boolean, b: number) => a && b >= 0 - ε && b <= 1 + ε,
    true
  );
};

export const forceIntoGamut = (color: LCH, rgbSpace: RGBBasedSpace): LCH => {
  let [l, c, h] = color.values;
  // Moves an lch color into the sRGB gamut
  // by holding the l and h steady,
  // and adjusting the c via binary-search
  // until the color is on the sRGB boundary.
  if (isLCHWithinRGBSpace(color, rgbSpace)) {
    return color;
  }

  let hiC = c;
  let loC = 0;
  const ε = 0.0001;
  c /= 2;

  // .0001 chosen fairly arbitrarily as "close enough"
  while (hiC - loC > ε) {
    if (isLCHWithinRGBSpace({ ...color, values: [l, c, h] }, rgbSpace)) {
      loC = c;
    } else {
      hiC = c;
    }
    c = (hiC + loC) / 2;
  }

  return { ...color, values: [l, c, h] };
};
