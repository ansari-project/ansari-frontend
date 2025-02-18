import React from 'react'
import ReactNativeSvg, { Props } from './ReactNativeSvg'
import { Path } from 'react-native-svg'

const AnsariWordMobileIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      {...props}
      width={props.width || '72'}
      height={props.height || '20'}
      viewBox={props.viewBox || '0 0 72 20'}
      fill={props.fill}
    >
      <Path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M0.384 19L6.936 2.2H9.864L16.368 19H13.128L9.528 9.448C9.448 9.256 9.336 8.952 9.192 8.536C9.064 8.12 8.92 7.672 8.76 7.192C8.6 6.696 8.456 6.24 8.328 5.824C8.2 5.392 8.104 5.08 8.04 4.888L8.64 4.864C8.544 5.184 8.432 5.544 8.304 5.944C8.176 6.344 8.04 6.76 7.896 7.192C7.752 7.624 7.608 8.04 7.464 8.44C7.336 8.84 7.216 9.2 7.104 9.52L3.504 19H0.384ZM3.36 15.16L4.44 12.448H12.096L13.248 15.16H3.36ZM18.4858 19V6.352H21.3658L21.4138 8.944L20.8618 9.232C21.0218 8.656 21.3338 8.136 21.7978 7.672C22.2618 7.192 22.8138 6.808 23.4538 6.52C24.0938 6.232 24.7498 6.088 25.4218 6.088C26.3818 6.088 27.1818 6.28 27.8218 6.664C28.4778 7.048 28.9658 7.624 29.2858 8.392C29.6218 9.16 29.7898 10.12 29.7898 11.272V19H26.8378V11.488C26.8378 10.848 26.7498 10.32 26.5738 9.904C26.3978 9.472 26.1258 9.16 25.7578 8.968C25.3898 8.76 24.9418 8.664 24.4138 8.68C23.9818 8.68 23.5818 8.752 23.2138 8.896C22.8618 9.024 22.5498 9.216 22.2778 9.472C22.0218 9.712 21.8138 9.992 21.6538 10.312C21.5098 10.632 21.4378 10.984 21.4378 11.368V19H19.9738C19.6858 19 19.4138 19 19.1578 19C18.9178 19 18.6938 19 18.4858 19ZM37.3348 19.24C36.2148 19.24 35.2068 19.056 34.3108 18.688C33.4308 18.304 32.7108 17.76 32.1508 17.056L34.0708 15.4C34.5508 15.944 35.0868 16.336 35.6788 16.576C36.2708 16.816 36.8948 16.936 37.5508 16.936C37.8228 16.936 38.0628 16.904 38.2708 16.84C38.4948 16.776 38.6868 16.68 38.8468 16.552C39.0068 16.424 39.1268 16.28 39.2068 16.12C39.3028 15.944 39.3508 15.752 39.3508 15.544C39.3508 15.16 39.2068 14.856 38.9188 14.632C38.7588 14.52 38.5028 14.4 38.1508 14.272C37.8148 14.144 37.3748 14.016 36.8308 13.888C35.9668 13.664 35.2468 13.408 34.6708 13.12C34.0948 12.816 33.6468 12.48 33.3268 12.112C33.0548 11.808 32.8468 11.464 32.7028 11.08C32.5748 10.696 32.5108 10.28 32.5108 9.832C32.5108 9.272 32.6308 8.768 32.8708 8.32C33.1268 7.856 33.4708 7.456 33.9028 7.12C34.3348 6.784 34.8388 6.528 35.4148 6.352C35.9908 6.176 36.5908 6.088 37.2148 6.088C37.8548 6.088 38.4708 6.168 39.0628 6.328C39.6708 6.488 40.2308 6.72 40.7428 7.024C41.2708 7.312 41.7188 7.664 42.0868 8.08L40.4548 9.88C40.1508 9.592 39.8148 9.336 39.4468 9.112C39.0948 8.888 38.7348 8.712 38.3668 8.584C37.9988 8.44 37.6548 8.368 37.3348 8.368C37.0308 8.368 36.7588 8.4 36.5188 8.464C36.2788 8.512 36.0788 8.592 35.9188 8.704C35.7588 8.816 35.6308 8.96 35.5348 9.136C35.4548 9.296 35.4148 9.488 35.4148 9.712C35.4308 9.904 35.4788 10.088 35.5588 10.264C35.6548 10.424 35.7828 10.56 35.9428 10.672C36.1188 10.784 36.3828 10.912 36.7348 11.056C37.0868 11.2 37.5428 11.336 38.1028 11.464C38.8868 11.672 39.5428 11.904 40.0708 12.16C40.5988 12.416 41.0148 12.712 41.3188 13.048C41.6228 13.336 41.8388 13.672 41.9668 14.056C42.0948 14.44 42.1588 14.864 42.1588 15.328C42.1588 16.08 41.9428 16.752 41.5108 17.344C41.0948 17.936 40.5188 18.4 39.7828 18.736C39.0628 19.072 38.2468 19.24 37.3348 19.24ZM51.9833 19V10.912C51.9833 10.224 51.7513 9.688 51.2873 9.304C50.8393 8.904 50.2553 8.704 49.5353 8.704C48.8633 8.704 48.2553 8.84 47.7113 9.112C47.1673 9.384 46.6633 9.8 46.1992 10.36L44.3513 8.536C45.1193 7.736 45.9593 7.128 46.8713 6.712C47.7833 6.296 48.7753 6.088 49.8473 6.088C50.8393 6.088 51.7033 6.248 52.4393 6.568C53.1753 6.888 53.7433 7.368 54.1433 8.008C54.5433 8.632 54.7433 9.4 54.7433 10.312V19H51.9833ZM48.3593 19.24C47.5433 19.24 46.8153 19.08 46.1753 18.76C45.5353 18.44 45.0233 18 44.6393 17.44C44.2713 16.864 44.0873 16.192 44.0873 15.424C44.0873 14.768 44.2073 14.184 44.4473 13.672C44.6873 13.16 45.0393 12.744 45.5033 12.424C45.9833 12.088 46.5753 11.832 47.2793 11.656C47.9993 11.48 48.8233 11.392 49.7513 11.392H53.3993L53.1833 13.504H49.5833C49.1673 13.504 48.7913 13.544 48.4553 13.624C48.1193 13.704 47.8313 13.824 47.5913 13.984C47.3673 14.144 47.1993 14.336 47.0873 14.56C46.9753 14.768 46.9193 15.024 46.9193 15.328C46.9193 15.632 46.9913 15.904 47.1353 16.144C47.2953 16.384 47.5113 16.568 47.7833 16.696C48.0713 16.824 48.3993 16.888 48.7673 16.888C49.2793 16.888 49.7673 16.8 50.2313 16.624C50.7113 16.432 51.1353 16.184 51.5033 15.88C51.8713 15.56 52.1593 15.2 52.3673 14.8L52.9673 16.432C52.6313 16.992 52.2153 17.48 51.7193 17.896C51.2393 18.312 50.7113 18.64 50.1353 18.88C49.5753 19.12 48.9833 19.24 48.3593 19.24ZM57.8608 19V6.352H60.7648L60.8128 10.384L60.4048 9.472C60.5808 8.832 60.8848 8.256 61.3168 7.744C61.7488 7.232 62.2448 6.832 62.8048 6.544C63.3808 6.24 63.9808 6.088 64.6048 6.088C64.8768 6.088 65.1328 6.112 65.3728 6.16C65.6288 6.208 65.8368 6.264 65.9968 6.328L65.2048 9.568C65.0288 9.472 64.8128 9.392 64.5568 9.328C64.3008 9.264 64.0448 9.232 63.7888 9.232C63.3888 9.232 63.0048 9.312 62.6368 9.472C62.2848 9.616 61.9728 9.824 61.7008 10.096C61.4288 10.368 61.2128 10.688 61.0528 11.056C60.9088 11.408 60.8368 11.808 60.8368 12.256V19H57.8608ZM68.2984 19V6.352H71.2504V19H68.2984ZM69.7384 3.664C69.1464 3.664 68.6824 3.52 68.3464 3.232C68.0264 2.928 67.8664 2.504 67.8664 1.96C67.8664 1.448 68.0344 1.032 68.3704 0.711999C68.7064 0.391999 69.1624 0.231998 69.7384 0.231998C70.3464 0.231998 70.8104 0.383999 71.1304 0.688C71.4664 0.975999 71.6344 1.4 71.6344 1.96C71.6344 2.456 71.4664 2.864 71.1304 3.184C70.7944 3.504 70.3304 3.664 69.7384 3.664Z'
        fill={props.fill || '#08786B'}
      />
    </ReactNativeSvg>
  )
}

export default AnsariWordMobileIcon
