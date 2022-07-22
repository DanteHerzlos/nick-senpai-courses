import { DraftBlockType } from "draft-js"

export interface IBlockTypeBtns {
  blockType: DraftBlockType,
  name: 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'UL' | 'OL'
}

export const blockTypeBtns:IBlockTypeBtns[] = [
  {
    blockType: 'header-one',
    name: 'H1'
  },
  {
    blockType: 'header-two',
    name: 'H2'
  },
  {
    blockType: 'header-three',
    name: 'H3'
  },
  {
    blockType: 'header-four',
    name: 'H4'
  },
  {
    blockType: 'header-five',
    name: 'H5'
  },
  {
    blockType: 'header-six',
    name: 'H6'
  },
  {
    blockType: 'unordered-list-item',
    name: 'UL'
  },    
  {
    blockType: 'ordered-list-item',
    name: 'OL'
  },
]