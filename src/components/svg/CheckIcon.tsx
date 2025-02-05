import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'

const CheckIcon: React.FC<Props> = (props: Props) => {
  return (
    <EndeavorFancySVG
      color={props.color || 'currentColor'}
      fill={props.fill || '#19F9DF'}
      stroke={props.stroke || 'currentColor'}
      strokeWidth='0'
      viewBox={props.viewBox || '0 0 18 18'}
      width={props.width || '18'}
      height={props.height || '18'}
      transform={props.transform}
    >
      <path d='M6.29449 15.3086C6.06835 15.3086 5.84221 15.222 5.66994 15.0498L0.259136 9.6388C-0.0863787 9.29345 -0.0863787 8.73506 0.259136 8.38971C0.604489 8.04435 1.16272 8.04435 1.50823 8.38971L6.29449 13.176L16.4919 2.97874C16.8372 2.63339 17.3954 2.63339 17.741 2.97874C18.0863 3.32426 18.0863 3.88248 17.741 4.228L6.91919 15.0498C6.74692 15.222 6.52062 15.3086 6.29449 15.3086Z' />
    </EndeavorFancySVG>
  )
}

export default CheckIcon
