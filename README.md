# jellyform

> Simple, declarative, lightweight React form

[![NPM](https://img.shields.io/npm/v/jellyform.svg)](https://www.npmjs.com/package/jellyform) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

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

## License

MIT © [Octavio Roscioli](https://github.com/roscioli)
