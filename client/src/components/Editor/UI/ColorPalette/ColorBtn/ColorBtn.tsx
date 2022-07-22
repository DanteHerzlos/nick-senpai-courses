import React from 'react'
import cl from './ColorBtn.module.sass'

interface ColorBtnProps {
  bckColor: string,
  isActive: boolean,
  onClick?: React.MouseEventHandler<HTMLDivElement>,
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>,
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
}

const ColorBtn: React.FC<ColorBtnProps> = ({
  bckColor = 'none', 
  isActive, 
  onClick, 
  onMouseEnter, 
  onMouseLeave
}) => {
  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseDown={e => e.preventDefault()} 
      onClick={onClick}
      style={{
        backgroundColor: bckColor,
        border: (bckColor === 'transparent' || bckColor === '#ffffff') 
          ? '1px solid #666' 
          : 'none' 
      }} 
      className={isActive ? [cl.colorBtn, cl._active].join(' ') : cl.colorBtn}
    >
    </div>
  )
}

export default ColorBtn