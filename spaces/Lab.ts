import { XYZ } from "./XYZ";
import { ColorSpace } from "../color-spaces";

export type Lab = {
  type: ColorSpace.Lab;
  values: [number, number, number];
};

const Îµ = 216 / 24389; // 6^3/29^3
const Îº = 24389 / 27; // 29^3/3^3
const white = [0.96422, 1.0, 0.82521]; // D50 reference white

// Assuming XYZ is relative to D50, convert to CIE Lab
// from CIE standard, which now defines these as a rational fraction
export const XYZToLab = (color: XYZ): Lab => {
  // compute xyz, which is XYZ scaled relative to reference white
  const xyz = color.values.map((value, i) => value / white[i]);

  // now compute f
  const f = xyz.map((value) =>
    value > Îµ ? Math.cbrt(value) : (Îº * value + 16) / 116
  );

  return {
    type: ColorSpace.Lab,
    values: [
      116 * f[1] - 16, // L
      500 * (f[0] - f[1]), // a
      200 * (f[1] - f[2]), // b
    ],
  };
};

// Convert Lab to D50-adapted XYZ
// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
export const LabToXYZ = (color: Lab): XYZ => {
  const [L, a, b] = color.values;
  const f = [];

  // compute f, starting with the luminance-related term
  f[1] = (L + 16) / 116;
  f[0] = a / 500 + f[1];
  f[2] = f[1] - b / 200;

  // Compute XYZ by scaling xyz by reference white
  return {
    type: ColorSpace.XYZ,
    values: [
      white[0] *
        (Math.pow(f[0], 3) > Îµ ? Math.pow(f[0], 3) : (116 * f[0] - 16) / Îº),
      white[1] * (L > Îº * Îµ ? Math.pow((L + 16) / 116, 3) : L / Îº),
      white[2] *
        (Math.pow(f[2], 3) > Îµ ? Math.pow(f[2], 3) : (116 * f[2] - 16) / Îº),
    ],
  };
};
