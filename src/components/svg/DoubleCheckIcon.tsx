import React from 'react'
import { Path } from 'react-native-svg'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const DoubleCheckIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      fill={props.fill || 'none'}
      stroke={props.stroke || 'currentColor'}
      strokeWidth='2'
      viewBox={props.viewBox || '0 0 50 50'}
      width={props.width || '200px'}
      height={props.height || '200px'}
      transform={props.transform}
    >
      <Path
        d='m14.583 25 1.302 1.302m29.948-11.719L25 35.417l-1.302-1.302M4.167 25l10.417 10.417 20.833-20.834'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </ReactNativeSvg>
  )
}

export default DoubleCheckIcon
