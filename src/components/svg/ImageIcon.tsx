import React from 'react'
import { Path } from 'react-native-svg'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const ImageIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      {...props}
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox={props.viewBox || '0 0 24 24'}
      fill={props.fill || '#D0D0D0'}
    >
      <Path
        fillRule='evenodd'
        d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM5 5h14v14H5V5zm3.5 8.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'
      />
    </ReactNativeSvg>
  )
}

export default ImageIcon
