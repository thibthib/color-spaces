export enum ColorSpace {
  AdobeRGB = "AdobeRGB",
  CMYK = "CMYK",
  HSL = "HSL",
  Lab = "Lab",
  LCH = "LCH",
  P3 = "P3",
  ProPhoto = "ProPhoto",
  Rec2020 = "Rec2020",
  sRGB = "sRGB",
  XYZ = "XYZ",
}

export type RGBBasedSpace =
  | ColorSpace.AdobeRGB
  | ColorSpace.P3
  | ColorSpace.ProPhoto
  | ColorSpace.Rec2020
  | ColorSpace.sRGB;

export const isRGBBased = (space: ColorSpace): space is RGBBasedSpace =>
  space === ColorSpace.AdobeRGB ||
  space === ColorSpace.P3 ||
  space === ColorSpace.ProPhoto ||
  space === ColorSpace.Rec2020 ||
  space === ColorSpace.sRGB;

export type CSSSpace =
  | ColorSpace.AdobeRGB
  | ColorSpace.HSL
  | ColorSpace.Lab
  | ColorSpace.LCH
  | ColorSpace.P3
  | ColorSpace.ProPhoto
  | ColorSpace.Rec2020
  | ColorSpace.sRGB;
