import * as FormImports from './Form'
export type { FieldConfigs, FormProps } from './Form'

export * as _fixture from './fixture'
export type {
  FakeForm as _FakeForm,
  InputComponentProps as _InputComponentProps
} from './fixture'

const Jellyform = FormImports.Jellyform
export default Jellyform
