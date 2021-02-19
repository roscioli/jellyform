import React from 'react'
import Select, { ValueType } from 'react-select'
import Field from './Field'

export interface InputSelectProps {
  error?: string
  name: string
  required?: boolean
  options: any[]
  value?: SelectChangeValue
  isClearable?: boolean
  isSearchable?: boolean
  onBlur?: any
  onChangeHandler?: (value: string) => void
  onInputChange?: (input: string) => void
  noOptionsMessage?: () => string
  customStyles?: any
  disabled?: boolean
  label: string
}

type SelectChangeValue = ValueType<any, any> | null | undefined

const DropdownIndicator = () => {
  return (
    <div className='indicator dropdown-indicator customDropdown'>
      <div>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
          <path d='M8.11391 13.1817C8.07182 13.2322 8.0401 13.2905 8.02058 13.3533C8.00106 13.4161 7.99412 13.4821 8.00016 13.5476C8.0062 13.6131 8.02509 13.6767 8.05576 13.7349C8.08644 13.7931 8.12828 13.8446 8.1789 13.8866L11.1785 16.3863C11.268 16.4598 11.3802 16.5 11.496 16.5C11.6118 16.5 11.724 16.4598 11.8134 16.3863L14.8131 13.9716C14.8711 13.9245 14.9178 13.8651 14.9498 13.7976C14.9818 13.7301 14.9983 13.6563 14.998 13.5816C14.9984 13.487 14.9718 13.3943 14.9215 13.3141C14.8712 13.234 14.7992 13.1698 14.7139 13.129C14.6286 13.0881 14.5334 13.0723 14.4394 13.0834C14.3455 13.0945 14.2566 13.1321 14.1831 13.1917L11.4985 15.3564L8.81882 13.1167C8.76831 13.0746 8.70998 13.0429 8.64719 13.0234C8.58439 13.0038 8.51836 12.9969 8.45288 13.0029C8.3874 13.009 8.32376 13.0279 8.26559 13.0585C8.20743 13.0892 8.15588 13.1311 8.11391 13.1817Z' />
          <path d='M11.1821 7.61182L8.18291 10.0012C8.13156 10.0424 8.08887 10.0934 8.05729 10.1512C8.02571 10.209 8.00587 10.2725 7.9989 10.338C7.99193 10.4035 7.99798 10.4697 8.01669 10.5329C8.0354 10.596 8.0664 10.6548 8.10793 10.706C8.14918 10.7573 8.20017 10.8 8.25797 10.8316C8.31577 10.8632 8.37925 10.883 8.44474 10.89C8.51024 10.8969 8.57647 10.8909 8.63962 10.8722C8.70277 10.8535 8.7616 10.8225 8.81273 10.781L11.497 8.64653L14.1813 10.8859C14.2318 10.928 14.2901 10.9597 14.3529 10.9792C14.4157 10.9988 14.4817 11.0057 14.5472 10.9997C14.6126 10.9936 14.6763 10.9747 14.7344 10.9441C14.7926 10.9134 14.8441 10.8716 14.8861 10.8209C14.9588 10.7303 14.9977 10.6172 14.996 10.501C14.9962 10.4276 14.9801 10.355 14.949 10.2885C14.9179 10.222 14.8725 10.1631 14.8161 10.1161L11.8169 7.61681C11.7281 7.54259 11.6162 7.50151 11.5004 7.5006C11.3846 7.49969 11.2721 7.539 11.1821 7.61182Z' />
        </svg>
      </div>
    </div>
  )
}

export const InputSelect = (props: InputSelectProps) => {
  const { label, name, required, disabled, error, ...rest } = props
  return (
    <Field
      label={label}
      name={name}
      required={required}
      disabled={disabled}
      error={error}
    >
      <Select
        id={name}
        name={name}
        isDisabled={disabled}
        {...rest}
        components={{ DropdownIndicator }}
      />
    </Field>
  )
}

export const MultiSelect = (props: InputSelectProps) => {
  const { name, required, error, disabled, label, ...rest } = props
  return (
    <Field
      label={label}
      name={name}
      required={required}
      disabled={disabled}
      error={error}
    >
      <Select
        isMulti
        id={name}
        name={name}
        isDisabled={disabled}
        {...rest}
        components={{ DropdownIndicator }}
      />
    </Field>
  )
}
