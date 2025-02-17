import { useDirection } from '@/hooks'
import { G, Path } from 'react-native-svg'
import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const MenuIcon: React.FC<Props> = (props: Props) => {
  const { isRTL } = useDirection()
  const transform = isRTL ? 'rotate(0)matrix(-1, 0, 0, 1, 0, 0)' : 'rotate(0)matrix(1, 0, 0, 1, 0, 0)'

  return (
    <ReactNativeSvg
      {...props}
      stroke={props.stroke || 'white'}
      fill='none'
      viewBox={props.viewBox || '0 0 24 24'}
      width={props.width || '24'}
      height={props.height || '24'}
      transform={props.transform || transform}
    >
      <G strokeWidth='0' />
      <G strokeLinecap='round' strokeLinejoin='round' />
      <G>
        <Path d='M4 6H20M4 12H14M4 18H9' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      </G>
    </ReactNativeSvg>
  )
}

export default MenuIcon
