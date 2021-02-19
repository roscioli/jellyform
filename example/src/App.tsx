import React, { useMemo } from 'react'

import Jellyform, {_FakeForm, _InputComponentProps, _fixture} from 'jellyform'
import 'jellyform/dist/index.css'

const App = () => {
  const initialProps = useMemo(() => _fixture.getFormProps(), [])

  return (
    <div style={{width: '800px', margin: '100px auto'}}>
      <Jellyform<_FakeForm, {}, _InputComponentProps>
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
