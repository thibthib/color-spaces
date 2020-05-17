import { AdobeRGB, AdobeRGBToXYZ, XYZToAdobeRGB } from "./AdobeRGB";
import { CMYK, CMYKToXYZ, XYZToCMYK } from "./CMYK";
import { HSL, HSLToXYZ, XYZToHSL } from "./HSL";
import { Lab, LabToXYZ, XYZToLab } from "./Lab";
import { LCH, LCHToXYZ, XYZToLCH } from "./LCH";
import { P3, P3ToXYZ, XYZToP3 } from "./P3";
import { ProPhoto, ProPhotoToXYZ, XYZToProPhoto } from "./ProPhoto";
import { Rec2020, Rec2020ToXYZ, XYZToRec2020 } from "./Rec2020";
import { sRGB, sRGBToXYZ, XYZTosRGB } from "./sRGB";
import { XYZ } from "./XYZ";
import { ColorSpace, RGBBasedSpace, CSSSpace } from "../color-spaces";
import { Color, CSSColor } from "../color";

export function convertColorToSpace(
  color: Color,
  to: ColorSpace.AdobeRGB
): AdobeRGB;
export function convertColorToSpace(color: Color, to: ColorSpace.CMYK): CMYK;
export function convertColorToSpace(color: Color, to: ColorSpace.HSL): HSL;
export function convertColorToSpace(color: Color, to: ColorSpace.Lab): Lab;
export function convertColorToSpace(color: Color, to: ColorSpace.LCH): LCH;
export function convertColorToSpace(color: Color, to: ColorSpace.P3): P3;
export function convertColorToSpace(
  color: Color,
  to: ColorSpace.ProPhoto
): ProPhoto;
export function convertColorToSpace(
  color: Color,
  to: ColorSpace.Rec2020
): Rec2020;
export function convertColorToSpace(color: Color, to: ColorSpace.sRGB): sRGB;
export function convertColorToSpace(color: Color, to: ColorSpace.XYZ): XYZ;
export function convertColorToSpace(
  color: Color,
  to: RGBBasedSpace
): AdobeRGB | P3 | ProPhoto | Rec2020 | sRGB;
export function convertColorToSpace(color: Color, to: CSSSpace): CSSColor;
export function convertColorToSpace(color: Color, to: ColorSpace): Color {
  let XYZColor: XYZ;
  switch (color.type) {
    case ColorSpace.AdobeRGB:
      XYZColor = AdobeRGBToXYZ(color);
      break;
    case ColorSpace.CMYK:
      XYZColor = CMYKToXYZ(color);
      break;
    case ColorSpace.HSL:
      XYZColor = HSLToXYZ(color);
      break;
    case ColorSpace.Lab:
      XYZColor = LabToXYZ(color);
      break;
    case ColorSpace.LCH:
      XYZColor = LCHToXYZ(color);
      break;
    case ColorSpace.P3:
      XYZColor = P3ToXYZ(color);
      break;
    case ColorSpace.ProPhoto:
      XYZColor = ProPhotoToXYZ(color);
      break;
    case ColorSpace.Rec2020:
      XYZColor = Rec2020ToXYZ(color);
      break;
    case ColorSpace.sRGB:
      XYZColor = sRGBToXYZ(color);
      break;
    case ColorSpace.XYZ:
    default:
      XYZColor = color;
  }

  switch (to) {
    case ColorSpace.AdobeRGB:
      return XYZToAdobeRGB(XYZColor);
    case ColorSpace.CMYK:
      return XYZToCMYK(XYZColor);
    case ColorSpace.HSL:
      return XYZToHSL(XYZColor);
    case ColorSpace.Lab:
      return XYZToLab(XYZColor);
    case ColorSpace.LCH:
      return XYZToLCH(XYZColor);
    case ColorSpace.P3:
      return XYZToP3(XYZColor);
    case ColorSpace.ProPhoto:
      return XYZToProPhoto(XYZColor);
    case ColorSpace.Rec2020:
      return XYZToRec2020(XYZColor);
    case ColorSpace.sRGB:
      return XYZTosRGB(XYZColor);
    case ColorSpace.XYZ:
    default:
      return XYZColor;
  }
}
