import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'
import { useDirection } from '@endeavorpal/hooks'

const RightArrowIcon: React.FC<Props> = (props: Props) => {
  const { isRTL } = useDirection()

  return (
    <EndeavorFancySVG
      width={props.width || '18'}
      height={props.height || '18'}
      viewBox={props.viewBox || '0 0 18 18'}
      fill={props.fill || '#8E8E8E'}
      transform={isRTL ? 'scale(-1, 1)' : 'scale(1, 1)'}
    >
      <path
        d='M13.5383 7.73086L7.00273 1.19531C6.29961 0.492187 5.16406 0.492187 4.46094 1.19531C3.75781 1.89844 3.75781 3.03398 4.46094 3.73711L9.72734 9L4.46094 14.2629C3.75781 14.966 3.75781 16.1016 4.46094 16.8047C5.16406 17.5078 6.29961 17.5078 7.00273 16.8047L13.5383 10.2691C14.2379 9.56953 14.2379 8.43047 13.5383 7.73086Z'
        fill={props.fill}
      />
    </EndeavorFancySVG>
  )
}

export default RightArrowIcon
