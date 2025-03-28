import { useDirection } from '@/hooks'
import { Path } from 'react-native-svg'
import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const LogoutIcon: React.FC<Props> = (props: Props) => {
  const { isRTL } = useDirection()
  const transform = isRTL ? [{ scale: -1 }] : [{ scale: 1 }]

  return (
    <ReactNativeSvg
      stroke={props.stroke || 'currentColor'}
      fill={props.fill || 'none'}
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox={props.viewBox || '0 0 24 24'}
      strokeWidth={props.strokeWidth || '2'}
      strokeLinecap={props.strokeLinecap || 'round'}
      strokeLinejoin={props.strokeLinejoin || 'round'}
      transform={props.transform || transform}
    >
      <Path
        d='M11 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H11'
        stroke={props.stroke || 'currentColor'}
        strokeWidth={props.strokeWidth || '2'}
        strokeLinecap={props.strokeLinecap || 'round'}
      ></Path>
      <Path
        d='M20 12H11M20 12L16 16M20 12L16 8'
        stroke={props.stroke || 'currentColor'}
        strokeWidth={props.strokeWidth || '2'}
        strokeLinecap={props.strokeLinecap || 'round'}
        strokeLinejoin={props.strokeLinejoin || 'round'}
      ></Path>
    </ReactNativeSvg>
  )
}

export default LogoutIcon
