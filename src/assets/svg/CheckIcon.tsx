import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'

const CheckIcon: React.FC<Props> = (props: Props) => {
  return (
    <EndeavorFancySVG
      color={props.color || 'currentColor'}
      fill={props.fill || 'currentColor'}
      stroke={props.stroke || 'currentColor'}
      strokeWidth='0'
      viewBox={props.viewBox || '0 0 512 512'}
      width={props.width || '200px'}
      height={props.height || '200px'}
      transform={props.transform}
    >
      <path
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='32'
        d='M416 128 192 384l-96-96'
      ></path>
    </EndeavorFancySVG>
  )
}

export default CheckIcon
