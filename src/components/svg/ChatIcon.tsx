import { useDirection } from '@/hooks'
import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'
import { Path } from 'react-native-svg'

const ChatIcon: React.FC<Props> = (props: Props) => {
  const { isRTL } = useDirection()
  const svgProps = {
    width: props.width || '32',
    height: props.height || '32',
    viewBox: props.viewBox || '0 0 32 32',
    fill: props.fill || '#FFFFFF',
    transform: props.transform || isRTL ? 'scale(-1, 1)' : 'scale(1, 1)',
  }
  return (
    <ReactNativeSvg
      {...props}
      width={svgProps.width}
      height={svgProps.height}
      viewBox={svgProps.viewBox}
      fill={svgProps.fill}
      transform={svgProps.transform}
    >
      <Path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M22.333 20.3693C22.3557 20.38 22.377 20.3947 22.397 20.4107L26.0263 23.4347C26.3237 23.6827 26.7397 23.7373 27.0903 23.572C27.4423 23.408 27.6663 23.0547 27.6663 22.6667V20.1947C28.2623 20.0253 28.813 19.7053 29.2597 19.26C29.9463 18.572 30.333 17.6387 30.333 16.6667V6.66667C30.333 5.69467 29.9463 4.76133 29.2597 4.07333C28.5717 3.38667 27.6383 3 26.6663 3H14.6663C13.6943 3 12.761 3.38667 12.073 4.07333C11.3863 4.76133 10.9997 5.69467 10.9997 6.66667V7H17.333C18.6597 7 19.9303 7.52667 20.869 8.464C21.8063 9.40267 22.333 10.6733 22.333 12V20.3693Z'
      />
      <Path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M21 11.9997C21 11.0277 20.6133 10.0943 19.9267 9.40634C19.2387 8.71967 18.3053 8.33301 17.3333 8.33301H5.33333C4.36133 8.33301 3.428 8.71967 2.74 9.40634C2.05333 10.0943 1.66667 11.0277 1.66667 11.9997V21.9997C1.66667 22.9717 2.05333 23.905 2.74 24.593C3.428 25.2797 4.36133 25.6663 5.33333 25.6663H7.80533C8.19333 25.6663 8.54667 25.8903 8.71067 26.2423C8.876 26.593 8.82133 27.009 8.57333 27.3063L5.54933 30.9357C5.53333 30.9557 5.51867 30.977 5.508 30.9997H17.3333C18.3053 30.9997 19.2387 30.613 19.9267 29.9263C20.6133 29.2383 21 28.305 21 27.333V11.9997Z'
      />
    </ReactNativeSvg>
  )
}

export default ChatIcon
