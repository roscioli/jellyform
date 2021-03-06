import React, { useMemo } from 'react'

import Jellyform, {__FakeForm, __InputComponentProps, __fixture} from 'jellyform'
import 'jellyform/dist/index.css'

const App = () => {
  const initialProps = useMemo(() => __fixture.getFormProps(), [])

  return (
    <div style={{
      width: '80%',
      margin: '100px auto',
      minWidth: 400,
      maxWidth: 800
    }}>
      <Jellyform<__FakeForm, {}, __InputComponentProps>
      {...initialProps}
      onFormSubmit={(f) => {
        console.log(f)
        return new Promise(resolve => setTimeout(resolve, 1500))
      }}
    />
    </div>
  )
}

export default App
