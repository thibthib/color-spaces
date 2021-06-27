# 🎨 Convert CSS colors to any color space

Two new color notations are coming with the [CSS Color Module Level 4 specification](https://drafts.csswg.org/css-color-4): `lch()` and `lab()`. They have a lot of advantages over the rgb or hsl colors we usually use, [Lea Verou explains it very well](http://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/). But, in order to be able to use them without breaking browser support, we need to be able to convert those notations to older notations, like `rgb()` or `color()`.

This repository is for the most part code written by [Chris Lilley](https://svgees.us/) direclty in the CSS Color specification. It was then ported to typescript, and exposed as a package.

## Installation

```bash
$ yarn add @color-spaces/convert
# or
$ npm i --save @color-spaces/convert
```

## Usage

```jsx
import { ColorSpace, convertCSSColor } from "@color-spaces/convert";

const myColorLCH = "lch(60% 67 266)";
// P3 colors are already supported by Safari
const myColorP3 = convertCSSColor(myColorLCH, ColorSpace.P3);
// RGB is supported everywhere
const myColorRGB = convertCSSColor(myColorLCH, ColorSpace.sRGB);

const CSS = `
    :root {
        --myColor: ${myColorRGB};
    }

    @supports (color: color(display-p3 1 1 1)) {
        :root {
            --myColor: ${myColorP3};
        }
    }

    @supports (color: lch(0 0 0)) {
        :root {
            --myColor: ${myColorLCH};
        }
    }
`;
```

### ColorSpace

This enum contains all the supported color spaces:

- AdobeRGB
- HSL
- Lab
- LCH
- P3
- ProPhoto
- Rec2020
- sRGB
- XYZ

### convertCSSColor

```ts
function convertCSSColor(CSSColor: string, to: CSSSpace): string;
```

- The `CSSColor` parameter is any CSS color, as a string.
- The `to` parameter is any valid CSS color space – see the `ColorSpace` enum.

### convertColorToSpace

```ts
function convertColorToSpace(color: Color, to: ColorSpace): Color;
```

- The `color` parameter is an object containing two keys:

  - `type` that represents its `ColorSpace`.
  - `values` that is an array of numbers – i.e. [r,g,b] for the sRGB color space.

- The `to` parameter is any color space from `ColorSpace`.
