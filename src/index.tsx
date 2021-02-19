import * as FormImports from './Form'
export type { FieldConfigs, FormProps } from './Form'

export * as FieldBlock from './components/FieldBlock'
export type { FieldProps } from './components/FieldBlock'

export * as InputSelect from './components/InputSelect'
export type { InputSelectProps } from './components/InputSelect'

export * as InputText from './components/InputText'
export type { InputTextProps } from './components/InputText'

export * as _fixture from './fixture'
export type {
  FakeForm as _FakeForm,
  InputComponentProps as _InputComponentProps
} from './fixture'

const Jellyform = FormImports.Jellyform
export default Jellyform
