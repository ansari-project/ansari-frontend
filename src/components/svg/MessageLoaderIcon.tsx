import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const MessageloaderIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      {...props}
      width={props.width || '30px'}
      height={props.height || '30px'}
      viewBox={props.viewBox || '0 0 100 100'}
      fill={props.fill}
    ></ReactNativeSvg>
  )
}

export default MessageloaderIcon
