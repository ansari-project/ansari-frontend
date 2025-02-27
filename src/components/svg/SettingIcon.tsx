import React from 'react'
import { Path, Circle } from 'react-native-svg'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const SettingIcon: React.FC<Props> = (props: Props) => {
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
    >
      <Path
        d='M11.6439 3C10.9352 3 10.2794 3.37508 9.92002 3.98596L9.49644 4.70605C8.96184 5.61487 7.98938 6.17632 6.93501 6.18489L6.09967 6.19168C5.39096 6.19744 4.73823 6.57783 4.38386 7.19161L4.02776 7.80841C3.67339 8.42219 3.67032 9.17767 4.01969 9.7943L4.43151 10.5212C4.95127 11.4386 4.95127 12.5615 4.43151 13.4788L4.01969 14.2057C3.67032 14.8224 3.67339 15.5778 4.02776 16.1916L4.38386 16.8084C4.73823 17.4222 5.39096 17.8026 6.09966 17.8083L6.93502 17.8151C7.98939 17.8237 8.96185 18.3851 9.49645 19.294L9.92002 20.014C10.2794 20.6249 10.9352 21 11.6439 21H12.3561C13.0648 21 13.7206 20.6249 14.08 20.014L14.5035 19.294C15.0381 18.3851 16.0106 17.8237 17.065 17.8151L17.9004 17.8083C18.6091 17.8026 19.2618 17.4222 19.6162 16.8084L19.9723 16.1916C20.3267 15.5778 20.3298 14.8224 19.9804 14.2057L19.5686 13.4788C19.0488 12.5615 19.0488 11.4386 19.5686 10.5212L19.9804 9.7943C20.3298 9.17767 20.3267 8.42219 19.9723 7.80841L19.6162 7.19161C19.2618 6.57783 18.6091 6.19744 17.9004 6.19168L17.065 6.18489C16.0106 6.17632 15.0382 5.61487 14.5036 4.70605L14.08 3.98596C13.7206 3.37508 13.0648 3 12.3561 3H11.6439Z'
        stroke={props.stroke || 'currentColor'}
        strokeWidth={props.strokeWidth || '2'}
        strokeLinejoin={props.strokeLinejoin || 'round'}
      ></Path>
      <Circle cx='12' cy='12' r='2.5' stroke={props.stroke || 'currentColor'} strokeWidth='2'></Circle>
    </ReactNativeSvg>
  )
}

export default SettingIcon
