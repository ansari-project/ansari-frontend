import React, { ReactNode } from 'react'

type Props = {
  children: ReactNode
}
const Container: React.FC<Props> = ({ children }) => {
  return <div className='container overflow-y-hidden justify-between'>{children}</div>
}

export default Container
