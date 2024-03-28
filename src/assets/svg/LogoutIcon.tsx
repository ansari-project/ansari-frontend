import { useDirection } from '@endeavorpal/hooks'
import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'

const LogoutIcon: React.FC<Props> = (props: Props) => {
  const { isRTL } = useDirection()
  const transform = isRTL ? 'rotate(0)matrix(-1, 0, 0, 1, 0, 0)' : 'rotate(0)matrix(1, 0, 0, 1, 0, 0)'

  return (
    <EndeavorFancySVG
      stroke={props.stroke || 'currentColor'}
      fill={props.fill || 'none'}
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox={props.viewBox || '0 0 24 24'}
      strokeWidth={props.strokeWidth || '2'}
      strokeLinecap={props.strokeLinecap || 'round'}
      strokeLinejoin={props.strokeLinejoin || 'round'}
      transform={props.transform || transform}
    >
      <path
        d='M11 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H11'
        stroke={props.stroke || 'currentColor'}
        strokeWidth={props.strokeWidth || '2'}
        strokeLinecap={props.strokeLinecap || 'round'}
      ></path>
      <path
        d='M20 12H11M20 12L16 16M20 12L16 8'
        stroke={props.stroke || 'currentColor'}
        strokeWidth={props.strokeWidth || '2'}
        strokeLinecap={props.strokeLinecap || 'round'}
        strokeLinejoin={props.strokeLinejoin || 'round'}
      ></path>
    </EndeavorFancySVG>
  )
}

export default LogoutIcon
