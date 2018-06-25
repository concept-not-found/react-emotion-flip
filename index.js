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
  extractAdditionalDomFromTarget = (element) => {}
} = {}) => {
  const Flip = class extends Component {
    constructor (props) {
      super(props)
      this.containerRef = createRef()
      this.animate = () => {
        const {source, additionalSourceProperties} = childByFlip.get(Flip) || {}
        if (!source) {
          return
        }
        const child = this.containerRef.current
        const target = child.getBoundingClientRect()
        if (target.width === 0 || target.height === 0) {
          // if target is an image, width/height will be zero while loading
          return setTimeout(this.animate, 100)
        }
        const additionalTargetProperties = extractAdditionalDomFromTarget(child)
        const animation = keyframes(
          source,
          target,
          additionalSourceProperties,
          additionalTargetProperties
        )
        child.classList.add(css`
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
        `)
      }
    }

    componentDidMount () {
      this.animate()
    }
    componentWillUnmount () {
      const child = this.containerRef.current
      childByFlip.set(Flip, {
        source: child.getBoundingClientRect(),
        additionalSourceProperties: extractAdditionalDomFromSource(child)
      })
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
