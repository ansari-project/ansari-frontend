import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}
const ErrorMessage: React.FC<Props> = ({ children }) => {
  return (
    <div className='bg-red-100 p-4 rounded-md border-red-800 border'>
      <div className='text-gray-800 text-start font-roboto text-sm md:text-base'>{children}</div>
    </div>
  )
}
export default ErrorMessage
