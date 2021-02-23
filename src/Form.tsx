import React, { useCallback, useEffect, useMemo, useState } from 'react'
import SubmitButton, { SubmitButtonBaseProps } from './components/SubmitButton'
import { getCssClassName } from './utils'

type StringKeyObject = { [key: string]: any }

type StaticProps = {
  label?: string | number | symbol
  required?: boolean
  disabled?: boolean
}

type PartialRecordOfFormValues<
  T extends StringKeyObject,
  V = T[keyof T]
> = Partial<Record<keyof T, V>>

type FieldConfig<FormValues, PropGeneratorOptions, PossibleComponentProps> = {
  Component: React.FC<any>
  staticProps?: StringKeyObject & StaticProps & Partial<PossibleComponentProps>
  generateProps?: (
    options: PropGeneratorOptions & {
      formValues: FormValues
      setFormValues: (fields: PartialRecordOfFormValues<FormValues>) => void
    }
  ) => StaticProps & Partial<PossibleComponentProps>
  getError?: (form: FormValues) => string | null
  getActualValue?: (val: any) => any
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
  fieldConfigs: FieldConfigs<
    FormValues,
    PropGeneratorOptions,
    PossibleComponentProps
  >
  formValues: FormValues
  layout: (keyof FormValues)[][]
  onFormSubmit: (submission: Partial<FormValues>) => void | Promise<void>
  propGeneratorOptions?: PropGeneratorOptions
  onFormChange?: (state: FormValues) => void
  submitButtonText?: string
  components?: { SubmitButton?: React.FC<SubmitButtonBaseProps> }
}

const isValueDefined = (val: any) => {
  if (Array.isArray(val)) return val.length
  return val !== undefined && val !== null && val !== ''
}

const identity = (x: any) => x

export function Jellyform<
  FormValues extends StringKeyObject,
  PropGeneratorOptions extends object = {},
  PossibleComponentProps extends object = {}
>({
  propGeneratorOptions: _propGenOpts = {} as PropGeneratorOptions,
  formValues: _formValues,
  onFormChange,
  fieldConfigs,
  layout,
  onFormSubmit,
  submitButtonText,
  components = {}
}: FormProps<FormValues, PropGeneratorOptions, PossibleComponentProps>) {
  const [formValues, setAllFormValues] = useState(_formValues)

  const setFormValues = useCallback(
    (fields: PartialRecordOfFormValues<FormValues>) => {
      const newForm = { ...formValues, ...fields }
      setAllFormValues(newForm)
      if (onFormChange) onFormChange(newForm)
    },
    [formValues, onFormChange]
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
    const propGeneratorOptions = { ..._propGenOpts, formValues, setFormValues }
    const _disabledKeys: Set<keyof FormValues> = new Set()
    const rowElements: JSX.Element[] = []
    let _isFormComplete = true

    for (let i = 0; i < layout.length; i++) {
      const row = layout[i]
      const fieldElements: JSX.Element[] = []
      for (const fieldKey of row) {
        const {
          Component,
          generateProps,
          staticProps,
          getError,
          getActualValue = identity
        } = fieldConfigs[fieldKey]
        const value = getActualValue(formValues[fieldKey])
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

        fieldElements.push(
          <Component
            key={fieldKey}
            data-testid={`input-${fieldKey}`}
            name={fieldKey}
            value={formValues[fieldKey]}
            label={fieldKey}
            form={formValues}
            onChange={(val: FormValues[keyof FormValues]) => {
              setFormValues({
                [fieldKey]: val
              } as PartialRecordOfFormValues<FormValues>)
            }}
            error={_errors[fieldKey]}
            {...props}
          />
        )
      }
      rowElements.push(
        <div key={`row-${i}`} className={getCssClassName('formRow')}>
          {fieldElements}
        </div>
      )
    }

    setIsFormComplete(_isFormComplete)
    setErrors(_errors)
    setDisabledKeys(_disabledKeys)
    setFormEls(rowElements)
  }, [formValues, fieldConfigs, setFormValues, layout])

  const onSubmitButtonClick = useCallback(async () => {
    setIsSubmitting(true)
    const formWithoutDisabledKeys = Object.entries(formValues).reduce(
      (acc, [k, v]) => (disabledKeys.has(k) ? acc : { ...acc, [k]: v }),
      {}
    )
    await onFormSubmit(formWithoutDisabledKeys)
    setIsSubmitting(false)
  }, [setIsSubmitting, formValues, disabledKeys, onFormSubmit])

  return (
    <form>
      <div>{formEls}</div>
      <SubmitButton
        disabled={disabled}
        onClick={onSubmitButtonClick}
        submitButtonText={submitButtonText}
        Component={components.SubmitButton}
      />
    </form>
  )
}

export default Jellyform
