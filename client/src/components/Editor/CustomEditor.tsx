import React, { useEffect, useState } from 'react'
import { ContentState, DraftBlockType, DraftEditorCommand, DraftInlineStyle, Editor, EditorState, RichUtils} from 'draft-js'
import BlockTypeToggleBtns from './BlockTypeToggleBtns/BlockTypeToggleBtns'
import StyleTypeToggleBtns from './StyleTypeToggleBtns/StyleTypeToggleBtns'
import { colorMap, bkgdColorMap } from './utils/ColorMaps'
import 'draft-js/dist/Draft.css'
import './CustomEditor.sass'


interface CustomEditorProps {
  className?: string
  contentState?: ContentState
  setContentState?: (ContentState: ContentState) => void
  readonly?: boolean
}

const CustomEditor:React.FC<CustomEditorProps>= ({className, setContentState, contentState, readonly=false}) => {
  const [editorState, setEditorState] = useState<EditorState>(  
    () =>  EditorState.createEmpty()
  )

  useEffect(() => {
  if (contentState) {
    const newEditorState = EditorState.createWithContent(contentState)
    setEditorState(newEditorState)
  }
  }, [contentState])

  const [currentBlockType, setCurrentBlockType] = useState<DraftBlockType>('')
  const [currentStyleTypes, setCurrentStyleTypes] = useState<DraftInlineStyle>(null)

  const setDefaultIfEmpty = (currentStyles:DraftInlineStyle, editorState:EditorState) => {
    const currentFontColor = Object.keys(colorMap).filter(c => currentStyles.has(c))
    let changedStyles = currentStyles
    let changedState = editorState
    if(currentFontColor.length === 0){
      changedStyles = changedStyles.add('#333333')
      changedState = RichUtils.toggleInlineStyle(changedState, '#333333')
    }
    const currentBkgdColor = Object.keys(bkgdColorMap).filter(c => currentStyles.has(c))
    if(currentBkgdColor.length === 0){
      changedStyles = changedStyles.add('bkgdtransparent')
      changedState = RichUtils.toggleInlineStyle(changedState, 'bkgdtransparent')
    }
    if(changedState.getCurrentInlineStyle().toString() !== editorState.getCurrentInlineStyle().toString()){
      setEditorState(changedState)
    }
    return changedStyles
  }

  useEffect(() => {
    const currentStyles = editorState.getCurrentInlineStyle()
    const changedStyles = setDefaultIfEmpty(currentStyles, editorState)
    const currentKey = editorState.getSelection().getStartKey()
    const currentBlock = editorState.getCurrentContent().getBlockForKey(currentKey)
    setCurrentBlockType(currentBlock.getType())
    setCurrentStyleTypes(changedStyles)
    
    if(setContentState){
      setContentState(editorState.getCurrentContent())
    }
  }, [editorState])

  const handleKeyCommand = (
    command:DraftEditorCommand, 
    editorState:EditorState
  ): 'handled' | 'not-handled' => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  return (
    <div className={className}>
      {!readonly && 
      <>
      <BlockTypeToggleBtns
        currentBlockType={currentBlockType}
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <StyleTypeToggleBtns
        currentStyles={currentStyleTypes}
        editorState={editorState}
        setEditorState={setEditorState}
      />
      </>
      }
      <div className='editor-area'>
        <Editor
          readOnly={readonly}
          customStyleMap={{...colorMap, ...bkgdColorMap}}
          placeholder={readonly ? "" : "Enter some text..."} 
          editorState={editorState} 
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState} 
        />
      </div>
    </div>
  )
}

export default CustomEditor