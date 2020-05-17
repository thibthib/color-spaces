import { XYZ } from "./XYZ";
import { updateValues, applyMatrix } from "./utilities";
import { ColorSpace } from "../color-spaces";

export type ProPhoto = {
  type: ColorSpace.ProPhoto;
  values: [number, number, number];
};

// convert an array of prophoto-rgb values in the range 0.0 - 1.0
// to linear light (un-companded) form.
// Transfer curve is gamma 1.8 with a small linear portion
// TODO for negative values, extend linear portion on reflection of axis, then add pow below that
const ProPhotoToLinear = (color: ProPhoto): ProPhoto =>
  updateValues(color, (value) =>
    value < 0.031248 ? value / 16 : Math.pow(value, 1.8)
  );

// convert an array of linear-light prophoto-rgb  in the range 0.0-1.0
// to gamma corrected form
// Transfer curve is gamma 1.8 with a small linear portion
// TODO for negative values, extend linear portion on reflection of axis, then add pow below that
const ProPhotoToGamma = (color: ProPhoto): ProPhoto =>
  updateValues(color, (value) =>
    value > 0.001953 ? Math.pow(value, 1 / 1.8) : 16 * value
  );

// convert an array of linear-light prophoto-rgb values to CIE XYZ
// using  D50 (so no chromatic adaptation needed afterwards)
// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
const linearProPhotoToXYZ = (color: ProPhoto): XYZ => ({
  type: ColorSpace.XYZ,
  values: applyMatrix(color.values, [
    [0.7977604896723027, 0.13518583717574031, 0.0313493495815248],
    [0.2880711282292934, 0.7118432178101014, 0.00008565396060525902],
    [0.0, 0.0, 0.8251046025104601],
  ]),
});

// convert XYZ to linear-light prophoto-rgb
const XYZToLinearProPhoto = (color: XYZ): ProPhoto => ({
  type: ColorSpace.ProPhoto,
  values: applyMatrix(color.values, [
    [1.3457989731028281, -0.25558010007997534, -0.05110628506753401],
    [-0.5446224939028347, 1.5082327413132781, 0.02053603239147973],
    [0.0, 0.0, 1.2119675456389454],
  ]),
});

export const ProPhotoToXYZ = (color: ProPhoto): XYZ =>
  linearProPhotoToXYZ(ProPhotoToLinear(color));

export const XYZToProPhoto = (color: XYZ): ProPhoto =>
  ProPhotoToGamma(XYZToLinearProPhoto(color));
