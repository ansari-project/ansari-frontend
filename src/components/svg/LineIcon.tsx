import React from 'react'
import { Path } from 'react-native-svg'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const LineIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      width={props.width || '6'}
      height={props.height || '22'}
      viewBox={props.viewBox || '0 0 6 22'}
      stroke={props.stroke || '#8E8E8E'}
      strokeWidth={props.strokeWidth || '5'}
    >
      <Path d='M3 3L3 19' stroke={props.stroke} strokeWidth={props.strokeWidth} strokeLinecap='round' />
    </ReactNativeSvg>
  )
}

export default LineIcon
