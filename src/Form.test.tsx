import { fireEvent, render, wait } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
import { perf } from 'react-performance-testing'
import { InputText } from './components/InputText'
import Jellyform, { FieldConfigs, FormProps } from './Form'
import {
  FakeForm,
  getFormInitialState,
  getFormProps,
  InputComponentProps
} from './fixture'
import { getEmptyOption } from './utils'

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
const originalWarn = console.warn
console.warn = (s: string, ...args: any) => {
  if (
    typeof s === 'string' &&
    !s.startsWith('[react-performance-testing] You have anonymous component.')
  ) {
    originalWarn(s, ...args)
  }
}

const getBaseFormProps = () => ({
  onFormSubmit: jest.fn(),
  onFormChange: jest.fn()
})

const renderWithProps = (
  props: Partial<FormProps<FakeForm, {}, InputComponentProps>>
) =>
  render(
    <Jellyform<FakeForm, {}, InputComponentProps>
      {...getFormProps()}
      {...getBaseFormProps()}
      {...props}
    />
  )

it('enables submission', () => {
  const { getByTestId } = renderWithProps({})
  expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
    false
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

describe('incomplete state', () => {
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
      formValues: { ...getFormInitialState(), catchall: [] },
      layout: [
        ['num1', 'str1'],
        ['num2', 'str2'],
        ['sel1', 'catchall']
      ]
    })
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      true
    )
  })

  it('does not disable submission if value is empty but layout does not have value', () => {
    const { getByTestId } = renderWithProps({
      formValues: { ...getFormInitialState(), catchall: [] },
      layout: [['num1', 'str1'], ['num2', 'str2'], ['sel1']]
    })
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      false
    )
  })

  it('disables submission when form has a null value', () => {
    const { getByTestId } = renderWithProps({
      formValues: { ...getFormInitialState(), catchall: null },
      layout: [
        ['num1', 'str1'],
        ['num2', 'str2'],
        ['sel1', 'catchall']
      ]
    })
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      true
    )
  })

  it('disables submission when form has an empty string value', () => {
    const { getByTestId } = renderWithProps({
      formValues: { ...getFormInitialState(), str1: '' }
    })
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      true
    )
  })
})

describe('errors', () => {
  it('disables submission when form has errors', () => {
    const { getByTestId } = renderWithProps({
      formValues: { ...getFormInitialState(), num1: 101 }
    })
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      true
    )
  })

  it('does not evaluate to error if field is disabled', () => {
    const { getByTestId } = renderWithProps({
      formValues: {
        ...getFormInitialState(),
        str1: 'error text',
        str2: 'this will trigger str1 to error'
      }
    })
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      false
    )
  })
})

describe('submission', () => {
  it('submits form', () => {
    const onFormSubmit = jest.fn(() => Promise.resolve())
    const { getByTestId } = renderWithProps({ onFormSubmit })
    fireEvent.click(getByTestId('submitButton'))
    expect(onFormSubmit).toHaveBeenCalledWith(getFormInitialState())
  })

  it('disables input if disabled results in true', () => {
    const onFormSubmit = jest.fn(() => Promise.resolve())
    const { getByTestId } = renderWithProps({
      onFormSubmit,
      formValues: getFormInitialState({ num2: 0 })
    })
    const el = getByTestId('input-str2') as HTMLInputElement
    expect(el.disabled).toEqual(true)
  })

  it('submits form omitting disabled inputs', () => {
    const onFormSubmit = jest.fn(() => Promise.resolve())
    const initialFormValues: FakeForm = {
      num1: 1,
      str1: '1',
      num2: undefined,
      str2: '2',
      catchall: [1]
    }
    expect(initialFormValues.str2).toEqual('2')
    const { getByTestId } = renderWithProps({
      onFormSubmit,
      formValues: initialFormValues
    })
    fireEvent.click(getByTestId('submitButton'))
    const { str2, ...submission } = initialFormValues
    expect(onFormSubmit).toHaveBeenCalledWith(submission)
  })

  it('disables button on submit', () => {
    const { getByTestId } = renderWithProps({})
    fireEvent.click(getByTestId('submitButton'))
    expect((getByTestId('submitButton') as HTMLButtonElement).disabled).toEqual(
      true
    )
  })

  it('reenables button on submit complete', async () => {
    const onFormSubmit = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1))
    }
    const { getByTestId } = renderWithProps({ onFormSubmit })
    fireEvent.click(getByTestId('submitButton'))

    await wait(() => {
      expect(
        (getByTestId('submitButton') as HTMLButtonElement).disabled
      ).toEqual(false)
    })
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
    const rows = container.getElementsByClassName('formRow')
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

  it('renders submit button text', () => {
    const { getByTestId } = renderWithProps({ submitButtonText: 'Done' })
    expect(getByTestId('submitButton').innerHTML).toEqual('Done')
  })

  it('renders submit button text with default text', () => {
    const { getByTestId } = renderWithProps({})
    expect(getByTestId('submitButton').innerHTML).toEqual('Submit')
  })

  it('renders submit button with overriding button component', () => {
    const SubmitButtonOverride = (props: {
      disabled: boolean
      onClick: () => void
    }) => (
      <span data-testid='submitButton-override' {...props}>
        Save
      </span>
    )
    const { getByTestId } = renderWithProps({
      components: { SubmitButton: SubmitButtonOverride }
    })
    expect(getByTestId('submitButton-override').innerHTML).toEqual('Save')
  })
})

describe('input component props', () => {
  it('plugs in static props', () => {
    type FakeForm2 = { input1: string }
    const fieldConfigs: FieldConfigs<FakeForm2> = {
      input1: { Component: InputText, staticProps: { label: 'new input 1' } }
    }

    const { getByLabelText } = render(
      <Jellyform<FakeForm2>
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
      <Jellyform<FakeForm2>
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
        <Jellyform<FakeForm2, PropGeneratorOptions>
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

describe('performance', () => {
  it('generates props once per render per field', () => {
    const formProps = getFormProps()
    formProps.fieldConfigs.num1.generateProps = jest.fn(
      formProps.fieldConfigs.num1.generateProps
    )
    render(<Jellyform<FakeForm, {}, InputComponentProps> {...formProps} />)
    expect(formProps.fieldConfigs.num1.generateProps).toHaveBeenCalledTimes(1)
  })

  it('renders minimally', async () => {
    const { renderCount } = perf(React)
    renderWithProps({})
    await wait(() => {
      if (Array.isArray(renderCount.current.Jellyform))
        throw Error('Multiple Jellyforms')

      expect(renderCount.current.Jellyform.value).toEqual(2)
    })
  })
})

describe('field changes', () => {
  it('updates the field', () => {
    const { getByTestId } = renderWithProps({})
    const inputEl = getByTestId('input-num1') as HTMLInputElement
    fireEvent.change(inputEl, { target: { value: 999 } })
    expect(inputEl.value).toEqual('999')
  })
})

describe('when actual value is not the value prop', () => {
  it('uses actual value to check for form completion if `getActualValue` is provided', () => {
    const formValues = getFormInitialState({ sel1: getEmptyOption() })
    const props = getFormProps()

    if (props.fieldConfigs.sel1.staticProps)
      props.fieldConfigs.sel1.staticProps.required = true

    const { getByTestId } = renderWithProps({
      ...props,
      formValues
    })

    const buttonEl = getByTestId('submitButton') as HTMLButtonElement
    expect(buttonEl.disabled).toEqual(true)
  })
})
