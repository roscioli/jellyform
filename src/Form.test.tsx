import { fireEvent, render, wait } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
import { InputText, InputTextProps } from './InputText'
import Form, { FieldConfigs, FormProps } from './Form'
import {
  getOption,
  getOptionWithDifferentLabel,
  InputSelectOption
} from './utils'
import { InputSelect, InputSelectProps, MultiSelect } from './InputSelect'

const originalError = console.error

console.error = (s: string, ...args: any) => {
  if (
    typeof s === 'string' &&
    !s.match('Warning: react-modal') &&
    !s.match('act(...)')
  ) {
    originalError(s, ...args)
  }
}

type FakeForm = {
  num1?: number
  str1?: string
  num2?: number
  str2?: string
  sel1?: InputSelectOption<number, string>
  catchall?: number[] | null
}

const getFormInitialState = (override?: Partial<FakeForm>): FakeForm => ({
  num1: 1,
  str1: '1',
  num2: 2,
  str2: '2',
  catchall: [1],
  ...override
})

const getBaseFormProps = () => ({
  submitForm: jest.fn(),
  setForm: jest.fn()
})

type InputComponentProps = InputTextProps | InputSelectProps

const getFormProps = (): FormProps<FakeForm, {}, InputComponentProps> => ({
  ...getBaseFormProps(),
  formValues: getFormInitialState(),
  fieldConfigs: {
    num1: {
      Component: InputText,
      generateProps: () => ({ required: true }),
      getError: (f) => ((f?.num1 || Infinity) > 100 ? 'Exceeds max' : null)
    },
    str1: {
      Component: InputText,
      generateProps: ({ formValues: f }) => ({ required: !!f.num1 })
    },
    num2: { Component: InputText },
    str2: {
      Component: InputText,
      generateProps: ({ formValues: f }) => ({ disabled: !f.num2 })
    },
    sel1: {
      Component: InputSelect,
      staticProps: {
        label: 'select label',
        options: [
          getOptionWithDifferentLabel('sel1 val1', 'this is fine'),
          getOptionWithDifferentLabel('sel1 val2', 'this is an error')
        ]
      }
    },
    catchall: {
      Component: MultiSelect,
      generateProps: () => ({ required: true })
    }
  },
  layout: [['num1', 'str1'], ['num2', 'str2'], ['sel1']]
})

const renderWithProps = (
  props: Partial<FormProps<FakeForm, {}, InputComponentProps>>
) =>
  render(
    <Form<FakeForm, {}, InputComponentProps> {...getFormProps()} {...props} />
  )

describe('submit button', () => {
  it('enables submission', () => {
    const { getByTestId } = renderWithProps({})
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      false
    )
  })

  it('disables submission when form is incomplete', () => {
    const { getByTestId } = renderWithProps({
      formValues: { ...getFormInitialState(), num1: undefined }
    })
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      true
    )
  })

  it('disables submission when form has an empty array value', () => {
    const { getByTestId } = renderWithProps({
      formValues: { ...getFormInitialState(), catchall: [] }
    })
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      true
    )
  })

  it('enables submission when form has a 0 value', () => {
    const { getByTestId } = renderWithProps({
      formValues: { ...getFormInitialState(), num1: 0 }
    })
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      false
    )
  })

  it('disables submission when form has a null value', () => {
    const { getByTestId } = renderWithProps({
      formValues: { ...getFormInitialState(), catchall: null }
    })
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      true
    )
  })

  it('disables submission when form has errors', () => {
    const { getByTestId } = renderWithProps({
      formValues: { ...getFormInitialState(), num1: 101 }
    })
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      true
    )
  })

  it('disables button on submit', () => {
    const { getByTestId } = renderWithProps({})
    fireEvent.click(getByTestId('submitButton'))
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      true
    )
  })

  it('reenables button on submit complete', async () => {
    const submitForm = () => new Promise((resolve) => setTimeout(resolve, 1))
    const { getByTestId } = renderWithProps({ submitForm })
    fireEvent.click(getByTestId('submitButton'))

    await wait(() => {
      expect(
        (getByTestId('submitButton') as HTMLButtonElement).disabled
      ).toEqual(false)
    })
  })
})

describe('submission', () => {
  it('submits form', () => {
    const submitForm = jest.fn(() => Promise.resolve())
    const { getByTestId } = renderWithProps({ submitForm })
    fireEvent.click(getByTestId('submitButton'))
    expect(submitForm).toHaveBeenCalledWith(getFormInitialState())
  })

  it('disables input if disabled results in true', () => {
    const submitForm = jest.fn(() => Promise.resolve())
    const { getByTestId } = renderWithProps({
      submitForm,
      formValues: getFormInitialState({ num2: 0 })
    })
    const el = getByTestId('input-str2') as HTMLInputElement
    expect(el.disabled).toEqual(true)
  })

  it('submits form omitting disabled inputs', () => {
    const submitForm = jest.fn(() => Promise.resolve())
    const initialFormValues: FakeForm = {
      num1: 1,
      str1: '1',
      num2: undefined,
      str2: '2',
      catchall: [1]
    }
    expect(initialFormValues.str2).toEqual('2')
    const { getByTestId } = renderWithProps({
      submitForm,
      formValues: initialFormValues
    })
    fireEvent.click(getByTestId('submitButton'))
    const { str2, ...submission } = initialFormValues
    expect(submitForm).toHaveBeenCalledWith(submission)
  })
})

describe('rendering', () => {
  it('renders with error text', () => {
    const { getByText } = renderWithProps({
      formValues: { ...getFormInitialState(), num1: 101 }
    })
    expect(getByText('Exceeds max')).toBeTruthy()
  })

  it('shows value for input text', () => {
    const { getByTestId } = renderWithProps({})
    expect((getByTestId('input-num1') as HTMLInputElement).value).toEqual('1')
  })

  it('shows value for input select', () => {
    const { getByText } = renderWithProps({
      formValues: {
        ...getFormInitialState(),
        sel1: { value: 1, label: 'First Value' }
      }
    })
    expect(getByText('First Value')).toBeTruthy()
  })

  it('renders rows using layout', () => {
    const { container } = renderWithProps({})
    const rows = container.getElementsByClassName('form-row')
    expect(rows.length).toEqual(3)
    const labelEls = Array.from(rows).map((row) =>
      Array.from(row.getElementsByTagName('label')).map((el) => el.innerHTML)
    )
    expect(labelEls[0].length).toEqual(2)
    expect(labelEls[0]).toEqual([
      expect.stringContaining('num1'),
      expect.stringContaining('str1')
    ])
    expect(labelEls[1].length).toEqual(2)
    expect(labelEls[1]).toEqual([
      expect.stringContaining('num2'),
      expect.stringContaining('str2')
    ])
    expect(labelEls[2].length).toEqual(1)
    expect(labelEls[2]).toEqual([expect.stringContaining('select label')])
  })
})

describe('input component props', () => {
  it('plugs in static props', () => {
    type FakeForm2 = { input1: string }
    const fieldConfigs: FieldConfigs<FakeForm2> = {
      input1: { Component: InputText, staticProps: { label: 'new input 1' } }
    }

    const { getByLabelText } = render(
      <Form<FakeForm2>
        {...getBaseFormProps()}
        propGeneratorOptions={{}}
        formValues={{ input1: 'one' }}
        fieldConfigs={fieldConfigs}
        layout={[['input1']]}
      />
    )
    expect(getByLabelText('new input 1')).toBeTruthy()
  })

  it('plugs in generated props', () => {
    type FakeForm2 = { input1: string }
    const fieldConfigs: FieldConfigs<FakeForm2> = {
      input1: {
        Component: InputText,
        generateProps: () => ({ label: 'new input 1' })
      }
    }

    const { getByLabelText } = render(
      <Form<FakeForm2>
        {...getBaseFormProps()}
        propGeneratorOptions={{}}
        formValues={{ input1: 'one' }}
        fieldConfigs={fieldConfigs}
        layout={[['input1']]}
      />
    )
    expect(getByLabelText('new input 1')).toBeTruthy()
  })

  it('updates when generated props update', async () => {
    type FakeForm2 = { input1: string }
    type PropGeneratorOptions = { label: string }
    const fieldConfigs: FieldConfigs<FakeForm2, PropGeneratorOptions> = {
      input1: {
        Component: InputText,
        generateProps: ({ label }) => ({ label })
      }
    }

    const ContainerComponent = () => {
      const [label, setLabel] = useState('original label')

      useEffect(() => {
        setTimeout(() => setLabel('new label'), 1)
      }, [])

      return (
        <Form<FakeForm2, PropGeneratorOptions>
          {...getBaseFormProps()}
          propGeneratorOptions={{ label }}
          formValues={{ input1: 'one' }}
          fieldConfigs={fieldConfigs}
          layout={[['input1']]}
        />
      )
    }

    const { getByLabelText } = render(<ContainerComponent />)
    expect(getByLabelText('original label')).toBeTruthy()
    await wait(() => expect(getByLabelText('new label')).toBeTruthy())
  })
})
