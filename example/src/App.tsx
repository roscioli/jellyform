import React from 'react'

import Jellyform, {_FakeForm, _InputComponentProps, _fixture} from 'jellyform'
import 'jellyform/dist/index.css'

const App = () => {
  return <Jellyform<_FakeForm, {}, _InputComponentProps> {..._fixture.getFormProps()} />
}

export default App
