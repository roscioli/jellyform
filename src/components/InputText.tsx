import React from 'react'
import FieldBlock from './FieldBlock'

export interface InputTextProps {
  name: string
  required?: boolean
  error?: string
  label: string
  value: string
  type: 'number' | 'text' | 'password' | 'email'
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

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
    <FieldBlock
      label={label}
      name={name}
      required={required}
      error={error}
      disabled={disabled}
    >
      <input
        data-testid={`input-${name}`}
        id={name}
        type={type}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        disabled={disabled}
      />
    </FieldBlock>
  )
}
