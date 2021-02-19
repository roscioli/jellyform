import React, { useMemo } from 'react'

import Jellyform, {_FakeForm, _InputComponentProps, _fixture} from 'jellyform'
import 'jellyform/dist/index.css'

const App = () => {
  const initialProps = useMemo(() => _fixture.getFormProps(), [])

  return (
    <Jellyform<_FakeForm, {}, _InputComponentProps>
      {...initialProps}
    />
  )
}

export default App
