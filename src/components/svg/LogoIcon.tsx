import React from 'react'
import { G, Path } from 'react-native-svg'
import ReactNativeSvg, { Props } from './ReactNativeSvg'

const LogoIcon: React.FC<Props> = (props: Props) => {
  return (
    <ReactNativeSvg
      {...props}
      width={props.width || '100'}
      height={props.height || '100'}
      viewBox={props.viewBox || '0 0 100 100'}
      fill={props.fill || '#08786B'}
    >
      <G>
        <Path
          d='M50 66.4219C50 66.4219 41.6027 74.7661 40.6875 75.6875C40.6875 75.6875 40.6875 85.1093 40.6875 85.1093C40.6875 85.3437 40.7813 85.5625 40.9687 85.7031L49.5 92.7812C49.7888 93.031 50.2113 93.0312 50.5 92.7812L59.0313 85.7031C59.2188 85.5625 59.3125 85.3437 59.3125 85.1093V75.6875C58.4017 74.7728 50 66.4219 50 66.4219Z'
          fill={props.fill}
        />
        <Path
          d='M50 33.5781C50 33.5781 58.3974 25.2328 59.3125 24.3125L59.3126 14.2968C59.3126 14.0625 59.2032 13.8281 59 13.6719L50.4688 7.1875C50.1875 6.98438 49.8125 6.98438 49.5313 7.1875L41 13.6719C40.7969 13.8281 40.6875 14.0625 40.6875 14.2968V24.3125C41.5983 25.2262 50 33.5781 50 33.5781Z'
          fill={props.fill}
        />
        <Path
          d='M33.5 50C33.5 50 25.1287 41.6405 24.1874 40.7344C24.1874 40.7344 14.7187 40.7344 14.7187 40.7344C14.4844 40.7344 14.2656 40.8281 14.125 41L6.99995 49.5C6.76564 49.7812 6.76564 50.2187 6.99995 50.5L14.125 59C14.2656 59.1718 14.4844 59.2656 14.7187 59.2656H24.1875C24.1875 59.2656 31.898 51.5911 33.5 50Z'
          fill={props.fill}
        />
        <Path
          d='M93.0157 49.5313L86.5 41.0313C86.3438 40.8438 86.1093 40.7344 85.875 40.7344H75.8125C74.8891 41.6438 66.5 50 66.5 50C66.5 50 74.8825 58.3519 75.8125 59.2656C75.8125 59.2656 85.875 59.2656 85.875 59.2656C86.1093 59.2656 86.3438 59.1562 86.5 58.9687L93.0157 50.4687C93.2343 50.1875 93.2343 49.8125 93.0157 49.5313Z'
          fill={props.fill}
        />
        <Path
          d='M25.1562 61.6093L18.4688 68.2656C18.2969 68.4374 18.2187 68.6562 18.2344 68.8905L19.25 79.9062C19.2813 80.2812 19.5782 80.5781 19.9532 80.6093L31.0156 81.6093C31.25 81.6249 31.4688 81.5468 31.6406 81.3749L38.3437 74.7031C38.3562 73.4135 38.3437 61.6093 38.3437 61.6093C36.0311 61.6092 25.1562 61.6093 25.1562 61.6093Z'
          fill={props.fill}
        />
        <Path
          d='M74.8437 38.3906L81.9531 31.3125C82.1249 31.1406 82.203 30.9062 82.1719 30.6563L80.7499 20.0625C80.7031 19.7188 80.4374 19.4375 80.0781 19.3906L69.4374 17.9844C69.1875 17.9531 68.9531 18.0312 68.7812 18.2031L61.6562 25.2969C61.6431 26.5824 61.6562 38.3906 61.6562 38.3906C63.9613 38.3908 74.8437 38.3906 74.8437 38.3906Z'
          fill={props.fill}
        />
        <Path
          d='M25.1562 38.3907C28.5419 38.4107 34.895 38.3762 38.3438 38.3907C38.3437 38.3907 38.3579 26.594 38.3437 25.2969C38.3437 25.2969 31.6406 18.625 31.6406 18.625C31.4688 18.4532 31.25 18.3751 31.0156 18.3906L19.9532 19.3906C19.5782 19.4219 19.2813 19.7188 19.25 20.0938L18.2344 31.1094C18.2187 31.3438 18.2969 31.5626 18.4688 31.7344L25.1562 38.3907Z'
          fill={props.fill}
        />
        <Path
          d='M74.8437 61.6094C71.4576 61.5874 65.1054 61.6252 61.6562 61.6093C61.6803 65.0632 61.6389 71.3172 61.6563 74.7031L68.7812 81.7969C68.9218 81.9532 69.1249 82.0313 69.328 82.0313C69.5532 82.0394 79.8798 80.6069 80.0782 80.6094C80.4374 80.5625 80.7031 80.2813 80.7499 79.9375L82.1718 69.3438C82.203 69.0937 82.1249 68.8594 81.9531 68.6874L74.8437 61.6094Z'
          fill={props.fill}
        />
        <Path
          d='M72.4843 59.2657C71.5842 58.3636 63.1718 50 63.1718 50C63.1718 50 71.5825 41.6406 72.4842 40.7345C71.2147 40.7217 68.2388 40.7436 66.9375 40.7344C66.9375 40.7344 59.3125 40.7344 59.3125 40.7344C59.2888 37.3278 59.3295 30.9774 59.3124 27.6251C56.947 29.9693 52.418 34.4945 49.9999 36.8906C49.9999 36.8906 41.595 28.5172 40.6874 27.6251C40.6752 28.89 40.6874 40.7344 40.6874 40.7344C37.2587 40.7578 30.8902 40.7176 27.5156 40.7345C29.8749 43.0957 34.4105 47.5934 36.8281 50C36.8281 50 28.4053 58.3519 27.5156 59.2656C28.7851 59.2784 40.6874 59.2656 40.6874 59.2656C40.7111 62.6723 40.6703 69.0227 40.6874 72.3749C43.0402 70.0175 47.5881 65.5123 49.9999 63.1094C49.9999 63.1094 58.3973 71.4949 59.3124 72.3749C59.3247 71.11 59.3125 59.2656 59.3125 59.2656C61.5545 59.2627 72.4843 59.2657 72.4843 59.2657Z'
          fill={props.fill}
        />
      </G>
    </ReactNativeSvg>
  )
}

export default LogoIcon
