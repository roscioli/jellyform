import React, { useMemo, useState } from 'react'

import Jellyform, {_FakeForm, _InputComponentProps, _fixture} from 'jellyform'
import 'jellyform/dist/index.css'

const App = () => {
  const initialProps = useMemo(() => _fixture.getFormProps(), [])
  const [formValues, setFormValues] = useState(_fixture.getFormInitialState())

  return <Jellyform<_FakeForm, {}, _InputComponentProps> {...initialProps} formValues={formValues} onFormChange={setFormValues} />
}

export default App
