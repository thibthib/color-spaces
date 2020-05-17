import { sRGB, sRGBToXYZ, XYZTosRGB } from "./sRGB";
import { XYZ } from "./XYZ";
import { ColorSpace } from "../color-spaces";

export type HSL = {
  type: ColorSpace.HSL;
  values: [number, number, number];
};

const hueToRgb = (t1: number, t2: number, hue: number): number => {
  if (hue < 0) hue += 6;
  if (hue >= 6) hue -= 6;

  if (hue < 1) return (t2 - t1) * hue + t1;
  else if (hue < 3) return t2;
  else if (hue < 4) return (t2 - t1) * (4 - hue) + t1;
  else return t1;
};

// this is straight from the CSS Color 4 spec
// 	For simplicity, this algorithm assumes that the hue has been normalized
//  to a number in the half-open range [0, 6), and the saturation and lightness
//  have been normalized to the range [0, 1]. It returns an array of three numbers
//  representing the red, green, and blue channels of the colors,
//  normalized to the range [0, 1]
const HSLTosRGB = (color: HSL): sRGB => {
  const [hue, sat, light] = color.values;
  if (light <= 0.5) {
    var t2 = light * (sat + 1);
  } else {
    var t2 = light + sat - light * sat;
  }
  var t1 = light * 2 - t2;
  var r = hueToRgb(t1, t2, hue + 2);
  var g = hueToRgb(t1, t2, hue);
  var b = hueToRgb(t1, t2, hue - 2);
  return {
    type: ColorSpace.sRGB,
    values: [r, g, b],
  };
};

const sRGBToHSL = (color: sRGB): HSL => {
  const [r, g, b] = color.values;
  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b);
  let cmax = Math.max(r, g, b);
  let delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  // Calculate hue
  // No difference
  if (delta == 0) h = 0;
  // Red is max
  else if (cmax == r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  // Make negative hues positive behind 360°
  if (h < 0) h += 6;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    type: ColorSpace.HSL,
    values: [h, s, l],
  };
};

export const HSLToXYZ = (color: HSL): XYZ => sRGBToXYZ(HSLTosRGB(color));
export const XYZToHSL = (color: XYZ): HSL => sRGBToHSL(XYZTosRGB(color));
