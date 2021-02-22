import React, { Fragment } from 'react'
import { getCssClassName } from '../utils'

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

export const getLabelText = (label: string, required?: boolean) => (
  <Fragment>
    {label}
    {required ? (
      <span className={getCssClassName('fieldBlock-asterisk')}> *</span>
    ) : null}
  </Fragment>
)

const getFieldBlockClassName = (error?: string, disabled?: boolean) =>
  error
    ? ERROR_FORM_FIELD_CLASS
    : disabled
    ? DISABLED_FORM_FIELD_CLASS
    : FORM_FIELD_CLASS

export const FieldBlock: React.FC<FieldProps> = ({
  label,
  children: inputElement,
  name,
  required,
  error,
  disabled
}) => {
  return (
    <div className={getFieldBlockClassName(error, disabled)}>
      <label htmlFor={name}>{getLabelText(label, required)}</label>
      {inputElement}
      <div className={getCssClassName('fieldBlock-errorText')}>
        {error ? <span>{error}</span> : null}
      </div>
    </div>
  )
}

const wrapCustomInputComponent = (inputComponent: JSX.Element) => (props) => (
  <FieldBlock {...props}>{inputComponent}</FieldBlock>
)

export default FieldBlock
