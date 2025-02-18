import React from 'react'
import { Path } from 'react-native-svg'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const CloseIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      {...props}
      width={props.width || '14'}
      height={props.height || '15'}
      viewBox={props.viewBox || '0 0 14 15'}
      fill={props.fill || '#D0D0D0'}
    >
      <Path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2.91728 10.7583C2.68949 10.9862 2.68952 11.3555 2.91735 11.5833C3.14517 11.8111 3.51452 11.8111 3.7423 11.5832L7.00036 8.32463L10.2587 11.583C10.4865 11.8107 10.8558 11.8107 11.0836 11.583C11.3114 11.3552 11.3114 10.9858 11.0836 10.758L7.82525 7.49962L11.0834 4.24089C11.3111 4.01307 11.3111 3.64373 11.0833 3.41594C10.8555 3.18815 10.4861 3.18818 10.2583 3.41601L7.00024 6.67467L3.74191 3.41629C3.5141 3.18849 3.14475 3.18849 2.91695 3.41629C2.68914 3.6441 2.68914 4.01344 2.91695 4.24125L6.17541 7.49968L2.91728 10.7583Z'
      />
    </ReactNativeSvg>
  )
}

export default CloseIcon
