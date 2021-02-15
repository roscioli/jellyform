import React from 'react'
import Field from './Field'
import Select, { SelectChangeValue } from './Select'
// import { Field, Select, SelectChangeValue } from '@pinwheel/uikit'
// import { getErrorStateCss } from '../TestConsole/form-helpers'
import { ErrorMessage, getDisabledClass } from './utils'

interface InputSelectProps {
  error?: string
  name: string
  required?: boolean
  options: any[]
  value?: SelectChangeValue
  isClearable?: boolean
  isSearchable?: boolean
  onBlur?: any
  onChangeHandler?: (value: string) => void
  onInputChange?: (input: string) => void
  noOptionsMessage?: () => string
  customStyles?: any
  disabled?: boolean
  label: string
}

interface FormFieldProps {
  name: string
  label: string
  children?: React.ReactNode
  required?: boolean
  error?: string
  disabled?: boolean
}

const FormField = ({
  name,
  label,
  children,
  required,
  // error,
  disabled
}: FormFieldProps) => (
  <Field
    className={getDisabledClass(disabled)}
    label={label}
    htmlFor={name}
    required={required}
  >
    {children}
  </Field>
)

// eslint-disable-next-line import/prefer-default-export
export const InputSelect = (props: InputSelectProps) => {
  const { name, required, error, disabled, label, ...rest } = props
  return (
    <FormField
      label={label}
      name={name}
      required={required}
      disabled={disabled}
    >
      <Select id={name} name={name} isDisabled={disabled} {...rest} />
      <ErrorMessage error={error} />
    </FormField>
  )
}

// eslint-disable-next-line import/prefer-default-export
export const MultiSelect = (props: InputSelectProps) => {
  const { name, required, error, disabled, label, ...rest } = props
  return (
    <FormField
      label={label}
      name={name}
      required={required}
      disabled={disabled}
    >
      <Select isMulti id={name} name={name} isDisabled={disabled} {...rest} />
      <ErrorMessage error={error} />
    </FormField>
  )
}
