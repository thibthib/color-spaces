import { XYZ } from "./XYZ";
import { updateValues, applyMatrix } from "./utilities";
import { ColorSpace } from "../color-spaces";

export type Rec2020 = {
  type: ColorSpace.Rec2020;
  values: [number, number, number];
};

const Î = 1.09929682680944;
const Î2 = 0.018053968510807;

// convert an array of rec2020 RGB values in the range 0.0 - 1.0
// to linear light (un-companded) form.
//check with standard this really is 2.4 and 1/2.4, not 0.45 was wikipedia claims
const Rec2020ToLinear = (color: Rec2020): Rec2020 =>
  updateValues(color, (value) =>
    value < Î2 * 4.5 ? value / 4.5 : Math.pow((value + Î - 1) / Î, 2.4)
  );

// convert an array of linear-light rec2020 RGB  in the range 0.0-1.0
// to gamma corrected form
const Rec2020ToGamma = (color: Rec2020): Rec2020 =>
  updateValues(color, (value) =>
    value > Î2 ? Î * Math.pow(value, 1 / 2.4) - (Î - 1) : 4.5 * value
  );

// convert an array of linear-light rec2020 values to CIE XYZ
// using  D65 (no chromatic adaptation)
// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
const linearRec2020ToXYZ = (color: Rec2020): XYZ => ({
  type: ColorSpace.XYZ,
  values: applyMatrix(color.values, [
    [0.6369580483012914, 0.14461690358620832, 0.1688809751641721],
    [0.2627002120112671, 0.6779980715188708, 0.05930171646986196],
    [0.0, 0.028072693049087428, 1.060985057710791],
  ]),
});

// convert XYZ to linear-light rec2020
const XYZToLinearRec2020 = (color: XYZ): Rec2020 => ({
  type: ColorSpace.Rec2020,
  values: applyMatrix(color.values, [
    [1.7166511879712674, -0.35567078377639233, -0.25336628137365974],
    [-0.6666843518324892, 1.6164812366349395, 0.01576854581391113],
    [0.017639857445310783, -0.042770613257808524, 0.9421031212354738],
  ]),
});

export const Rec2020ToXYZ = (color: Rec2020): XYZ =>
  linearRec2020ToXYZ(Rec2020ToLinear(color));

export const XYZToRec2020 = (color: XYZ): Rec2020 =>
  Rec2020ToGamma(XYZToLinearRec2020(color));
