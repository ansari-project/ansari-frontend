import React, { useState } from 'react'
import { ColorValue, View, StyleSheet } from 'react-native'
import Svg, { SvgProps } from 'react-native-svg'

export type Props = {
  hoverFill?: ColorValue
  hoverStroke?: ColorValue
  style?: object
} & SvgProps

const ReactNativeSvg = (props: Props) => {
  const [isHover, setIsHover] = useState<number>(0)

  if (typeof props.width === 'string' && props.width.includes('%')) {
    delete props.width
  }

  if (typeof props.height === 'string' && props.height.includes('%')) {
    delete props.height
  }

  let { hoverFill, hoverStroke, ...svgProps } = props

  hoverFill = hoverFill || props.fill
  hoverStroke = hoverStroke || props.stroke

  svgProps = {
    width: props.width || '100%',
    height: props.height || '100%',
    viewBox: props.viewBox || '0 0 24 24',
    ...svgProps,
    fill: isHover === 1 ? hoverFill : props.fill,
    stroke: isHover === 1 ? hoverStroke : props.stroke,
  }

  const styles = StyleSheet.create({
    svgContainer: {
      overflow: 'visible',
      width: svgProps.width,
      height: svgProps.height,
    },
  })

  return (
    <View
      style={[styles.svgContainer, props.style]}
      onMouseEnter={() => setIsHover(1)}
      onMouseLeave={() => setIsHover(0)}
    >
      <Svg {...svgProps}>{props.children}</Svg>
    </View>
  )
}

export default ReactNativeSvg
