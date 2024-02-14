import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'

const LogoutIcon: React.FC<Props> = (props: Props) => {
  return (
    <EndeavorFancySVG
      stroke={props.fill || 'currentColor'}
      fill={props.fill || 'currentColor'}
      width={props.width || '18'}
      height={props.height || '18'}
      viewBox={props.viewBox || '0 0 24 24'}
      strokeWidth={props.strokeWidth || '2'}
      strokeLinecap={props.strokeLinecap || 'round'}
      strokeLinejoin={props.strokeLinejoin || 'round'}
    >
      <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'></path>
      <polyline points='16 17 21 12 16 7'></polyline>
      <line x1='21' y1='12' x2='9' y2='12'></line>
    </EndeavorFancySVG>
  )
}

export default LogoutIcon
