import { HSL } from "../spaces/HSL";
import { ColorSpace } from "../color-spaces";

// the hue needs to be a number in the half-open range [0, 6)
const parseAngle = (angle: string) => {
  let angleValue = Number.parseFloat(angle);
  if (angle.includes("grad")) {
    angleValue /= 400;
  } else if (angle.includes("rad")) {
    angleValue /= 2 * Math.PI;
  } else if (angle.includes("turn")) {
    angleValue /= 1;
  } else {
    // let's assume it's degrees
    angleValue /= 360;
  }

  return (angleValue === 1 ? 0 : angleValue) * 6;
};

// hsl(h s l / a)
// hue is an angle (deg, grad, rad, turn)
// saturation and lightness are percentages
export const parse = (color: string): HSL | null => {
  const parsed = color.match(/^[+-]?\d+(\.\d+)?$/g);
  if (parsed === null || parsed.length < 3) {
    return null;
  }
  const [hue, saturation, lightness] = parsed.map((value) =>
    value.includes("%") ? Number.parseFloat(value) / 100 : parseAngle(value)
  );
  return { type: ColorSpace.HSL, values: [hue, saturation, lightness] };
};

export const stringify = (color: HSL, alpha?: string): string => {
  const [hue, saturation, lightness] = color.values.map((value, index) =>
    index === 0
      ? `${((value / 6) * 360).toFixed(4)}deg`
      : `${(value * 100).toFixed(2)}%`
  );
  return `hsl(${hue} ${saturation} ${lightness}${alpha ? ` / ${alpha}` : ""})`;
};
