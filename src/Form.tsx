import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { InputSelect } from './InputSelect'
import { stubObject } from './utils'

type StringKeyObject = { [key: string]: any }

type StaticProps = {
  label?: string | number | symbol
  required?: boolean
  disabled?: boolean
}

type GeneratedProps = StaticProps & StringKeyObject

type PartialRecordOfFormValues<
  T extends StringKeyObject,
  V = T[keyof T]
> = Partial<Record<keyof T, V>>

type FieldConfig<FormValues, PropGeneratorOptions> = {
  Component: React.FC<any>
  staticProps?: StaticProps
  generateProps?: (
    options: PropGeneratorOptions & {
      formValues: FormValues
      setFormFields: (fields: PartialRecordOfFormValues<FormValues>) => void
    }
  ) => GeneratedProps
  getError?: (form: FormValues) => string | null
}

export type FieldConfigs<
  FormValues extends StringKeyObject,
  PropGeneratorOptions extends object = {}
> = Record<keyof FormValues, FieldConfig<FormValues, PropGeneratorOptions>>

export type FormProps<
  FormValues extends StringKeyObject,
  PropGeneratorOptions extends object = {}
> = {
  propGeneratorOptions: PropGeneratorOptions
  formValues: FormValues
  setForm: (state: FormValues) => void
  fieldConfigs: FieldConfigs<FormValues, PropGeneratorOptions>
  layout: (keyof FormValues)[][]
  submitForm: (submission: Partial<FormValues>) => Promise<any>
  submitButtonText?: string
}

export default function Form<
  FormValues extends StringKeyObject,
  PropGeneratorOptions extends object = {}
>({
  propGeneratorOptions: _propGenOpts,
  formValues,
  setForm,
  fieldConfigs,
  layout,
  submitForm,
  submitButtonText
}: FormProps<FormValues, PropGeneratorOptions>) {
  const setFormFields = useCallback(
    (fields: PartialRecordOfFormValues<FormValues>) => {
      setForm({ ...formValues, ...fields })
    },
    [formValues, setForm]
  )
  const propGeneratorOptions = { ..._propGenOpts, formValues, setFormFields }
  const [errors, setErrors] = useState<
    PartialRecordOfFormValues<FormValues, string>
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
    [fieldConfigs, formValues]
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
          const {
            Component,
            generateProps = stubObject,
            staticProps
          } = fieldConfigs[key as string]

          const props: GeneratedProps = {
            'data-testid': `input-${key}`,
            name: key,
            value: formValues[key],
            label: key,
            form: formValues,
            onChange: (val: FormValues[keyof FormValues]) => {
              setFormFields({ [key]: val } as Partial<
                Record<keyof FormValues, FormValues[keyof FormValues]>
              >)
            },
            error: errors[key],
            ...staticProps,
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
      <div>{formEls}</div>
      <button
        data-testid='submitButton'
        disabled={disabled}
        onClick={async () => {
          setIsSubmitting(true)
          const formWithoutDisabledKeys = Object.entries(formValues).reduce(
            (acc, [k, v]) => (disabledKeys.has(k) ? acc : { ...acc, [k]: v }),
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
