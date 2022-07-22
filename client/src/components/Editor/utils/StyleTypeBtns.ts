import { DraftInlineStyleType } from "draft-js"

export interface IBlockTypeBtns {
  styleType: DraftInlineStyleType,
  name: 'Bold' | 'Italic' | 'Underline'
}

export const styleTypeBtns:IBlockTypeBtns[] = [
  {
    styleType: 'BOLD',
    name: 'Bold'
  },
  {
    styleType: 'ITALIC',
    name: 'Italic'
  },
  {
    styleType: 'UNDERLINE',
    name: 'Underline'
  }
]