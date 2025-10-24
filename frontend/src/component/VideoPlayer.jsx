import React from 'react'
import ReactPlayer from 'react-player'

const VideoPlayer = ({ videoURL }) => {
  return (
    <div>
        <ReactPlayer
        src={videoURL}
        width= {'312px'}
        height={'200px'}
        controls
        crossOrigin='undefined'
         />
    </div>
  )
}

export default VideoPlayer