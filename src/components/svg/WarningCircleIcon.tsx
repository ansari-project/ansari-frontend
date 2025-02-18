import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'
import { Path } from 'react-native-svg'

const WarningcircleIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      {...props}
      width={props.width || '64px'}
      height={props.height || '64px'}
      viewBox={props.viewBox || '0 0 24.00 24.00'}
      fill={props.fill}
    >
      <Path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 6.25C12.4142 6.25 12.75 6.58579 12.75 7L12.75 14.1046C12.75 14.5189 12.4142 14.8547 12 14.8547C11.5858 14.8547 11.25 14.5189 11.25 14.1047L11.25 7C11.25 6.58579 11.5858 6.25 12 6.25ZM12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18L12.01 18C12.5623 18 13.01 17.5523 13.01 17C13.01 16.4477 12.5623 16 12.01 16L12 16Z'
        fill={props.fill || '#ef0b0b'}
      />
    </ReactNativeSvg>
  )
}

export default WarningcircleIcon
