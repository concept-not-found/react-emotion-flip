react-emotion-flip
==================

[Flip](https://aerotwist.com/blog/flip-your-animations/) animations with [React](https://github.com/facebook/react) and [emotion](https://github.com/emotion-js/emotion).

### [Demo](https://codesandbox.io/s/35o0y17m6)

## Usage
```js
import createFlip from 'react-emotion-flip'

const FlipInstance = createFlip(options)
```

`FlipInstance` is a React component wraps the children you wish to render. The `FlipInstance` should only ever be rendered once at any given time, but the children can change. When `FlipInstance` is mounted at a new location, the animation plays from the previous location to the current one.

Create different `FlipInstance`s if you have more than one thing you want to animate.

### Options
All options are optional and have reasonable defaults.

#### `duration`
Sets `animation-duration` in milliseconds, defaults to `500ms`.

#### `timingFunction`
Sets `animation-timing-function`, defaults to `ease`.

#### `delay`
Sets `animation-delay`, defaults to `0`.

#### `iterationCount`
Sets `animation-iteration-count`, defaults to  `1`.

#### `direction`
Sets `animation-direction`, defaults to `normal`.

#### `fillMode`
Sets `animation-fill-mode`, defaults to `both`.

#### `playState`
Sets `animation-play-state`, defaults to `running`.

#### `keyframes(source, target, additionalSourceProperties, additionalTargetProperties)`
The function generates keyframes from the source and target [`Element.getBoundingClientRect()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).
The default keyframes translate and scale the source to the target. The function also receives addtionals source and target properties when `extractAdditionalDomFromSource(element)` or `extractAdditionalDomFromTarget(element)` are defined.

#### `transformOrigin`
Sets `transform-origin`, defaults to '0 0'.

#### `playCss`
Additional [emotion css to compose](https://emotion.sh/docs/composition) into the animation when it plays. This can override any css property in the animation. Defaults to add nothing.

### `extractAdditionalDomFromSource(element)`
The function returns an object with additional data from the source dom element. This will be provided as `additionalSourceProperties` in the `keyframes` function. Default to return nothing.

### `extractAdditionalDomFromTarget(element)`
The function returns an object with additional data from the target dom element. This will be provided as `additionalTargetProperties` in the `keyframes` function. Default to return nothing.
