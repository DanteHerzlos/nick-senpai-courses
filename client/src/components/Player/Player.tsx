import React from 'react'
import ReactPlayer from 'react-player'
import cl from './Player.module.sass'

interface IProgress {
  played: number
}

interface PlayerProps {
  url: string
  maxWidth?: string
  onProgress?: (event: IProgress) => void
  onPause?: () => void
  onEnded?: () => void
}

const Player:React.FC<PlayerProps> = ({onEnded, onPause, onProgress, url, maxWidth = '720px'}) => {
  return (
    <div style={{maxWidth}} className={cl.playerMargin}>
      <div className={cl.playerWrapper}>
        <ReactPlayer
          width='100%'
          height='100%'
          className={cl.reactPlayer}
          url={url}
          controls={true}
          onProgress={onProgress}
          onPause={onPause}
          onEnded={onEnded}
        />
      </div>
    </div>
  )
}

export default Player