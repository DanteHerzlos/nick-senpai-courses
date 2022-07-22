import { DraftBlockType, EditorState, RichUtils } from 'draft-js'
import React from 'react'
import './BlockTypeToggleBtns.sass'
import ToggleBtn from '../UI/ToggleBtn/ToggleBtn'
import { blockTypeBtns } from '../utils/BlockTypeBtns'

interface BlockTypeToggleBtnsProps {
  editorState: EditorState,
  setEditorState: (editorState:EditorState) => void,
  currentBlockType: DraftBlockType
}

const BlockTypeToggleBtns: React.FC<BlockTypeToggleBtnsProps> = ({
  editorState, 
  setEditorState, 
  currentBlockType
}) => {
  const _onBlockTypeClick = (type:DraftBlockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, type));
  }

  return (
    <div className='blockTypeToggleBtns'>
      {blockTypeBtns.length && blockTypeBtns.map((btn, index) => 
        <ToggleBtn  
          key={index} 
          isActive={currentBlockType === btn.blockType}
          onClick={() => _onBlockTypeClick(btn.blockType)} 
        >
          {btn.name}
        </ToggleBtn>
      )}
    </div>
  )
}

export default BlockTypeToggleBtns