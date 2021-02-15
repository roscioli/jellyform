import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { InputSelect } from './InputSelect'
import { stubObject } from './utils'

type StringKeyObject = { [key: string]: any }

export type OnTokenCreation = (token: string) => void

export type SubmitButtonProps<T> = { form: T; disabled: boolean }

export type FieldConfig<Opts, Form> = {
  Component: React.FC<any>
  generateProps?: (
    options: Opts & {
      formValues: Form
      setFormFields: (fields: Partial<Record<keyof Form, any>>) => void
    }
  ) => Record<string, any>
  getError?: (form: Form) => string | null
}

export type FieldConfigs<Opts, Form> = {
  [lkey: string]: FieldConfig<Opts, Form>
}

export type FormProps<PropGeneratorOptions, F> = {
  propGeneratorOptions: PropGeneratorOptions
  formValues: F
  setForm: (state: F) => void
  fieldConfigs: FieldConfigs<PropGeneratorOptions, F>
  layout: (keyof F)[][]
  onFormSuccess: OnTokenCreation
  submitForm: (submission: F) => Promise<any>
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

  const formEls = useMemo(
    () =>
      layout.map((row, i) => (
        <div key={`row-${i}`} className='form-row'>
          {row.map((key: keyof FormValues) => {
            const { Component, generateProps = stubObject } = fieldConfigs[
              key as string
            ]

            return (
              <Component
                key={key}
                name={key}
                value={formValues[key]}
                label={key}
                form={formValues}
                onChange={(val: string) => {
                  setFormFields({ [key]: val } as Partial<
                    Record<keyof FormValues, any>
                  >)
                }}
                error={errors[key]}
                {...generateProps(propGeneratorOptions)}
              />
            )
          })}
        </div>
      )),
    [layout, errors, setFormFields]
  )

  return (
    <div>
      <div style={{ margin: '2.5rem 0' }}>{formEls}</div>
      <button
        data-testid='submitButton'
        disabled={disabled}
        onClick={async () => {
          setIsSubmitting(true)
          await submitForm(formValues)
          setIsSubmitting(false)
        }}
      >
        {submitButtonText}
      </button>
    </div>
  )
}
