import { sRGB } from "../spaces/sRGB";
import { P3 } from "../spaces/P3";
import { ProPhoto } from "../spaces/ProPhoto";
import { AdobeRGB } from "../spaces/AdobeRGB";
import { Rec2020 } from "../spaces/Rec2020";
import { ColorSpace } from "../color-spaces";

export type PredefinedSpaces =
  | ColorSpace.AdobeRGB
  | ColorSpace.P3
  | ColorSpace.ProPhoto
  | ColorSpace.Rec2020
  | ColorSpace.sRGB;

const stringToSpace: { [key: string]: PredefinedSpaces } = {
  "a98-rgb": ColorSpace.AdobeRGB,
  "display-p3": ColorSpace.P3,
  "prophoto-rgb": ColorSpace.ProPhoto,
  rec2020: ColorSpace.Rec2020,
  sRGB: ColorSpace.sRGB,
};

// color(space, value / ?alpha)
export const parse = (
  color: string
): sRGB | P3 | ProPhoto | AdobeRGB | Rec2020 | null => {
  const parsed = color.match(/\((.*?)\)/);
  if (parsed === null) {
    return null;
  }
  const [space, ...values] = parsed[1].split(" ");
  const [red, green, blue] = values.map((value: string) =>
    Number.parseFloat(value)
  );
  return { type: stringToSpace[space], values: [red, green, blue] };
};

export const stringify = (
  color: AdobeRGB | P3 | ProPhoto | Rec2020 | sRGB,
  alpha?: string
): string => {
  const [red, green, blue] = color.values.map((value) => value.toFixed(4));
  const space = Object.entries(stringToSpace).find(
    ([_, value]) => value === color.type
  );
  return `color(${space ? space[0] : null} ${red} ${green} ${blue}${
    alpha ? ` / ${alpha}` : ""
  })`;
};
