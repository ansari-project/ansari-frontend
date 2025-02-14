import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'

const InfoIcon: React.FC<Props> = (props: Props) => {
  return (
    <EndeavorFancySVG
      {...props}
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox={props.viewBox || '0 0 24 24'}
      fill={props.fill || 'none'}
      stroke={props.stroke || '#08786b'}
      strokeWidth={props.strokeWidth || '2'}
    >
      <path
        strokeWidth={props.strokeWidth}
        d='M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,10 L12,18 M12,6 L12,8'
      ></path>
    </EndeavorFancySVG>
  )
}

export default InfoIcon
