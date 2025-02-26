import { useDirection } from '@/hooks'
import { G, Path } from 'react-native-svg'
import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const FlagIcon: React.FC<Props> = (props: Props) => {
  const { isRTL } = useDirection()
  const transform = isRTL
    ? [{ rotate: '0' }, { matrix: [-1, 0, 0, 1, 0, 0] }]
    : [{ rotate: '0' }, { matrix: [1, 0, 0, 1, 0, 0] }]

  return (
    <ReactNativeSvg
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox={props.viewBox || '0 0 24 24'}
      fill={props.fill || '#08786B'}
      transform={props.transform || transform}
    >
      <G>
        <Path
          d='M22.2 3.6L17.4 9.6L22.2 15.6H5.4V22.8C5.4 23.1183 5.27357 23.4235 5.04853 23.6485C4.82348 23.8736 4.51826 24 4.2 24C3.88174 24 3.57652 23.8736 3.35147 23.6485C3.12643 23.4235 3 23.1183 3 22.8V1.2C3 0.88174 3.12643 0.576515 3.35147 0.351472C3.57652 0.126428 3.88174 0 4.2 0C4.51826 0 4.82348 0.126428 5.04853 0.351472C5.27357 0.576515 5.4 0.88174 5.4 1.2V3.6H22.2Z'
          fill={props.fill}
        />
      </G>
    </ReactNativeSvg>
  )
}

export default FlagIcon
