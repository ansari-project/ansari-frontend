import { useDirection } from '@/hooks'
import { Path } from 'react-native-svg'
import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const SendIcon: React.FC<Props> = (props: Props) => {
  const { isRTL } = useDirection()
  const svgProps = {
    width: props.width || '20',
    height: props.height || '20',
    viewBox: props.viewBox || '0 0 20 20',
    fill: props.fill || '#fff',
    fillOpacity: props.fillOpacity || '1',
  }
  return (
    <ReactNativeSvg
      width={svgProps.width}
      height={svgProps.height}
      viewBox={svgProps.viewBox}
      fill='none'
      transform={isRTL ? 'scale(-1, 1)' : 'scale(1, 1)'}
    >
      <Path
        d='M17.4908 8.9061L4.36581 1.4147C4.14457 1.29059 3.89081 1.23673 3.63823 1.26028C3.38566 1.28383 3.14622 1.38366 2.95174 1.54653C2.75725 1.70939 2.61692 1.92757 2.54938 2.17209C2.48185 2.4166 2.4903 2.67588 2.57363 2.91548L4.9955 9.98345C4.99519 9.98604 4.99519 9.98866 4.9955 9.99126C4.99506 9.99384 4.99506 9.99648 4.9955 9.99907L2.57363 17.0827C2.5069 17.2711 2.48635 17.4729 2.51372 17.6709C2.54108 17.869 2.61555 18.0576 2.73089 18.2209C2.84622 18.3842 2.99905 18.5175 3.17655 18.6095C3.35405 18.7016 3.55103 18.7497 3.75097 18.7499C3.9679 18.7493 4.18102 18.6928 4.36972 18.5858L17.4877 11.0819C17.6812 10.9735 17.8424 10.8156 17.9547 10.6243C18.067 10.4331 18.1264 10.2154 18.1268 9.99357C18.1272 9.77178 18.0686 9.55388 17.9569 9.36222C17.8453 9.17057 17.6847 9.01206 17.4916 8.90298L17.4908 8.9061ZM3.75097 17.4999V17.4928L6.10566 10.6249L10.626 10.6249C10.7917 10.6249 10.9507 10.559 11.0679 10.4418C11.1851 10.3246 11.251 10.1656 11.251 9.99985C11.251 9.83409 11.1851 9.67512 11.0679 9.55791C10.9507 9.4407 10.7917 9.37485 10.626 9.37485L6.11191 9.37485L3.75566 2.50923L3.75097 2.49985L16.876 9.98657L3.75097 17.4999Z'
        fill={svgProps.fill}
      />
    </ReactNativeSvg>
  )
}

export default SendIcon
