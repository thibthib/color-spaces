import { sRGB } from "../spaces/sRGB";
import { ColorSpace } from "../color-spaces";

export const parse = (color: string): sRGB | null => {
  const parsed = color
    .replace("#", "")
    // shorthand notation
    .match(color.length < 7 ? /.{1}/g : /.{2}/g);

  if (parsed === null || parsed.length < 3) {
    return null;
  }
  const [red, green, blue] = parsed.map(
    (value) => Number.parseInt(value, 16) / (value.length === 1 ? 15 : 255)
  );

  return { type: ColorSpace.sRGB, values: [red, green, blue] };
};

export const stringify = (color: sRGB, alpha?: string): string => {
  const [red, green, blue] = color.values.map((value) =>
    (value * 255).toString(16)
  );
  return `#${red}${green}${blue}${alpha ? `${alpha}` : ""}`;
};
