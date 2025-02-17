import React from 'react'
import { Path, Circle } from 'react-native-svg'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const LogoRoundIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox={props.viewBox || '0 0 24 24'}
      fill={props.fill || '#1D1D1D'}
    >
      <Circle cx='12' cy='12' r='12' fill={props.color || '#FFFFFF'} />
      <Path
        d='M11.9997 15.4395C11.9997 15.4395 10.2493 17.1873 10.0586 17.3803C10.0586 17.3803 10.0586 19.3539 10.0586 19.3539C10.0586 19.403 10.0781 19.4488 10.1172 19.4782L11.8955 20.9609C11.9557 21.0132 12.0437 21.0133 12.1039 20.9609L13.8822 19.4782C13.9213 19.4488 13.9408 19.403 13.9408 19.3539V17.3803C13.7509 17.1887 11.9997 15.4395 11.9997 15.4395Z'
        fill={props.fill}
      />
      <Path
        d='M11.9997 8.5599C11.9997 8.5599 13.75 6.81183 13.9408 6.61905L13.9408 4.52109C13.9408 4.47201 13.918 4.42291 13.8757 4.39019L12.0974 3.03191C12.0388 2.98936 11.9606 2.98936 11.902 3.03191L10.1237 4.39019C10.0814 4.42291 10.0586 4.47201 10.0586 4.52109V6.61905C10.2484 6.81045 11.9997 8.5599 11.9997 8.5599Z'
        fill={props.fill}
      />
      <Path
        d='M8.5603 12.0014C8.5603 12.0014 6.81538 10.2504 6.61919 10.0606C6.61919 10.0605 4.64553 10.0605 4.64553 10.0605C4.59669 10.0605 4.55108 10.0802 4.52176 10.1162L3.03663 11.8967C2.98779 11.9556 2.98779 12.0472 3.03663 12.1061L4.52176 13.8866C4.55109 13.9226 4.59669 13.9422 4.64553 13.9422H6.61919C6.61919 13.9422 8.22637 12.3347 8.5603 12.0014Z'
        fill={props.fill}
      />
      <Path
        d='M20.9664 11.9032L19.6082 10.1227C19.5757 10.0835 19.5268 10.0605 19.478 10.0605H17.3806C17.1881 10.251 15.4395 12.0014 15.4395 12.0014C15.4395 12.0014 17.1867 13.7509 17.3806 13.9422C17.3806 13.9422 19.478 13.9422 19.478 13.9422C19.5268 13.9422 19.5757 13.9193 19.6082 13.8801L20.9664 12.0996C21.012 12.0407 21.012 11.9621 20.9664 11.9032Z'
        fill={props.fill}
      />
      <Path
        d='M6.82113 14.4307L5.4272 15.825C5.39137 15.861 5.37508 15.9068 5.37834 15.9559L5.59004 18.2633C5.59656 18.3418 5.65844 18.404 5.7366 18.4106L8.04246 18.62C8.09132 18.6233 8.13692 18.6069 8.17274 18.5709L9.56993 17.1734C9.57253 16.9033 9.56993 14.4307 9.56993 14.4307C9.08788 14.4306 6.82113 14.4307 6.82113 14.4307Z'
        fill={props.fill}
      />
      <Path
        d='M17.1778 9.56688L18.6596 8.08423C18.6954 8.04823 18.7117 7.99913 18.7052 7.94678L18.4088 5.72771C18.3991 5.65572 18.3437 5.59681 18.2688 5.58698L16.0509 5.29243C15.9988 5.28588 15.9499 5.30224 15.9141 5.33824L14.429 6.82416C14.4262 7.09343 14.429 9.56688 14.429 9.56688C14.9094 9.56692 17.1778 9.56688 17.1778 9.56688Z'
        fill={props.fill}
      />
      <Path
        d='M6.82113 9.56771C7.52683 9.57191 8.85109 9.56468 9.56994 9.56772C9.56993 9.56771 9.57288 7.09668 9.56992 6.82499C9.56993 6.82499 8.17274 5.42744 8.17274 5.42744C8.13692 5.39144 8.09132 5.37508 8.04246 5.37834L5.7366 5.58781C5.65844 5.59436 5.59656 5.65654 5.59004 5.73509L5.37834 8.04251C5.37508 8.09161 5.39138 8.13744 5.4272 8.17343L6.82113 9.56771Z'
        fill={props.fill}
      />
      <Path
        d='M17.1774 14.4312C16.4716 14.4266 15.1476 14.4345 14.4286 14.4312C14.4337 15.1546 14.425 16.4646 14.4287 17.1739L15.9138 18.6598C15.9431 18.6925 15.9854 18.7089 16.0278 18.7089C16.0747 18.7106 18.2272 18.4105 18.2685 18.4111C18.3434 18.4012 18.3988 18.3423 18.4085 18.2703L18.7049 16.0513C18.7114 15.9989 18.6951 15.9498 18.6593 15.9138L17.1774 14.4312Z'
        fill={props.fill}
      />
      <Path
        d='M15.5825 13.4901C15.4391 13.345 14.0988 11.9993 14.0988 11.9993C14.0988 11.9993 15.4388 10.6544 15.5825 10.5086C15.3802 10.5065 14.9061 10.5101 14.6988 10.5086C14.6988 10.5086 13.4839 10.5086 13.4839 10.5086C13.4801 9.96049 13.4866 8.93877 13.4839 8.39942C13.1071 8.77658 12.3855 9.50464 12.0002 9.89016C12.0002 9.89016 10.6611 8.54295 10.5165 8.39941C10.5146 8.60292 10.5165 10.5086 10.5165 10.5086C9.97026 10.5124 8.95561 10.5059 8.41797 10.5086C8.79385 10.8885 9.51648 11.6121 9.90165 11.9993C9.90165 11.9993 8.55971 13.3431 8.41797 13.4901C8.62023 13.4922 10.5165 13.4901 10.5165 13.4901C10.5203 14.0382 10.5138 15.0599 10.5165 15.5993C10.8914 15.22 11.616 14.4951 12.0002 14.1085C12.0002 14.1085 13.3381 15.4577 13.4839 15.5993C13.4859 15.3958 13.4839 13.4901 13.4839 13.4901C13.8411 13.4896 15.5825 13.4901 15.5825 13.4901Z'
        fill={props.fill}
      />
    </ReactNativeSvg>
  )
}

export default LogoRoundIcon
