import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'

const CopyIcon: React.FC<Props> = (props: Props) => {
  return (
    <EndeavorFancySVG
      color={props.color || 'currentColor'}
      fill={props.fill || 'currentColor'}
      stroke={props.stroke || 'currentColor'}
      strokeWidth='0'
      viewBox={props.viewBox || '0 0 24 24'}
      width={props.width || '200px'}
      height={props.height || '200px'}
      transform={props.transform}
    >
      <path fill='none' d='M0 0h24v24H0z'></path>
      <path d='M18 2H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H9V4h9v12zM3 15v-2h2v2H3zm0-5.5h2v2H3v-2zM10 20h2v2h-2v-2zm-7-1.5v-2h2v2H3zM5 22c-1.1 0-2-.9-2-2h2v2zm3.5 0h-2v-2h2v2zm5 0v-2h2c0 1.1-.9 2-2 2zM5 6v2H3c0-1.1.9-2 2-2z'></path>
    </EndeavorFancySVG>
  )
}

export default CopyIcon
