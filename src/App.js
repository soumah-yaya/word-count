import { useReducer, useRef } from 'react'
import './App.css'
const initialSate = {
  textValue: '',
  totalWordsCount: '0',
  totalCharWithSpace: '0',
  totalCharWithoutSpace: '0',
  whiteSpaceCharactersCount: '0',
  punctuationCount: '0',
  linesCount: '0'
}
const setValue = (state, value) => {

  state.textValue = value
  state.totalCharWithSpace = value.length + ''
  state.totalCharWithoutSpace = value.match(/\S/gm) !== null ? value.match(/\S/gm).length + '' : '0'
  state.whiteSpaceCharactersCount = value.match(/\s/gm) !== null ? value.match(/\s/gm).length + '' : '0'
  state.punctuationCount = value.match(/[^\s\w\d]/gm) !== null ? value.match(/[^\s\w\d]/gm).length + '' : '0'
  state.linesCount = value.length === 0 ? '0' : value.match(/\n/gm) === null ? '1' : value.match(/\n/gm).length + 1 + ''
  state.totalWordsCount = value.match(/\w+[^\s\w\d]*/gm) !== null ? value.match(/\w+[^\s\w\d]*/gm).length + '' : '0'
}
const types = { update: 'UPDATE_TEXT', trim: 'TRIM_WHITE_SPACE', removeAll: 'REMOVE_ALL_SPACES', clearLineBreak: 'CLEAR_LINE_BREAKS', clearAll: 'CLEAR_ALL' }
const wordReducer = (state, action) => {
  switch (action.type) {
    case types.update:
      setValue(state, action.payload)
      return { ...state };
    case types.trim: state.textValue = state.textValue.trim()
      return { ...state }

    case types.removeAll:
      let str = state.textValue.match(/\S/gm) !== null ? state.textValue.match(/\S/gm).join('') : ''
      setValue(state, str)
      return { ...state }

    case types.clearLineBreak:
      let lines = state.textValue.replace(/\n/gm, '')
      // console.log(state.textValue.replace(/\n/gm,''))
      setValue(state, lines)
      return { ...state }
    case types.clearAll:
      setValue(state, '')
      return { ...state }
    default: throw new Error('unknown error')
  }
}
const App = () => {

  const [state, disptach] = useReducer(wordReducer, initialSate)
  const textareaRef = useRef(null)

  let {
    textValue,
    totalCharWithSpace,
    totalCharWithoutSpace,
    whiteSpaceCharactersCount,
    punctuationCount,
    linesCount,
    totalWordsCount
  } = state

/**
 * 
 * @param {string} type set focus back to textarea and disptach
 */
  const handleButtonClick = (type)=>{
    textareaRef.current.focus()
    disptach({type})
  }

  return (
    <div className="container">
      <h2 className='title'>Online Character Count Report</h2>
      <div className="button__wrapper">
        <button onClick={() => handleButtonClick(types.trim)}>
          Trim whitespace start/end
        </button>
        <button onClick={() => handleButtonClick(types.removeAll)}>
          Remove all spaces
        </button>
        <button onClick={() => handleButtonClick(types.clearLineBreak)}>
          Clear line breaks
        </button>
        <button onClick={() => handleButtonClick(types.clearAll)}>
          Clear All
        </button>
      </div>
      {/* taxtarea */}
      <label className='text_content'>
        <p>Enter text to get the report</p>
        <textarea ref={textareaRef} value={textValue} onChange={(e) => disptach({ type: 'UPDATE_TEXT', payload: e.target.value })} />
      </label>
      {/* report */}
      {/* show the report when there is a text only */}
      {textValue.length !== 0 &&
        <table className="report__table">
          <tbody>
            {/* total */}
            <tr>
              <td>Total words:</td>
              <td>{totalWordsCount}</td>
            </tr>
            {/* total */}
            <tr>
              <td>Total characters (including whitespace):</td>
              <td>{totalCharWithSpace}</td>
            </tr>
            {/* Total characters excluding all empty space */}
            <tr>
              <td>Total characters (excluding whitespace):</td>
              <td>{totalCharWithoutSpace}</td>
            </tr>
            {/* Total empty space characters */}
            <tr>
              <td>White space characters count:</td>
              <td>{whiteSpaceCharactersCount}</td>
            </tr>
            {/* Total empty space characters */}
            <tr>
              <td>Punctuation marks count:</td>
              <td>{punctuationCount}</td>
            </tr>
            {/* Total lines */}
            <tr>
              <td>Lines count:</td>
              <td>{linesCount}</td>
            </tr>
          </tbody>
        </table>
      }
<p className='copyright'> &copy; Yaya Soumah 2021. All Rights Reserved</p>
    </div>
  )
}

export default App