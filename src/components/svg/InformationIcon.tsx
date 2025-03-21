import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'
import { Path } from 'react-native-svg'

const InformationIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      {...props}
      width={props.width || '18'}
      height={props.height || '18'}
      viewBox={props.viewBox || '0 0 18 18'}
      fill={props.fill}
    >
      <Path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M9 0C4.05668 0 0 4.05668 0 9C0 13.9433 4.05668 18 9 18C13.9433 18 18 13.9433 18 9C18 4.05668 13.9433 0 9 0ZM10.0547 13.2188C10.0547 13.8002 9.58141 14.2734 9 14.2734C8.41859 14.2734 7.94531 13.8002 7.94531 13.2188V7.94531C7.94531 7.3639 8.41859 6.89062 9 6.89062C9.58141 6.89062 10.0547 7.3639 10.0547 7.94531V13.2188ZM9 5.83594C8.41859 5.83594 7.94531 5.36266 7.94531 4.78125C7.94531 4.19984 8.41859 3.72656 9 3.72656C9.58141 3.72656 10.0547 4.19984 10.0547 4.78125C10.0547 5.36266 9.58141 5.83594 9 5.83594Z'
        fill={props.fill || '#343434'}
      />
    </ReactNativeSvg>
  )
}

export default InformationIcon
