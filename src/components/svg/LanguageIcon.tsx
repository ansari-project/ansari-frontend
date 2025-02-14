import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'

const LanguageIcon: React.FC<Props> = (props: Props) => {
  return (
    <EndeavorFancySVG
      {...props}
      width={props.width || '24'}
      height={props.height || '24'}
      fill={props.fill || 'none'}
      stroke={props.stroke || 'currentColor'}
      strokeWidth={props.strokeWidth || '2'}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802'
      ></path>
    </EndeavorFancySVG>
  )
}

export default LanguageIcon
