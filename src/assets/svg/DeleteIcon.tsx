import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'

const DeleteIcon: React.FC<Props> = (props: Props) => {
  return (
    <EndeavorFancySVG
      fill='red'
      stroke='red'
      strokeWidth='0'
      viewBox={props.viewBox || '0 0 24 24'}
      width={props.width || '200px'}
      height={props.height || '200px'}
      transform={props.transform}
    >
      <path fill='none' d='M0 0h24v24H0z'></path>
      <path d='M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z'></path>
    </EndeavorFancySVG>
  )
}

export default DeleteIcon
