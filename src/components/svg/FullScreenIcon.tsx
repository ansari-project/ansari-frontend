import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'
import { Path } from 'react-native-svg'

const FullscreenIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      {...props}
      width={props.width || '1.5'}
      height={props.height || '32'}
      viewBox={props.viewBox || '0 0 24 24'}
      fill={props.fill}
    ></ReactNativeSvg>
  )
}

export default FullscreenIcon
