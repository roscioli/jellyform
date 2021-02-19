import React from 'react'
import Select, { Props, ValueType } from 'react-select'
import { DropdownArrowsIcon } from './DropdownArrowsIcon'

export type SelectChangeValue = ValueType<any, any> | null | undefined

export const DropdownIndicator = () => {
  return (
    <div className='indicator dropdown-indicator customDropdown'>
      <div>
        <DropdownArrowsIcon />
      </div>
    </div>
  )
}

export default (props: Props<{ label: string; value: string }, boolean>) => {
  const { onChangeHandler, ...rest } = props
  return (
    <Select
      components={{
        DropdownIndicator
      }}
      {...rest}
    />
  )
}
