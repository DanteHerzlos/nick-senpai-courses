import { DraftInlineStyle, EditorState, RichUtils } from 'draft-js'
import React, { useState, useEffect } from 'react'
import ColorBtn from './ColorBtn/ColorBtn'
import ToggleBtn from '../ToggleBtn/ToggleBtn'
import { colorMap, bkgdColorMap } from '../../utils/ColorMaps'
import cl from './ColorPalette.module.sass'

interface ColorPaletteProps {
  editorState: EditorState,
  setEditorState: (editorState:EditorState) => void,
  currentStyles: DraftInlineStyle
}

interface IExmpTextStyle {
  color: string;
  backgroundColor: string;
}

type ColorType= 'BkgdColor' | 'FontColor'


const ColorPalette: React.FC<ColorPaletteProps> = ({
  editorState, 
  setEditorState, 
  currentStyles
}) => {
  const [isActive, setIsActive] = useState<boolean>(false)
  const [toggleColorMenu, setToggleColorMenu] = useState<ColorType>('FontColor')
  const [exmpTextStyle, setExmpTextStyle] = useState<IExmpTextStyle>(
    {color: '#333333', backgroundColor: 'transparent'}
  )

  useEffect(() => {
    const styles = editorState.getCurrentInlineStyle();
    const [currentFontColor] = Object.keys(colorMap).filter(c => styles.has(c))
    const [currentBkgdColor] = Object.keys(bkgdColorMap).filter(c => styles.has(c))
    if (currentFontColor && currentBkgdColor) {
      setExmpTextStyle({
        ...exmpTextStyle, 
        ...colorMap[currentFontColor], 
        ...bkgdColorMap[currentBkgdColor]
      })
    }  
  }, [isActive])

  const chooseColorMap = (colorType: ColorType) => {
    if (colorType === 'BkgdColor'){
      return bkgdColorMap  
    }
    return colorMap
  }

  const _onColorPick = (color:string, colorType:ColorType) => {
    const currentMap = chooseColorMap(colorType)
    const currentColor = Object.keys(currentMap).filter(c => currentStyles.has(c))
    //check for exisiting color style
    if(currentColor[0] !== color){ 
      const newState = RichUtils.toggleInlineStyle(editorState, currentColor[0])
      setEditorState(RichUtils.toggleInlineStyle(newState, color))
      setIsActive(false)
    } 
  }

  const mouseEnterColor = (color:string) => {
    setExmpTextStyle({...exmpTextStyle, color})
  }

  const mouseEnterBkgdColor = (backgroundColor:string) => {
    setExmpTextStyle({...exmpTextStyle, backgroundColor})
  }

  const mouseLeaveColor = () => {
    const [currentColor] = Object.keys(colorMap).filter(c => currentStyles.has(c))
    setExmpTextStyle({...exmpTextStyle, ...colorMap[currentColor]})
  }

  const mouseLeaveBkgdColor = () => {
    const [currentColor] = Object.keys(bkgdColorMap).filter(c => currentStyles.has(c))
    setExmpTextStyle({...exmpTextStyle, ...bkgdColorMap[currentColor]})
  }

  return (
    <span >
      <ToggleBtn
        onClick={() => setIsActive(!isActive)}
      >Color</ToggleBtn>
      <div 
        onMouseDown={e => e.preventDefault()} 
        className={isActive 
          ? [cl.colorPallete, cl._active].join(' ') 
          : cl.colorPallete
        }
      >
        <div className={cl.switchBtns}>
          <ToggleBtn
            isActive={toggleColorMenu === 'FontColor'}
            onClick={() => setToggleColorMenu('FontColor')}
          >Цвет текста</ToggleBtn>
          <ToggleBtn
            isActive={toggleColorMenu === 'BkgdColor'}
            onClick={() => setToggleColorMenu('BkgdColor')}
          >Цвет фона</ToggleBtn>
        </div>
        {toggleColorMenu === 'FontColor' &&
          <div className={cl.colorBtns}>
            {Object.entries(colorMap).map(([key, value]) => 
              <ColorBtn
                isActive={currentStyles && currentStyles.has(key)}
                onMouseLeave={mouseLeaveColor}
                onMouseEnter={() => mouseEnterColor(value.color)}
                onClick={() => _onColorPick(key, 'FontColor')}
                bckColor={value.color}
                key={key}
              />
            )}
          </div>
        }
        {toggleColorMenu === 'BkgdColor' &&
          <div className={cl.colorBtns}>
            {Object.entries(bkgdColorMap).map(([key, value]) => 
              <ColorBtn
                isActive={currentStyles && currentStyles.has(key)} 
                onMouseLeave={mouseLeaveBkgdColor}
                onMouseEnter={() => mouseEnterBkgdColor(value.backgroundColor)}
                onClick={() => _onColorPick(key, 'BkgdColor')}
                bckColor={value.backgroundColor}
                key={key}
              />
            )}
          </div>
        }
        <div style={exmpTextStyle}>
          Пример текста
        </div>
      </div>
    </span>
  )
}

export default ColorPalette