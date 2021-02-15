import React from 'react'
import { ErrorMessage, getDisabledClass, getLabelText } from './utils'

interface InputTextProps {
  name: string
  required?: boolean
  error?: string
  label: string
  value: string
  type: 'number' | 'text' | 'password' | 'email'
  onChange: (value: string) => void
  disabled?: boolean
}

// eslint-disable-next-line import/prefer-default-export
export const InputText = (props: InputTextProps) => {
  const {
    name,
    label,
    type,
    onChange,
    value,
    required,
    error,
    disabled
  } = props
  return (
    <div className={`form-field ${getDisabledClass(disabled)}`}>
      <label>{getLabelText(label, required)}</label>
      <input
        data-testid={`input-${name}`}
        id={name}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        disabled={disabled}
      />
      <ErrorMessage error={error} />
    </div>
  )
}
