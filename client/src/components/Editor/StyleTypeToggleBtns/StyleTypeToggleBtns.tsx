import { DraftInlineStyle, DraftInlineStyleType, EditorState, RichUtils } from 'draft-js';
import React from 'react'
import ColorPalette from '../UI/ColorPalette/ColorPalette';
import ToggleBtn from '../UI/ToggleBtn/ToggleBtn';
import { styleTypeBtns } from '../utils/StyleTypeBtns';
import './StyleTypeToggleBtns.sass'

interface StyleTypeToggleBtnsProps {
  editorState: EditorState,
  setEditorState: (editorState:EditorState) => void,
  currentStyles: DraftInlineStyle
}

const StyleTypeToggleBtns: React.FC<StyleTypeToggleBtnsProps> = ({
  editorState, 
  setEditorState, 
  currentStyles
}) => {

  const _changeStyleOnClick = (type:DraftInlineStyleType) => { 
    setEditorState(RichUtils.toggleInlineStyle(editorState, type));
  }

  return (
    <div className='style-type-toggle-btns' >
      {styleTypeBtns.length && styleTypeBtns.map((btn, index) => 
        <ToggleBtn
          key={index}
          isActive={currentStyles && currentStyles.has(btn.styleType)}
          onClick={() => _changeStyleOnClick(btn.styleType)}
          children={btn.name}
        />
      )}
      <ColorPalette
        currentStyles={currentStyles}
        editorState={editorState} 
        setEditorState={setEditorState}
      />
    </div>
  )
}

export default StyleTypeToggleBtns