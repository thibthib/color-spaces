import { XYZ } from "./XYZ";
import { applyMatrix, updateValues } from "./utilities";
import { ColorSpace } from "../color-spaces";

export type sRGB = {
  type: ColorSpace.sRGB;
  values: [number, number, number];
};

// convert an array of sRGB values in the range 0.0 - 1.0
// to linear light (un-companded) form.
// https://en.wikipedia.org/wiki/SRGB
// TODO for negative values, extend linear portion on reflection of axis, then add pow below that
export const valuetoLinear = (value: number) =>
  value < 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

const sRGBToLinear = (color: sRGB): sRGB => updateValues(color, valuetoLinear);

// convert an array of linear-light sRGB values in the range 0.0-1.0
// to gamma corrected form
// https://en.wikipedia.org/wiki/SRGB
// TODO for negative values, extend linear portion on reflection of axis, then add pow below that
export const valueToGamma = (value: number) =>
  value > 0.0031308 ? 1.055 * Math.pow(value, 1 / 2.4) - 0.055 : 12.92 * value;

const sRGBToGamma = (color: sRGB): sRGB => updateValues(color, valueToGamma);

// convert an array of linear-light sRGB values to CIE XYZ
// using sRGB's own white, D65 (no chromatic adaptation)
// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
// also
// https://www.image-engineering.de/library/technotes/958-how-to-convert-between-srgb-and-ciexyz
const linearsRGBToXYZ = (color: sRGB): XYZ => ({
  type: ColorSpace.XYZ,
  values: applyMatrix(color.values, [
    [0.4124564, 0.3575761, 0.1804375],
    [0.2126729, 0.7151522, 0.072175],
    [0.0193339, 0.119192, 0.9503041],
  ]),
});

// convert XYZ to linear-light sRGB
const XYZToLinearsRGB = (color: XYZ): sRGB => ({
  type: ColorSpace.sRGB,
  values: applyMatrix(color.values, [
    [3.2404542, -1.5371385, -0.4985314],
    [-0.969266, 1.8760108, 0.041556],
    [0.0556434, -0.2040259, 1.0572252],
  ]),
});

export const sRGBToXYZ = (color: sRGB): XYZ =>
  linearsRGBToXYZ(sRGBToLinear(color));

export const XYZTosRGB = (color: XYZ): sRGB =>
  sRGBToGamma(XYZToLinearsRGB(color));
