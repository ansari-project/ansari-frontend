import React, { useState } from 'react'
import { View } from 'react-native'

/**
 * A customizable SVG component that accepts all possible SVG attributes as props.
 * The component takes the whole SVG element as a child.
 *
 * @param {object} props - The props to pass to the SVG component.
 * @param {string} props.xmlns - The XML namespace for the SVG element.
 * @param {string | number} props.width - The width of the SVG element.
 * @param {string | number} props.height - The height of the SVG element.
 * @param {string} props.viewBox - The view box of the SVG element.
 * @param {string} props.fill - The fill of the SVG element.
 * @param {string} props.stroke - The stroke of the SVG element.
 * @param {string} props.strokeWidth - The stroke width of the SVG element.
 * @param {string} props.x - The x-coordinate of the SVG element.
 * @param {string} props.y - The y-coordinate of the SVG element.
 * @param {object} props.style - The style object for the SVG container.
 * @param {React.ReactNode} props.children - The SVG element to display.
 * @param {...any} props - Any other props to pass to the SVG element.
 *
 * @returns {JSX.Element} The customizable SVG component.
 */

type SVGProps = React.SVGProps<SVGSVGElement>

export type Props = {
  xmlns?: string
  width?: string | number
  height?: string | number
  viewBox?: string
  fill?: string
  hoverFill?: string
  stroke?: string
  hoverStroke?: string
  strokeWidth?: string | number
  x?: string
  y?: string
  style?: object
} & SVGProps
const EndeavorFancySVG = (props: Props) => {
  const [isHover, setIsHover] = useState<number>(0)

  // Convert percentage-based width and height values to absolute values for React Native.
  if (typeof props.width === 'string' && props.width.includes('%')) {
    delete props.width
  }

  if (typeof props.height === 'string' && props.height.includes('%')) {
    delete props.height
  }

  let { hoverFill, hoverStroke, ...svgProps } = props

  hoverFill = hoverFill || props.fill
  hoverStroke = hoverStroke || props.stroke

  // Create an object with all the SVG attributes.
  svgProps = {
    xmlns: props.xmlns || 'http://www.w3.org/2000/svg',
    width: props.width || '100%',
    height: props.height || '100%',
    viewBox: props.viewBox || '0 0 24 24',
    ...svgProps,
    fill: isHover === 1 ? hoverFill : props.fill,
    stroke: isHover === 1 ? hoverStroke : props.stroke,
  }

  return (
    <View
      style={[
        {
          width: svgProps.width,
          height: svgProps.height,
          overflow: 'visible',
        },
        props.style,
      ]}
      onMouseEnter={() => setIsHover(1)}
      onMouseLeave={() => setIsHover(0)}
    >
      <View style={{ userSelect: 'none' }}>
        <svg {...svgProps}>{props.children}</svg>
      </View>
    </View>
  )
}

export default EndeavorFancySVG
