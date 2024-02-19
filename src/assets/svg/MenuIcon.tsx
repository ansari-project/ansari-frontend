import { useDirection } from '@endeavorpal/hooks'
import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'

const MenuIcon: React.FC<Props> = (props: Props) => {
  const { isRTL } = useDirection()
  const transform = isRTL ? 'rotate(0)matrix(-1, 0, 0, 1, 0, 0)' : 'rotate(0)matrix(1, 0, 0, 1, 0, 0)'
  return (
    <EndeavorFancySVG
      stroke='#000000'
      fill='none'
      viewBox={props.viewBox || '0 0 24 24'}
      width={props.width || '800px'}
      height={props.height || '800px'}
      transform={props.transform || transform}
    >
      <g id='BgCarrier' strokeWidth='0' />

      <g id='TracerCarrier' strokeLinecap='round' strokeLinejoin='round' />

      <g id='IconCarrier'>
        <path
          d='M4 6H20M4 12H14M4 18H9'
          stroke={props.stroke || '#08786b'}
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </g>
    </EndeavorFancySVG>
  )
}

export default MenuIcon
