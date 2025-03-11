import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const LoadingIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      {...props}
      width={props.width || '20px'}
      height={props.height || '20px'}
      viewBox={props.viewBox || '0 0 100 100'}
      fill={props.fill}
    ></ReactNativeSvg>
  )
}

export default LoadingIcon
