import { applyMatrix } from "./utilities";
import { ColorSpace } from "../color-spaces";

export type XYZ = {
  type: ColorSpace.XYZ;
  // x chroma (~red+green), y luminance, z chroma (~blue)
  values: [number, number, number];
};

// Bradford chromatic adaptation from D65 to D50
// The matrix below is the result of three operations:
// - convert from XYZ to retinal cone domain
// - scale components from one reference white to another
// - convert back to XYZ
// http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html
export const D65ToD50 = (color: XYZ): XYZ => ({
  type: ColorSpace.XYZ,
  values: applyMatrix(color.values, [
    [1.0478112, 0.0228866, -0.050127],
    [0.0295424, 0.9904844, -0.0170491],
    [-0.0092345, 0.0150436, 0.7521316],
  ]),
});

// Bradford chromatic adaptation from D50 to D65
export const D50ToD65 = (color: XYZ): XYZ => ({
  type: ColorSpace.XYZ,
  values: applyMatrix(color.values, [
    [0.9555766, -0.0230393, 0.0631636],
    [-0.0282895, 1.0099416, 0.0210077],
    [0.0122982, -0.020483, 1.3299098],
  ]),
});
