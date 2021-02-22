import React, { Fragment } from 'react'
import { getCssClassName } from '../utils'

export type FieldBlockProps = {
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

const getLabelText = (label: string, required?: boolean) => (
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

export const FieldBlock: React.FC<FieldBlockProps> = ({
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

export function wrapCustomInputComponent<T extends FieldBlockProps>(
  InputComponent: React.FC<T>
) {
  return (props: T) => (
    <FieldBlock {...props}>
      <InputComponent {...props} />
    </FieldBlock>
  )
}

export default FieldBlock
