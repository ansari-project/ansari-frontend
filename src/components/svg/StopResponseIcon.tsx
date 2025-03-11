import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const StopresponseIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      {...props}
      width={props.width || '16px'}
      height={props.height || '16px'}
      viewBox={props.viewBox || '0 0 16 16'}
      fill={props.fill}
    ></ReactNativeSvg>
  )
}

export default StopresponseIcon
