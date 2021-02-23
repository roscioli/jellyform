import React from 'react'
import { getCssClassName } from '../utils'

export type SubmitButtonBaseProps = {
  disabled: boolean
  onClick: () => Promise<void>
  submitButtonText?: string
}

type SubmitButtonProps = SubmitButtonBaseProps & {
  Component?: React.FC<SubmitButtonBaseProps>
}

const SubmitButtonDefault = (props: SubmitButtonBaseProps) => (
  <button
    data-testid='submitButton'
    className={getCssClassName('submitButton')}
    {...props}
  >
    {props.submitButtonText}
  </button>
)

const SubmitButton = ({
  onClick,
  disabled,
  submitButtonText = 'Submit',
  Component = SubmitButtonDefault
}: SubmitButtonProps) => (
  <Component
    disabled={disabled}
    onClick={onClick}
    submitButtonText={submitButtonText}
  />
)

export default SubmitButton
