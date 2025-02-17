import React from 'react'
import { G, Path, ClipPath, Rect } from 'react-native-svg'
import ReactNativeSvg, { Props } from './ReactNativeSvg'
import { useDirection } from '@/hooks'

const EditIcon: React.FC<Props> = (props: Props) => {
  const { isRTL } = useDirection()

  return (
    <ReactNativeSvg
      width={props.width || '18'}
      height={props.height || '18'}
      viewBox={props.viewBox || '0 0 18 18'}
      fill={props.fill || 'white'}
      transform={props.transform || isRTL ? 'scale(-1, 1)' : 'scale(1, 1)'}
    >
      <G clipPath='url(#clip0_413_279)'>
        <Path
          d='M17.8423 5.23437L12.9673 0.171929C12.8083 0.00699849 12.5646 -0.044774 12.3524 0.0406437C12.1394 0.126885 11.9999 0.333151 11.9999 0.562626V3.00019H11.8124C7.78048 3.00019 4.5 6.28067 4.5 10.3126V11.4376C4.5 11.6985 4.68374 11.916 4.93794 11.9754C4.97927 11.9858 5.02047 11.9903 5.06167 11.9903C5.27398 11.9903 5.47722 11.8658 5.57541 11.6701C6.62995 9.56033 8.75015 8.25008 11.1089 8.25008H11.9999V10.6875C11.9999 10.9171 12.1394 11.1234 12.3524 11.2088C12.5632 11.295 12.8083 11.2426 12.9673 11.0775L17.8423 6.01508C18.0523 5.79686 18.0523 5.45341 17.8423 5.23437Z'
          fill={props.fill}
        />
        <Path
          d='M15.7498 17.9997H2.24997C1.00949 17.9997 0 16.9904 0 15.7498V5.24997C0 4.00949 1.00949 3 2.24997 3H4.49995C4.91468 3 5.24989 3.33522 5.24989 3.74995C5.24989 4.16467 4.91468 4.49989 4.49995 4.49989H2.24997C1.83593 4.49989 1.49989 4.83593 1.49989 5.24997V15.7498C1.49989 16.1638 1.83593 16.4998 2.24997 16.4998H15.7498C16.1637 16.4998 16.4998 16.1638 16.4998 15.7498V9.74992C16.4998 9.33519 16.835 8.99984 17.2497 8.99984C17.6646 8.99984 17.9998 9.33519 17.9998 9.74992V15.7498C17.9998 16.9904 16.9903 17.9997 15.7498 17.9997Z'
          fill={props.fill}
        />
      </G>

      <ClipPath id='clip0_413_279'>
        <Rect width='18' height='18' fill={props.fill} />
      </ClipPath>
    </ReactNativeSvg>
  )
}

export default EditIcon
