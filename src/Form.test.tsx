import { fireEvent, render, wait } from '@testing-library/react'
import React from 'react'
import { InputText } from './InputText'
import Form, { FormProps } from './Form'
import { InputSelectOption } from './utils'
import { InputSelect, MultiSelect } from './InputSelect'

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
  nums?: number[]
}

const getFormInitialState = (override?: Partial<FakeForm>): FakeForm => ({
  num1: 1,
  str1: '1',
  num2: 2,
  str2: '2',
  nums: [1],
  ...override
})

const renderWithProps = (props: Partial<FormProps<{}, FakeForm>>) => {
  return render(
    <Form<{}, FakeForm>
      onFormSuccess={jest.fn()}
      submitForm={jest.fn()}
      propGeneratorOptions={{}}
      formValues={getFormInitialState()}
      setForm={jest.fn()}
      fieldConfigs={{
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
        sel1: { Component: InputSelect },
        nums: {
          Component: MultiSelect,
          generateProps: () => ({ required: true })
        }
      }}
      layout={[['num1', 'str1'], ['num2', 'str2'], ['sel1']]}
      {...props}
    />
  )
}

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
    formValues: { ...getFormInitialState(), nums: [] }
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
  expect(labelEls[2]).toEqual([expect.stringContaining('sel1')])
})

it('disables button on submit', () => {
  const { getByTestId } = renderWithProps({})
  fireEvent.click(getByTestId('submitButton'))
  expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
    true
  )
})

it('submits form', () => {
  const submitForm = jest.fn(() => Promise.resolve())
  const { getByTestId } = renderWithProps({ submitForm })
  fireEvent.click(getByTestId('submitButton'))
  expect(submitForm).toHaveBeenCalledWith(getFormInitialState())
})

it('reenables button on submit complete', async () => {
  const submitForm = () => new Promise((resolve) => setTimeout(resolve, 1))
  const { getByTestId } = renderWithProps({ submitForm })
  fireEvent.click(getByTestId('submitButton'))

  await wait(() => {
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      false
    )
  })
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
    nums: [1]
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
