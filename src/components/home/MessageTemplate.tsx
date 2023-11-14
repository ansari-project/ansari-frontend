import React, { ReactNode } from 'react'

interface MessageTemplateProps {
  hasMargin?: boolean
  children?: ReactNode
}

const MessageTemplate: React.FC<MessageTemplateProps> = ({ children, hasMargin }) => {
  return <div className={`flex flex-row w-full ${hasMargin ? 'mb-3 md:mb-6 md:pl-6' : ''}`}>{children}</div>
}

export default MessageTemplate
