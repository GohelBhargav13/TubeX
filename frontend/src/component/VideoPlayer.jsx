import React from 'react'
import ReactPlayer from 'react-player'

const VideoPlayer = ({ videoURL,width,height,config }) => {
  return (
    <div>
        <ReactPlayer
        src={videoURL}
        width= {width || '100%'}
        height={ height ||'200px'}
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