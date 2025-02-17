import React from 'react'
import { G, Path, ClipPath, Rect } from 'react-native-svg'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const CopyIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      {...props}
      color={props.color || 'currentColor'}
      fill={props.fill || 'currentColor'}
      stroke={props.stroke || 'currentColor'}
      strokeWidth='0'
      viewBox={props.viewBox || '0 0 18 18'}
      width={props.width || '18'}
      height={props.height || '18'}
      transform={props.transform}
    >
      <G clipPath='url(#clip0_130_1840)'>
        <Path d='M15.4512 17.4287H6.48633C5.3958 17.4287 4.50879 16.5417 4.50879 15.4512V6.48633C4.50879 5.3958 5.3958 4.50879 6.48633 4.50879H15.4512C16.5417 4.50879 17.4287 5.3958 17.4287 6.48633V15.4512C17.4287 16.5417 16.5417 17.4287 15.4512 17.4287ZM6.48633 5.82715C6.12285 5.82715 5.82715 6.12285 5.82715 6.48633V15.4512C5.82715 15.8146 6.12285 16.1104 6.48633 16.1104H15.4512C15.8146 16.1104 16.1104 15.8146 16.1104 15.4512V6.48633C16.1104 6.12285 15.8146 5.82715 15.4512 5.82715H6.48633ZM3.19043 12.1553H2.53125C2.16777 12.1553 1.87207 11.8596 1.87207 11.4961V2.53125C1.87207 2.16777 2.16777 1.87207 2.53125 1.87207H11.4961C11.8596 1.87207 12.1553 2.16777 12.1553 2.53125V3.15747H13.4736V2.53125C13.4736 1.44072 12.5866 0.553711 11.4961 0.553711H2.53125C1.44072 0.553711 0.553711 1.44072 0.553711 2.53125V11.4961C0.553711 12.5866 1.44072 13.4736 2.53125 13.4736H3.19043V12.1553Z' />
      </G>

      <ClipPath id='clip0_130_1840'>
        <Rect width='18' height='18' fill='white' />
      </ClipPath>
    </ReactNativeSvg>
  )
}

export default CopyIcon
