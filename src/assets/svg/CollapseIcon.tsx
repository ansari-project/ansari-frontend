import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'
import { useDirection } from '@endeavorpal/hooks'

const CollapseIcon: React.FC<Props> = (props: Props) => {
  const { isRTL } = useDirection()
  return (
    <EndeavorFancySVG
      {...props}
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox={props.viewBox || '0 0 24 24'}
      fill={props.fill || 'white'}
      transform={props.transform || isRTL ? 'scale(-1, 1)' : 'scale(1, 1)'}
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M23.6987 0.301259C24.1004 0.702937 24.1004 1.3542 23.6987 1.75588L15.8547 9.60001H20.2286C20.7966 9.60001 21.2572 10.0605 21.2572 10.6286C21.2572 11.1966 20.7966 11.6572 20.2286 11.6572H13.3714C12.8034 11.6572 12.3429 11.1966 12.3429 10.6286V3.77143C12.3429 3.20337 12.8034 2.74286 13.3714 2.74286C13.9395 2.74286 14.4 3.20337 14.4 3.77143V8.14539L22.2442 0.301259C22.6459 -0.10042 23.297 -0.10042 23.6987 0.301259ZM3.77143 14.4C3.20337 14.4 2.74286 13.9395 2.74286 13.3714C2.74286 12.8034 3.20337 12.3429 3.77143 12.3429H10.6286C11.1966 12.3429 11.6572 12.8034 11.6572 13.3714V20.2286C11.6572 20.7966 11.1966 21.2572 10.6286 21.2572C10.0605 21.2572 9.60001 20.7966 9.60001 20.2286V15.8547L1.75588 23.6987C1.3542 24.1004 0.702937 24.1004 0.301259 23.6987C-0.10042 23.297 -0.10042 22.6459 0.301259 22.2442L8.14539 14.4H3.77143Z'
      />
    </EndeavorFancySVG>
  )
}

export default CollapseIcon
