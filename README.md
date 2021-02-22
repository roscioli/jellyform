# jellyform

> Simple, declarative, lightweight React form

[![NPM](https://img.shields.io/npm/v/jellyform.svg)](https://www.npmjs.com/package/jellyform) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Motivation

Building forms should involve simply defining how each field behaves. This package aims to create a simple, declarative, lightweight, and performative React form solution.

## Install

```bash
npm install --save jellyform
```

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

## Props

### `formValues` (`object`)

This is a simple key/value object that define the form's initial state.

### `layout` (`string[][]`)

This is an array of string arrays that define the layout of the form. The strings are the keys of `formValues`.

### `fieldConfigs` (`object`)

This is an object that contains the behaviour definitions for all fields. Each key is associated with a `FieldConfig` object with the following properties.

#### type `FieldConfig`

##### `Component` (React Component)

This prop is your React input component for this field.

##### `staticProps` (`object`)

These are static props that will always get passed into `Component`.

##### `generateProps` (`Function`)

This function dynamically creates props that get passed into `Component`. The function has one parameter object which keys include [`formValues`](#formValues), `setFormValues`, and any key/value pair in [`propGeneratorOptions`](#propGeneratorOptions).

Sometimes an update to one field can trigger an update on another field. `setFormValues` is a function that takes an object to override the current `formValues`.

```js
// say formValues is {a: 0, b: 0, c: 0}

setFormValues({b: 1, c: 2})

// now formValues is {a: 0, b: 1, c: 2}
```

### `onFormSubmit` (`Function`)

This is a function that will get executed on form submit. It may be async or synchronous. The function takes the current `formValues` object as its only parameter.

### `propGeneratorOptions` (`object`)

When generating props for a field using [`generateProps`](#generateProps), you may need dynamic values from your app to be passed into the form to generate the correct props. An example of this is creating dynamic options asynchronously for a select component.

To pass in application state into the form dynamically, you can define the `propGeneratorOptions` object so your field configs can access this state to generate input field props in the `generateProps` function.

### `onFormChange` (`Function`)

This is a function that executes every time a form value is changed. The function takes the current `formValues` object as its only parameter.

### `submitButtonText` (`string`)

This defines the submit button text.

## License

MIT © [Octavio Roscioli](https://github.com/roscioli)
