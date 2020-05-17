import { Lab, XYZToLab, LabToXYZ } from "./Lab";
import { XYZ, D65ToD50, D50ToD65 } from "./XYZ";
import { ColorSpace } from "../color-spaces";

export type LCH = {
  type: ColorSpace.LCH;
  values: [number, number, number];
};

// Convert to polar form
const LabToLCH = (color: Lab): LCH => {
  const [L, a, b] = color.values;
  const hue = (Math.atan2(b, a) * 180) / Math.PI;
  return {
    type: ColorSpace.LCH,
    values: [
      L, // L is still L
      Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)), // Chroma
      hue >= 0 ? hue : hue + 360, // Hue, in degrees [0 to 360)
    ],
  };
};

// Convert from polar form
const LCHToLab = (color: LCH): Lab => {
  const [L, C, H] = color.values;
  return {
    type: ColorSpace.Lab,
    values: [
      L, // L is still L
      C * Math.cos((H * Math.PI) / 180), // a
      C * Math.sin((H * Math.PI) / 180), // b
    ],
  };
};

export const XYZToLCH = (color: XYZ): LCH =>
  LabToLCH(XYZToLab(D65ToD50(color)));

export const LCHToXYZ = (color: LCH): XYZ =>
  D50ToD65(LabToXYZ(LCHToLab(color)));
