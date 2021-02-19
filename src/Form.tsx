import React, { useCallback, useEffect, useMemo, useState } from 'react'

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

type FieldConfig<FormValues, PropGeneratorOptions, PossibleComponentProps> = {
  Component: React.FC<any>
  staticProps?: StaticProps & Partial<PossibleComponentProps>
  generateProps?: (
    options: PropGeneratorOptions & {
      formValues: FormValues
      setFormFields: (fields: PartialRecordOfFormValues<FormValues>) => void
    }
  ) => StaticProps & Partial<PossibleComponentProps>
  getError?: (form: FormValues) => string | null
}

export type FieldConfigs<
  FormValues extends StringKeyObject,
  PropGeneratorOptions extends object = {},
  PossibleComponentProps extends object = {}
> = Record<
  keyof FormValues,
  FieldConfig<FormValues, PropGeneratorOptions, PossibleComponentProps>
>

export type FormProps<
  FormValues extends StringKeyObject,
  PropGeneratorOptions extends object = {},
  PossibleComponentProps extends object = {}
> = {
  propGeneratorOptions?: PropGeneratorOptions
  formValues: FormValues
  setForm: (state: FormValues) => void
  fieldConfigs: FieldConfigs<
    FormValues,
    PropGeneratorOptions,
    PossibleComponentProps
  >
  layout: (keyof FormValues)[][]
  submitForm: (submission: Partial<FormValues>) => Promise<any>
  submitButtonText?: string
}

const isValueDefined = (val: any) => {
  if (Array.isArray(val)) return val.length
  return val !== undefined && val !== null && val !== ''
}

export default function Form<
  FormValues extends StringKeyObject,
  PropGeneratorOptions extends object = {},
  PossibleComponentProps extends object = {}
>({
  propGeneratorOptions: _propGenOpts = {} as PropGeneratorOptions,
  formValues,
  setForm,
  fieldConfigs,
  layout,
  submitForm,
  submitButtonText
}: FormProps<FormValues, PropGeneratorOptions, PossibleComponentProps>) {
  const setFormFields = useCallback(
    (fields: PartialRecordOfFormValues<FormValues>) => {
      setForm({ ...formValues, ...fields })
    },
    [formValues, setForm]
  )
  const [errors, setErrors] = useState<
    PartialRecordOfFormValues<FormValues, string>
  >({})
  const [isFormComplete, setIsFormComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formEls, setFormEls] = useState<JSX.Element[]>()
  const [disabledKeys, setDisabledKeys] = useState<Set<keyof FormValues>>(
    new Set()
  )
  const [allProps, setAllProps] = useState<
    PartialRecordOfFormValues<
      FormValues,
      StaticProps & Partial<PossibleComponentProps>
    >
  >({})

  const disabled = useMemo(
    () =>
      isSubmitting || !isFormComplete || Object.values(errors).some(Boolean),
    [isSubmitting, isFormComplete, errors]
  )

  useEffect(() => {
    const _errors: PartialRecordOfFormValues<FormValues, string> = {}
    const _allProps: PartialRecordOfFormValues<
      FormValues,
      StaticProps & Partial<PossibleComponentProps>
    > = {}
    const propGeneratorOptions = { ..._propGenOpts, formValues, setFormFields }
    const _disabledKeys: Set<keyof FormValues> = new Set()
    let _isFormComplete = true

    for (const [
      fieldKey,
      { generateProps, staticProps, getError }
    ] of Object.entries(fieldConfigs)) {
      const value = formValues[fieldKey]
      const generatedProps =
        generateProps && generateProps(propGeneratorOptions)

      const props = Object.assign(generatedProps || {}, staticProps)

      Object.assign(_errors, {
        [fieldKey]:
          value && getError && !props.disabled ? getError(formValues) : null
      })

      Object.assign(_allProps, { [fieldKey]: props })

      if (props.disabled) _disabledKeys.add(fieldKey)

      if (props.required && !isValueDefined(value)) _isFormComplete = false
    }

    setIsFormComplete(_isFormComplete)
    setErrors(_errors)
    setAllProps(_allProps)
    setDisabledKeys(_disabledKeys)
  }, [formValues, fieldConfigs, setFormFields])

  useEffect(() => {
    if (!Object.keys(allProps).length) return
    const els = layout.map((row, i) => (
      <div key={`row-${i}`} className='form-row'>
        {row.map((key: keyof FormValues) => {
          const { Component } = fieldConfigs[key as string]

          const props: GeneratedProps = {
            'data-testid': `input-${key}`,
            name: key,
            value: formValues[key],
            label: key,
            form: formValues,
            onChange: (val: FormValues[keyof FormValues]) => {
              setFormFields({
                [key]: val
              } as PartialRecordOfFormValues<FormValues>)
            },
            error: errors[key],
            ...allProps[key]
          }

          return <Component key={key} {...props} />
        })}
      </div>
    ))

    setFormEls(els)
  }, [layout, errors, setFormFields, formValues, allProps])

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
