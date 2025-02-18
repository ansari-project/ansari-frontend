import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'
import { Path } from 'react-native-svg'

const SelecttextIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      {...props}
      width={props.width || '800px'}
      height={props.height || '800px'}
      viewBox={props.viewBox || '0 0 92 92'}
      fill={props.fill}
    ></ReactNativeSvg>
  )
}

export default SelecttextIcon
