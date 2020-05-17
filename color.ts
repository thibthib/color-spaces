import { AdobeRGB } from "./spaces/AdobeRGB";
import { CMYK } from "./spaces/CMYK";
import { HSL } from "./spaces/HSL";
import { Lab } from "./spaces/Lab";
import { LCH } from "./spaces/LCH";
import { P3 } from "./spaces/P3";
import { ProPhoto } from "./spaces/ProPhoto";
import { Rec2020 } from "./spaces/Rec2020";
import { sRGB } from "./spaces/sRGB";
import { XYZ } from "./spaces/XYZ";

export type Color =
  | AdobeRGB
  | CMYK
  | HSL
  | Lab
  | LCH
  | P3
  | ProPhoto
  | Rec2020
  | sRGB
  | XYZ;
export type CSSColor =
  | AdobeRGB
  | HSL
  | Lab
  | LCH
  | P3
  | ProPhoto
  | Rec2020
  | sRGB;

export type { AdobeRGB, CMYK, HSL, Lab, LCH, P3, ProPhoto, Rec2020, sRGB, XYZ };
