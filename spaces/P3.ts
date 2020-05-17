import { XYZ } from "./XYZ";
import { valuetoLinear, valueToGamma } from "./sRGB";
import { applyMatrix, updateValues } from "./utilities";
import { ColorSpace } from "../color-spaces";

export type P3 = {
  type: ColorSpace.P3;
  values: [number, number, number];
};

// convert an array of display-p3 RGB values in the range 0.0 - 1.0
// to linear light (un-companded) form.
// same as sRGB
const P3ToLinear = (color: P3): P3 => updateValues(color, valuetoLinear);

// convert an array of linear-light display-p3 RGB  in the range 0.0-1.0
// to gamma corrected form
// same as sRGB
const P3ToGamma = (color: P3): P3 => updateValues(color, valueToGamma);

// convert an array of linear-light display-p3 values to CIE XYZ
// using  D65 (no chromatic adaptation)
// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
// 0 was computed as -3.972075516933488e-17
const linearP3ToXYZ = (color: P3): XYZ => ({
  type: ColorSpace.XYZ,
  values: applyMatrix(color.values, [
    [0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
    [0.2289745640697488, 0.6917385218365064, 0.079286914093745],
    [0.0, 0.04511338185890264, 1.043944368900976],
  ]),
});

// convert XYZ to linear-light P3
const XYZToLinearP3 = (color: XYZ): P3 => ({
  type: ColorSpace.P3,
  values: applyMatrix(color.values, [
    [2.493496911941425, -0.9313836179191239, -0.40271078445071684],
    [-0.8294889695615747, 1.7626640603183463, 0.023624685841943577],
    [0.03584583024378447, -0.07617238926804182, 0.9568845240076872],
  ]),
});

export const P3ToXYZ = (color: P3): XYZ => linearP3ToXYZ(P3ToLinear(color));
export const XYZToP3 = (color: XYZ): P3 => P3ToGamma(XYZToLinearP3(color));
