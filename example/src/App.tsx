import React, { useMemo } from 'react'

import Jellyform, {_FakeForm, _InputComponentProps, _fixture} from 'jellyform'
import 'jellyform/dist/index.css'

const App = () => {
  const initialProps = useMemo(() => _fixture.getFormProps(), [])

  return (
    <div style={{width: '800px', margin: '100px auto'}}>
      <Jellyform<_FakeForm, {}, _InputComponentProps>
      {...initialProps}
    />
    </div>
  )
}

export default App
