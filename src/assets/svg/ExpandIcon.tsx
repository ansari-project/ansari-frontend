import React from 'react'
import EndeavorFancySVG, { Props } from './EndeavorFancySVG'
import { useDirection } from '@endeavorpal/hooks'

const ExpandIcon: React.FC<Props> = (props: Props) => {
  const { isRTL } = useDirection()
  return (
    <EndeavorFancySVG
      {...props}
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox={props.viewBox || '0 0 24 24'}
      fill={props.fill || 'white'}
      transform={props.transform || isRTL ? 'scale(-1, 1)' : 'scale(1, 1)'}
    >
      <path d='M3.72 2.18182H8.18182C8.47115 2.18182 8.74862 2.06688 8.95321 1.8623C9.15779 1.65771 9.27273 1.38024 9.27273 1.09091C9.27273 0.801582 9.15779 0.524105 8.95321 0.31952C8.74862 0.114935 8.47115 0 8.18182 0H1.09091C0.801582 0 0.524105 0.114935 0.31952 0.31952C0.114935 0.524105 0 0.801582 0 1.09091V8.18182C0 8.47114 0.114935 8.74862 0.31952 8.95321C0.524105 9.15779 0.801582 9.27273 1.09091 9.27273C1.38024 9.27273 1.65771 9.15779 1.8623 8.95321C2.06688 8.74862 2.18182 8.47114 2.18182 8.18182V3.70909L8.46546 9.99273C8.67415 10.1714 8.94259 10.2648 9.21715 10.2542C9.49171 10.2436 9.75215 10.1298 9.94643 9.93552C10.1407 9.74124 10.2545 9.48079 10.2651 9.20624C10.2757 8.93168 10.1824 8.66324 10.0036 8.45455L3.72 2.18182Z' />
      <path d='M23.9997 22.9086V15.8286C23.9997 15.5393 23.8848 15.2618 23.6802 15.0572C23.4756 14.8526 23.1981 14.7377 22.9088 14.7377C22.6194 14.7377 22.342 14.8526 22.1374 15.0572C21.9328 15.2618 21.8179 15.5393 21.8179 15.8286V20.2904L15.5124 13.985C15.3037 13.8063 15.0353 13.7129 14.7607 13.7235C14.4862 13.7341 14.2257 13.8479 14.0314 14.0422C13.8371 14.2365 13.7233 14.4969 13.7127 14.7715C13.7021 15.046 13.7955 15.3145 13.9742 15.5232L20.2797 21.8177H15.8179C15.5285 21.8177 15.2511 21.9326 15.0465 22.1372C14.8419 22.3418 14.727 22.6193 14.727 22.9086C14.727 23.1979 14.8419 23.4754 15.0465 23.68C15.2511 23.8846 15.5285 23.9995 15.8179 23.9995H22.9088C23.1981 23.9995 23.4756 23.8846 23.6802 23.68C23.8848 23.4754 23.9997 23.1979 23.9997 22.9086Z' />
    </EndeavorFancySVG>
  )
}

export default ExpandIcon
