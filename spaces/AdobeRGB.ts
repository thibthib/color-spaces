import { XYZ } from "./XYZ";
import { updateValues, applyMatrix } from "./utilities";
import { ColorSpace } from "../color-spaces";

export type AdobeRGB = {
  type: ColorSpace.AdobeRGB;
  values: [number, number, number];
};

// convert an array of a98-rgb values in the range 0.0 - 1.0
// to linear light (un-companded) form.
// negative values are also now accepted
const AdobeRGBToLinear = (color: AdobeRGB): AdobeRGB =>
  updateValues(
    color,
    (value) => Math.pow(Math.abs(value), 563 / 256) * Math.sign(value)
  );

// convert an array of linear-light a98-rgb  in the range 0.0-1.0
// to gamma corrected form
// negative values are also now accepted
const AdobeRGBToGamma = (color: AdobeRGB): AdobeRGB =>
  updateValues(
    color,
    (value) => Math.pow(Math.abs(value), 256 / 563) * Math.sign(value)
  );

// convert an array of linear-light a98-rgb values to CIE XYZ
// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
// has greater numerical precision than section 4.3.5.3 of
// https://www.adobe.com/digitalimag/pdfs/AdobeRGB1998.pdf
// but the values below were calculated from first principles
// from the chromaticity coordinates of R G B W
// see matrixmaker.html
const linearAdobeRGBToXYZ = (color: AdobeRGB): XYZ => ({
  type: ColorSpace.XYZ,
  values: applyMatrix(color.values, [
    [0.5766690429101305, 0.1855582379065463, 0.1882286462349947],
    [0.29734497525053605, 0.6273635662554661, 0.07529145849399788],
    [0.02703136138641234, 0.07068885253582723, 0.9913375368376388],
  ]),
});

// convert XYZ to linear-light a98-rgb
const XYZToLinearAdobeRGB = (color: XYZ): AdobeRGB => ({
  type: ColorSpace.AdobeRGB,
  values: applyMatrix(color.values, [
    [2.0415879038107465, -0.5650069742788596, -0.34473135077832956],
    [-0.9692436362808795, 1.8759675015077202, 0.04155505740717557],
    [0.013444280632031142, -0.11836239223101838, 1.0151749943912054],
  ]),
});

export const AdobeRGBToXYZ = (color: AdobeRGB): XYZ =>
  linearAdobeRGBToXYZ(AdobeRGBToLinear(color));

export const XYZToAdobeRGB = (color: XYZ): AdobeRGB =>
  AdobeRGBToGamma(XYZToLinearAdobeRGB(color));
