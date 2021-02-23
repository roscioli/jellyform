import React from 'react'
import { getCssClassName } from '../utils'

export type SubmitButtonBaseProps = {
  disabled: boolean
  onClick: () => Promise<void>
  children?: string
}

type SubmitButtonProps = SubmitButtonBaseProps & {
  Component?: React.FC<SubmitButtonBaseProps>
}

const SubmitButtonDefault = (props: SubmitButtonBaseProps) => (
  <button
    data-testid='submitButton'
    className={getCssClassName('submitButton')}
    {...props}
  />
)

const SubmitButton = ({
  onClick,
  disabled,
  children = 'Submit',
  Component = SubmitButtonDefault
}: SubmitButtonProps) => (
  <Component disabled={disabled} onClick={onClick} children={children} />
)

export default SubmitButton
