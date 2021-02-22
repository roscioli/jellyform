# jellyform

> Simple, declarative, lightweight React form built with performance in mind.

[![NPM](https://img.shields.io/npm/v/jellyform.svg)](https://www.npmjs.com/package/jellyform) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Motivation

Building forms should involve simply defining how each field behaves. This package aims to create a simple, declarative, lightweight React form built with performance in mind.

Plug and play your own **_custom input components_**. No more copying and pasting boilerplate. No more large forms with confusing, nested components.

**_Simply define each field's behaviour_** and jellyform will generate the form element and render it all for you in a simple, beautiful, and extensible way.

**_Fully typed components_** will allow your IDE to pick up any errors as well as autocomplete for you.

***

## Install

```bash
npm install --save jellyform
```

***

## Usage

```tsx
import React, { Component } from 'react'

import Jellyform from 'jellyform'
import 'jellyform/dist/index.css'

const App = () => {
  return (
    <Jellyform
      fieldConfigs={{
        name: {
          Component: InputText,
          staticProps: {
            placeholder: 'Enter your name',
            required: true
          }
        },
        nickname: {
          Component: InputText,
          getError: (f) =>
            f.nickname.charAt(0) !== f.name.charAt(0)
              ? 'First letter of nickname must match name'
              : null
        }
      }}
      formValues={{ name: 'Timothy', nickname: 'Tim' }}
      layout={[['name', 'nickname']]}
      onFormSubmit={console.log}
    />
  )
}
```

***

## Props

### formValues *

`object`

This is a simple key/value object that define the form's initial state.

### layout *

`string[][]`

This is an array of string arrays that defines the layout of the form. The strings are the keys of `formValues`.

### fieldConfigs *

`object`

This is an object that contains the behaviour definitions for all fields. Each key is associated with a [`FieldConfig`](#fieldconfig) object with the following properties.

### onFormSubmit *

`Function`

This is a function that will get executed on form submit. It may be async or synchronous. The function takes the current `formValues` object as its only parameter.

### propGeneratorOptions

`object`

When generating props for a field using [`generateProps`](#generateprops-function), you may need dynamic values from your app to be passed into the form to generate the correct props. An example of this is creating dynamic options asynchronously for a select component.

To pass in application state into the form dynamically, you can define the `propGeneratorOptions` object so your field configs can access this state to generate input field props in the `generateProps` function.

### onFormChange

`Function`

This is a function that executes every time a form value is changed. The function takes the current `formValues` object as its only parameter.

### submitButtonText

`string`

This defines the submit button text.

***

## FieldConfig

This type is used to define the configuration of each field using the [fieldConfigs](#fieldconfigs) prop.

### Component *

`React Component`

This is the React input component for this field.

### staticProps

`object`

These are static props that will always get passed into `Component`.

### generateProps

`Function`

This function dynamically creates props that get passed into `Component`. The function has one parameter object which keys include [`formValues`](#formvalues-object), `setFormValues`, and any key/value pair in [`propGeneratorOptions`](#propgeneratoroptions-object).

Sometimes an update to one field can trigger an update on another field. `setFormValues` is a function that takes an object to override the current `formValues`.

```js
// say formValues is {a: 0, b: 0, c: 0}

setFormValues({b: 1, c: 2})

// now formValues is {a: 0, b: 1, c: 2}
```

### getError

`Function`

This is a function that takes the `formValues` as a parameter. It should return a error string if the field has an error and `null` if it does not.

### getActualValue

`Function`

Jellyform toggles the disabled state of the form's submit button based on the existence of the value and if the value has an error or not. Jellyform, by default, uses an identity function `x => x` to get the value of the form's field to check if it is unpopulated or erroneous.

You can override this identity function with a custom function if necessary.

> *When is this relevant?*
>
>Some component libraries, like `react-select`, have input components that take a `value` prop but the value that is actually selected is different 🙄
>
> For example, you might have `<Select value={{value: 1, label: 'one'}} />`. As you can see, `value` is actually an object that contains the actual value.
>
> In this scenario, `getActualValue` needs to be `x => x.value`

***

## Input components

Jellyform offers `InputText` and `InputSelect` out of the box, however, you can use your own custom input components as well.

If you want to use a custom input component, you can simply pass it to `Component` in the field config. To have your component wrapped with a label and error message feedback, you can use the `wrapCustomInputComponent` function. [See it in use](src/components/InputText.tsx) with Jellyform's `InputText` component.

***

## Typescript

Jellyform is built with typescript. When instantiating Jellyform you can specify three generics.

Fully typing everything is recommended as your IDE can then autofill a lot for you.

```tsx
<Jellyform<
  FormValues,
  PropGeneratorOptions,
  PossibleComponentProps>
  {...props}
/>
```

### FormValues

This is a simple object type defining the key/values of your form.

### PropGeneratorOptions

This is another simple object tpe defining the key/values of the object, [`propGeneratorOptions`](#propgeneratoroptions-object), that is passed into `generateProps`.

### PossibleComponentProps

This is a type that defines all possible input components (`or`'d together). For example we can have:

```ts
type PossibleComponentProps = InputTextProps | InputSelectProps
```

***

## License

MIT © [Octavio Roscioli](https://github.com/roscioli)
