import { InputText, InputTextProps } from './components/InputText'
import {
  getEmptyOption,
  getOptionWithDifferentLabel,
  InputSelectOption
} from './utils'
import { InputSelect, InputSelectProps } from './components/InputSelect'
import { FormProps } from './Form'

export type FakeForm = {
  num1?: number
  str1?: string
  num2?: number
  str2?: string
  sel1?: InputSelectOption<number, string> | InputSelectOption
  catchall?: number[] | null
}

export const getFormInitialState = (
  override?: Partial<FakeForm>
): FakeForm => ({
  num1: 1,
  str1: '1',
  num2: 2,
  str2: '2',
  catchall: [1],
  ...override
})

export type InputComponentProps = InputTextProps | InputSelectProps

export const getFormProps = (): FormProps<
  FakeForm,
  {},
  InputComponentProps
> => ({
  onFormSubmit: () => Promise.resolve(),
  onFormChange: () => Promise.resolve(),
  formValues: getFormInitialState(),
  fieldConfigs: {
    num1: {
      Component: InputText,
      generateProps: () => ({ required: true }),
      getError: (f) => ((f?.num1 || Infinity) > 100 ? 'Exceeds max' : null)
    },
    str1: {
      Component: InputText,
      getError: (f) =>
        f.str1 === 'error text' ? 'String can not be "error text"' : null,
      generateProps: ({ formValues: f }) => ({
        required: !!f.num1,
        disabled: f.str2 === 'this will trigger str1 to error'
      })
    },
    num2: { Component: InputText },
    str2: {
      Component: InputText,
      generateProps: ({ formValues: f }) => ({ disabled: !f.num2 })
    },
    sel1: {
      Component: InputSelect,
      getActualValue: (v: InputSelectOption) => v && v.value,
      staticProps: {
        label: 'select label',
        options: [
          getEmptyOption(),
          getOptionWithDifferentLabel('sel1 val1', 'this is fine'),
          getOptionWithDifferentLabel('sel1 val2', 'this is fine too')
        ],
        required: false
      }
    },
    catchall: {
      Component: InputSelect,
      getActualValue: (v: InputSelectOption) => v && v.value,
      staticProps: {
        isMulti: undefined
      },
      generateProps: () => ({ required: true })
    }
  },
  layout: [['num1', 'str1'], ['num2', 'str2'], ['sel1']]
})
