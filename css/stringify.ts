import { ColorSpace } from "../color-spaces";
import { stringify as colorStringify } from "./color";
import { stringify as hslStringify } from "./hsl";
import { stringify as labStringify } from "./lab";
import { stringify as lchStringify } from "./lch";
import { stringify as rgbStringify } from "./rgb";
import { CSSColor } from "../color";

export const stringify = (color: CSSColor): string => {
  switch (color.type) {
    case ColorSpace.AdobeRGB:
    case ColorSpace.P3:
    case ColorSpace.ProPhoto:
    case ColorSpace.Rec2020:
      return colorStringify(color);
    case ColorSpace.HSL:
      return hslStringify(color);
    case ColorSpace.Lab:
      return labStringify(color);
    case ColorSpace.LCH:
      return lchStringify(color);
    case ColorSpace.sRGB:
      return rgbStringify(color);
  }
};
