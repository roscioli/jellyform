import React, { Fragment } from 'react'
import styles from './styles.module.css'

export const getLabelText = (label: string, required?: boolean) => (
  <Fragment>
    {label}
    {required ? (
      <span className={getCssClassName('fieldBlock-asterisk')}> *</span>
    ) : null}
  </Fragment>
)

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

export function getCssClassName(className: string) {
  return `jf-${className} ${styles[className] || ''}`
}
