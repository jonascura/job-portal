
import React from "react";
import ReactPlayer from "react-player";
import "../styles/videoList.css"; // Make sure the path is correct

const VideoList = ({ videos, handleVideoUpload }) => {
  console.log("videos:  ", videos);
  
  return (
    <div style={{ maxHeight:'165ex', overflowY: 'scroll' }}>
      <div>
        <input type="file" accept="video/*" onChange={handleVideoUpload} />
      </div>
      {videos.map((video, index) => (
        <div key={index} className="video-container" >
          <ReactPlayer
            className="react-player"
            url={video.url}
            width="100%"
            height="100%"
            controls
            playing
          />
        </div>
      ))}
    </div>
  );
};

export default VideoList;
