import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'

const ScrollToBottomIcon: React.FC<Props> = (props: Props) => {
  return (
    <EndeavorFancySVG
      color={props.color || 'currentColor'}
      fill={props.fill || 'currentColor'}
      stroke={props.stroke || 'currentColor'}
      strokeWidth='0'
      viewBox={props.viewBox || '0 0 16 16'}
      width={props.width || '200px'}
      height={props.height || '200px'}
      transform={props.transform}
    >
      <path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z'></path>
    </EndeavorFancySVG>
  )
}

export default ScrollToBottomIcon
