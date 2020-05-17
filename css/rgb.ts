import { sRGB } from "../spaces/sRGB";
import { ColorSpace } from "../color-spaces";

// rgb(r g b / a)
// red, green and blue values can be either a percentage or a number between 0 and 255
// we do not process alpha values
export const parse = (color: string): sRGB | null => {
  const parsed = color.match(/-?[\d.%?]+/g);
  if (parsed === null || parsed.length < 3) {
    return null;
  }
  const [red, green, blue] = parsed.map((value: string) =>
    value.includes("%")
      ? Number.parseFloat(value) / 100
      : Number.parseFloat(value) / 255
  );
  return { type: ColorSpace.sRGB, values: [red, green, blue] };
};

export const stringify = (color: sRGB, alpha?: string): string => {
  const [red, green, blue] = color.values.map(
    (value: number) => `${(value * 100).toFixed(2)}%`
  );
  return `rgb(${red} ${green} ${blue}${alpha ? ` / ${alpha}` : ""})`;
};
