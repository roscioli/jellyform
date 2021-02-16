import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { InputSelect } from './InputSelect'
import { stubObject } from './utils'

type StringKeyObject = { [key: string]: any }

export type OnTokenCreation = (token: string) => void

export type SubmitButtonProps<T> = { form: T; disabled: boolean }

type GeneratedProps = {
  [key: string]: any
  required?: boolean
  disabled?: boolean
}

export type FieldConfig<PropGeneratorOptions, FormValues> = {
  Component: React.FC<any>
  generateProps?: (
    options: PropGeneratorOptions & {
      formValues: FormValues
      setFormFields: (fields: Partial<Record<keyof FormValues, any>>) => void
    }
  ) => GeneratedProps
  getError?: (form: FormValues) => string | null
}

export type FieldConfigs<PropGeneratorOptions, FormValues> = {
  [lkey: string]: FieldConfig<PropGeneratorOptions, FormValues>
}

export type FormProps<PropGeneratorOptions, FormValues> = {
  propGeneratorOptions: PropGeneratorOptions
  formValues: FormValues
  setForm: (state: FormValues) => void
  fieldConfigs: FieldConfigs<PropGeneratorOptions, FormValues>
  layout: (keyof FormValues)[][]
  onFormSuccess: OnTokenCreation
  submitForm: (submission: Partial<FormValues>) => Promise<any>
  submitButtonText?: string
}

export default function Form<
  PropGeneratorOptions extends object,
  FormValues extends StringKeyObject
>({
  propGeneratorOptions: _propGenOpts,
  formValues,
  setForm,
  fieldConfigs,
  layout,
  submitForm,
  submitButtonText
}: FormProps<PropGeneratorOptions, FormValues>) {
  const setFormFields = useCallback(
    (fields: Partial<Record<keyof FormValues, any>>) => {
      setForm({ ...formValues, ...fields })
    },
    [formValues, setForm]
  )
  const propGeneratorOptions = { ..._propGenOpts, formValues, setFormFields }
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({})
  const [isFormComplete, setIsFormComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formEls, setFormEls] = useState<JSX.Element[]>()
  const [disabledKeys, setDisabledKeys] = useState<Set<keyof FormValues>>(
    new Set()
  )

  const disabled = useMemo(
    () =>
      isSubmitting || !isFormComplete || Object.values(errors).some(Boolean),
    [isSubmitting, isFormComplete, errors]
  )

  const getValue = useCallback(
    (key: string) =>
      fieldConfigs[key].Component === InputSelect
        ? formValues[key]?.value
        : formValues[key],
    // eslint-disable-next-line prettier/prettier
    [fieldConfigs, formValues],
  )

  useEffect(() => {
    setIsFormComplete(
      Object.entries(fieldConfigs).every(([key, config]) => {
        if (!config.generateProps) return true
        if (!config.generateProps(propGeneratorOptions).required) return true
        const val = getValue(key)
        return Boolean(Array.isArray(val) ? val.length : val)
      })
    )
  }, [formValues, propGeneratorOptions, fieldConfigs, getValue])

  useEffect(() => {
    setErrors(
      Object.entries(fieldConfigs).reduce((acc, [key, { getError }]) => {
        const value = getValue(key)
        Object.assign(acc, {
          [key]: value && getError ? getError(formValues) : null
        })
        return acc
      }, {} as Partial<Record<keyof FormValues, string>>)
    )
  }, [fieldConfigs, getValue, formValues])

  useEffect(() => {
    const _disabledKeys: Set<keyof FormValues> = new Set()
    const els = layout.map((row, i) => (
      <div key={`row-${i}`} className='form-row'>
        {row.map((key: keyof FormValues) => {
          const { Component, generateProps = stubObject } = fieldConfigs[
            key as string
          ]

          const props: GeneratedProps = {
            'data-testid': `input-${key}`,
            name: key,
            value: formValues[key],
            label: key,
            form: formValues,
            onChange: (val: any) => {
              setFormFields({ [key]: val } as Partial<
                Record<keyof FormValues, any>
              >)
            },
            error: errors[key],
            ...generateProps(propGeneratorOptions)
          }

          if ('disabled' in props && props.disabled) _disabledKeys.add(key)

          return <Component key={key} {...props} />
        })}
      </div>
    ))

    setFormEls(els)
    setDisabledKeys(_disabledKeys)
  }, [layout, errors, setFormFields])

  return (
    <div>
      <div style={{ margin: '2.5rem 0' }}>{formEls}</div>
      <button
        data-testid='submitButton'
        disabled={disabled}
        onClick={async () => {
          setIsSubmitting(true)
          const formWithoutDisabledKeys = Object.entries(formValues).reduce(
            (acc, [k, v]) => {
              return disabledKeys.has(k) ? acc : { ...acc, [k]: v }
            },
            {}
          )
          await submitForm(formWithoutDisabledKeys)
          setIsSubmitting(false)
        }}
      >
        {submitButtonText}
      </button>
    </div>
  )
}
