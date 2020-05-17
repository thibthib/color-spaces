import { sRGB, sRGBToXYZ, XYZTosRGB } from "./sRGB";
import { XYZ } from "./XYZ";
import { ColorSpace } from "../color-spaces";

export type CMYK = {
  type: ColorSpace.CMYK;
  values: [number, number, number, number];
};

// CMYK is an array of four values
// in the range [0.0, 1.0]
// the optput is an array of [RGB]
// also in the [0.0, 1.0] range
// because the naive algorithm does not generate out of gamut colors
// neither does it generate accurate simulations of practical CMYK colors
const CMYKTosRGB = (color: CMYK): sRGB => {
  const [cyan, magenta, yellow, black] = color.values;

  var red = 1 - Math.min(1, cyan * (1 - black) + black);
  var green = 1 - Math.min(1, magenta * (1 - black) + black);
  var blue = 1 - Math.min(1, yellow * (1 - black) + black);

  return {
    type: ColorSpace.sRGB,
    values: [red, green, blue],
  };
};

// RGB is an array of three values
// in the range [0.0, 1.0]
// the output is an array of [CMYK]
// also in the [0.0, 1.0] range
// with maximum GCR and (I think) 200% TAC
// the naive algorithm does not generate out of gamut colors
// neither does it generate accurate simulations of practical CMYK colors
const sRGBToCMYK = (color: sRGB): CMYK => {
  const [red, green, blue] = color.values;

  var black = 1 - Math.max(red, green, blue);
  var cyan = black == 1.0 ? 0 : (1 - red - black) / (1 - black);
  var magenta = black == 1.0 ? 0 : (1 - green - black) / (1 - black);
  var yellow = black == 1.0 ? 0 : (1 - blue - black) / (1 - black);

  return { type: ColorSpace.CMYK, values: [cyan, magenta, yellow, black] };
};

export const CMYKToXYZ = (color: CMYK): XYZ => sRGBToXYZ(CMYKTosRGB(color));
export const XYZToCMYK = (color: XYZ): CMYK => sRGBToCMYK(XYZTosRGB(color));
