import React from 'react'
import cl from './ToggleBtn.module.sass'

interface ToggleBtnProps {
  isActive?: boolean,
  children?: React.ReactNode,
  onClick?: React.MouseEventHandler<HTMLSpanElement>
}

const ToggleBtn: React.FC<ToggleBtnProps> = ({isActive, children, onClick}) => {
  return (
    <span 
      onMouseDown={e => e.preventDefault()} 
      className={isActive ? [cl.editorBtn, cl._active].join(' ') : cl.editorBtn}
      onClick={onClick}
      >
      {children}
    </span>
  )
}

export default ToggleBtn