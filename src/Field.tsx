import React from 'react'

interface IProps {
  label: string
  htmlFor: string
  className?: string
  required?: boolean
  customStyles?: React.CSSProperties
}

export const Field: React.FC<IProps> = ({
  className,
  label,
  children,
  htmlFor,
  required,
  customStyles
}) => {
  return (
    <div className={className} style={customStyles}>
      <label htmlFor={htmlFor} className={required ? 'required *' : ''}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default Field
