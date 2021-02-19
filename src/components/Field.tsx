import React from 'react'
import { ErrorMessage, getCssClassName, getLabelText } from '../utils'

export type FieldProps = {
  label: string
  name: string
  required: boolean | undefined
  error: string | undefined
  disabled: boolean | undefined
}

const FORM_FIELD_CLASS = getCssClassName('fieldBlock')
const DISABLED_FORM_FIELD_CLASS =
  FORM_FIELD_CLASS + ' ' + getCssClassName('fieldBlock-disabled')
const ERROR_FORM_FIELD_CLASS =
  FORM_FIELD_CLASS + ' ' + getCssClassName('fieldBlock-error')

export const Field: React.FC<FieldProps> = ({
  label,
  children: inputElement,
  name,
  required,
  error,
  disabled
}) => {
  const className = error
    ? ERROR_FORM_FIELD_CLASS
    : disabled
    ? DISABLED_FORM_FIELD_CLASS
    : FORM_FIELD_CLASS

  return (
    <div className={className}>
      <label htmlFor={name}>{getLabelText(label, required)}</label>
      {inputElement}
      <ErrorMessage error={error} />
    </div>
  )
}

export default Field
