const {createElement, Component, createRef} = require('react')
const {css, keyframes} = require('emotion')

function translateAndScale (source, target) {
  const sx = source.width / target.width
  const sy = source.height / target.height
  const dx = source.x - target.x
  const dy = source.y - target.y
  return keyframes`
    from {
      transform: translate(${dx}px, ${dy}px) scale(${sx}, ${sy});
    }
  `
}
function sameBounds (source, target) {
  return !['top', 'right', 'bottom', 'left'].find(key => {
    return source[key] !== target[key]
  })
}
const childByFlip = new WeakMap()

module.exports = ({
  transformOrigin = '0 0',
  duration = 500,
  timingFunction = 'ease',
  delay = 0,
  iterationCount = 1,
  direction = 'normal',
  fillMode = 'both',
  playState = 'running',
  keyframes = translateAndScale,
  playCss = '',
  extractAdditionalDomFromSource = (element) => {},
  extractAdditionalDomFromTarget = (element) => {},
  unmountAsSource = false
} = {}) => {
  if (typeof duration !== 'number') {
    throw new Error('duration must be an integer')
  }
  const Flip = class extends Component {
    constructor (props) {
      super(props)
      this.containerRef = createRef()

      this.saveNextFirst = () => {
        const child = this.containerRef.current
        childByFlip.set(Flip, {
          source: child.getBoundingClientRect(),
          additionalSourceProperties: extractAdditionalDomFromSource(child)
        })
      }

      this.cleanup = () => {}
      this.animate = () => {
        this.cleanup()

        // FIRST
        const {source, additionalSourceProperties} = childByFlip.get(Flip) || {}

        // LAST
        const child = this.containerRef.current
        const target = child.getBoundingClientRect()

        // LAST IS NEXT FIRST
        this.saveNextFirst()

        // INVERT
        if (!source) {
          return
        }
        if (sameBounds(source, target)) {
          return
        }
        const additionalTargetProperties = extractAdditionalDomFromTarget(child)
        const animation = keyframes(
          source,
          target,
          additionalSourceProperties,
          additionalTargetProperties
        )
        const animationClass = css`
          transform-origin: ${transformOrigin};
          animation-duration: ${duration}ms;
          animation-timing-function: ${timingFunction};
          animation-delay: ${delay}ms;
          animation-iteration-count: ${iterationCount};
          animation-direction: ${direction};
          animation-fill-mode: ${fillMode};
          animation-play-state: ${playState};
          animation-name: ${animation};
          ${playCss};
        `
        // PLAY
        child.classList.add(animationClass)

        const timeout = setTimeout(() => {
          this.cleanup()
        }, duration + 10)
        this.cleanup = () => {
          clearTimeout(timeout)
          child.classList.remove(animationClass)
          this.cleanup = () => {}
        }
      }
    }

    componentDidMount () {
      this.animate()
    }
    componentWillUnmount () {
      if (!unmountAsSource) {
        return
      }
      this.saveNextFirst()
    }

    getSnapshotBeforeUpdate () {
      this.saveNextFirst()
      return null
    }
    componentDidUpdate () {
      this.animate()
    }

    render () {
      const {props: {children}, containerRef} = this
      return createElement('div', {
        ref: containerRef
      }, children)
    }
  }
  return Flip
}
