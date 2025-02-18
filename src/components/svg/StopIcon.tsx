import React from 'react'
import { G, Path } from 'react-native-svg'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const StopIcon: React.FC<Props> = (props: Props) => {
  const svgProps = {
    width: props.width || '16',
    height: props.height || '16',
    viewBox: props.viewBox || '0 0 16 16',
    fill: props.fill || 'rgb(0%,23.529412%,20.784314%)',
    version: props.version || '1.1',
  }
  return (
    <ReactNativeSvg width={svgProps.width} height={svgProps.height} viewBox={svgProps.viewBox} fill={svgProps.fill}>
      <G>
        <Path
          style={{
            stroke: 'none',
            fillRule: 'nonzero',
            fillOpacity: 1,
            fill: svgProps.fill,
          }}
          d='M 10.113281 5.691406 L 5.886719 5.691406 C 5.785156 5.691406 5.703125 5.769531 5.703125 5.871094 L 5.703125 10.144531 C 5.703125 10.246094 5.785156 10.328125 5.886719 10.328125 L 10.113281 10.328125 C 10.214844 10.328125 10.296875 10.246094 10.296875 10.144531 L 10.296875 5.871094 C 10.296875 5.769531 10.214844 5.691406 10.113281 5.691406 Z M 10.113281 5.691406 '
        />
        <Path
          style={{
            stroke: 'none',
            fillRule: 'nonzero',
            fillOpacity: 1,
            fill: svgProps.fill,
          }}
          d='M 8 0 C 3.582031 0 0 3.582031 0 8 C 0 12.417969 3.582031 16 8 16 C 12.417969 16 16 12.417969 16 8 C 16 3.582031 12.417969 0 8 0 Z M 8 14.664062 C 4.320312 14.664062 1.335938 11.679688 1.335938 8 C 1.335938 4.320312 4.320312 1.335938 8 1.335938 C 11.679688 1.335938 14.664062 4.320312 14.664062 8 C 14.664062 11.679688 11.679688 14.664062 8 14.664062 Z M 8 14.664062 '
        />
      </G>
    </ReactNativeSvg>
  )
}

export default StopIcon
