import React from 'react'
import { useRef } from 'react'
import ReactPlayer from 'react-player'

const VideoPlayer = ({ videoURL,width,height,config }) => {
const playerRef = useRef(null)
  return (
    <div>
        <ReactPlayer
        src={videoURL}
        width= {width || '100%'}
        height={ height ||'200px'}
        ref={playerRef}
        controls
        crossOrigin='undefined'
        color='red'
        config={ config }
        onError={(e) => console.log("Error in video Playing: ",e)}
         />
    </div>
  )
}

export default VideoPlayer