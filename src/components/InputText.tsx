import React from 'react'
import { FieldBlockProps, wrapCustomInputComponent } from './FieldBlock'

export type InputTextProps = FieldBlockProps & {
  value: string
  type: 'number' | 'text' | 'password' | 'email'
  onChange: (value: string) => void
}

export const InputText = wrapCustomInputComponent((props: InputTextProps) => (
  <input
    data-testid={`input-${props.name}`}
    id={props.name}
    type={props.type}
    onChange={(e) => props.onChange(e.target.value)}
    value={props.value}
    disabled={props.disabled}
  />
))
