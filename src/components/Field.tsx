import React from 'react'
import { ErrorMessage, getCssClassName, getLabelText } from '../utils'

interface IProps {
  label: string
  name: string
  required: boolean | undefined
  error: string | undefined
  disabled: boolean | undefined
}

const FORM_FIELD_CLASS = getCssClassName('form-field')
const DISABLED_FORM_FIELD_CLASS =
  FORM_FIELD_CLASS + ' ' + getCssClassName('form-field-disabled')

export const Field: React.FC<IProps> = ({
  label,
  children: inputElement,
  name,
  required,
  error,
  disabled
}) => {
  return (
    <div className={disabled ? DISABLED_FORM_FIELD_CLASS : FORM_FIELD_CLASS}>
      <label htmlFor={name}>{getLabelText(label, required)}</label>
      {inputElement}
      <ErrorMessage error={error} />
    </div>
  )
}

export default Field
