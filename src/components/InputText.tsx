import React from 'react'
import FieldBlock, { FieldProps } from './FieldBlock'

export type InputTextProps = FieldProps & {
  value: string
  type: 'number' | 'text' | 'password' | 'email'
  onChange: (value: string) => void
}

export const InputText = (props: InputTextProps) => {
  return (
    <FieldBlock
      label={props.label}
      name={props.name}
      required={props.required}
      error={props.error}
      disabled={props.disabled}
    >
      <input
        data-testid={`input-${props.name}`}
        id={props.name}
        type={props.type}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
        disabled={props.disabled}
      />
    </FieldBlock>
  )
}
