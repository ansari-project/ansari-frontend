import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'

const LineIcon: React.FC<Props> = (props: Props) => {
  return (
    <EndeavorFancySVG
      width={props.width || '6'}
      height={props.height || '22'}
      viewBox={props.viewBox || '0 0 6 22'}
      stroke={props.stroke || '#8E8E8E'}
      strokeWidth={props.strokeWidth || '5'}
    >
      <path d='M3 3L3 19' stroke={props.stroke} strokeWidth={props.strokeWidth} strokeLinecap='round' />
    </EndeavorFancySVG>
  )
}

export default LineIcon
