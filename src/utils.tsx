import React, { Fragment } from 'react'

export const ErrorMessage = ({ error }: { error?: string }) => (
  <div className='form-field-error'>{error ? <span>{error}</span> : null}</div>
)

export const getLabelText = (label: string, required?: boolean) => (
  <Fragment>
    {label}
    {required ? <span className='form-field-asterisk'> *</span> : null}
  </Fragment>
)

export const getDisabledClass = (disabled?: boolean) =>
  disabled ? 'form-field-disabled' : ''

export type InputSelectOption<T = string, U = T> = { value: T; label: U }

export const getEmptyOption = (): InputSelectOption<''> => ({
  value: '',
  label: ''
})

export function getOptionWithDifferentLabel<T = string, U = string>(
  value: T,
  label: U
): InputSelectOption<T, U> {
  return { value, label }
}

export function getOption<T>(value: T, label = value): InputSelectOption<T> {
  return { value, label }
}

export function stubObject() {
  return {}
}
