# Color space conversion utilities

As part of the [CSS Color Module Level 4 specification](https://drafts.csswg.org/css-color-4), two new color notation are being proposed: `lch()` and `lab()`. Some browsers are already working on implementing those! In order to use them without breaking browser support, we need to be able to convert those notations to older notations, like `rgb()` or `color()`.

Those functions have been ported from the code written by [Chris Lilley](https://svgees.us/) in the CSS Color specification direclty.
