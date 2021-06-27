import { ColorSpace, CSSSpace } from "../color-spaces";
import { parse } from "./parse";
import { convertColorToSpace } from "../spaces/convertColorToSpace";
import { Color, CSSColor } from "../color";
import { stringify } from "./stringify";
import { beautifyNumber } from "./utils";

export function easeInOutSine(x: number): number {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

const normalizePosition = (position: string) => {
  const parsed = parseFloat(position);
  return Number.isNaN(parsed) ? null : parsed / 100;
};

type ParsedStep = [CSSColor, number | null, number | null];
type Step = [CSSColor, number, number | null];

const parseGradientStep = (
  step: string
): [CSSColor, number | null, number | null] | null => {
  const match = step.match(/^\s*([^(\s]+(?:\(.+?\))?) ?(\d*%?) ?(\d*%?)/);

  if (match !== null) {
    const [_, color, position1, position2] = match;

    if (color !== null) {
      const parsedColor = parse(color);

      if (parsedColor !== null) {
        return [
          parsedColor,
          normalizePosition(position1),
          normalizePosition(position2),
        ];
      }
    }
  }

  return null;
};

const getInterpolatedColor = (
  startColor: Color,
  stopColor: Color,
  progress: number
): Color => {
  const [start1, start2, start3] = startColor.values;
  const [stop1, stop2, stop3] = stopColor.values;

  const channel1 = start1 + progress * (stop1 - start1);
  const channel2 = start2 + progress * (stop2 - start2);
  const channel3 = start3 + progress * (stop3 - start3);

  return { type: startColor.type, values: [channel1, channel2, channel3] };
};

export const interpolateGradient = (
  gradient: string,
  options: {
    outputSpace?: CSSSpace;
    interpolationSpace?: ColorSpace;
    stepsCount?: number;
    easeFunction?: (x: number) => number;
  } = {}
) => {
  const gradientMatch = gradient.match(/linear-gradient\((.*)\)/);

  if (gradientMatch === null) {
    return null;
  }

  const stringSteps = gradientMatch[1].split(",");

  const normalizedSteps = stringSteps
    .map(parseGradientStep)
    .filter((step): step is ParsedStep => step !== null);

  const stepsWithPositions: Step[] = [];

  const firstStep = normalizedSteps.shift() as ParsedStep;
  firstStep[1] = firstStep[1] ?? 0;
  const lastStep = normalizedSteps.pop() as ParsedStep;
  lastStep[1] = lastStep[1] ?? 1;
  [firstStep, ...normalizedSteps, lastStep].forEach((step, index, steps) => {
    const [color, position1, position2] = step;

    if (position1 !== null) {
      stepsWithPositions.push(step as Step);
      return;
    }

    const prevIndex = index - 1;
    const [_, prevPosition1, prevPosition2] = stepsWithPositions[prevIndex];
    const prevPosition = prevPosition2 ?? prevPosition1;

    for (let nextIndex = index + 1; nextIndex < steps.length; nextIndex++) {
      const nextPosition = steps[nextIndex][1];
      if (nextPosition !== null) {
        stepsWithPositions.push([
          color,
          prevPosition +
            (nextPosition - prevPosition) / (nextIndex - prevIndex),
          position2,
        ]);
      }
    }
  });

  const {
    outputSpace = stepsWithPositions[0][0].type,
    interpolationSpace = stepsWithPositions[0][0].type,
    stepsCount = 5,
    easeFunction = (x) => x,
  } = options;

  const stepsWithInterpolation: Step[] = [];
  stepsWithPositions.forEach((step, index) => {
    stepsWithInterpolation.push([
      convertColorToSpace(step[0], outputSpace),
      step[1],
      step[2],
    ]);
    if (index === stepsWithPositions.length - 1) {
      return;
    }

    const startColor = convertColorToSpace(step[0], interpolationSpace);
    const startPosition = step[2] ?? step[1];
    const nextStep = stepsWithPositions[index + 1];
    const stopColor = convertColorToSpace(nextStep[0], interpolationSpace);
    const positionDifference = nextStep[1] - startPosition;

    Array.from(new Array(stepsCount - 2), (_, i) => i + 1).map((stepNumber) => {
      const progress = easeFunction(stepNumber / (stepsCount - 1));
      const interpolatedColor = getInterpolatedColor(
        startColor,
        stopColor,
        progress
      );

      const outputColor = convertColorToSpace(interpolatedColor, outputSpace);

      return stepsWithInterpolation.push([
        outputColor,
        startPosition + positionDifference * progress,
        null,
      ]);
    });
  });

  const angle =
    parseGradientStep(stringSteps[0]) === null ? `${stringSteps}, ` : "";

  return `linear-gradient(${angle}${stepsWithInterpolation
    .map(
      (value) =>
        `${stringify(value[0])} ${beautifyNumber(value[1] * 100, 2)}% ${
          value[2] === null ? "" : `${beautifyNumber(value[2] * 100, 2)}%`
        }`
    )
    .join(", ")});`;
};
