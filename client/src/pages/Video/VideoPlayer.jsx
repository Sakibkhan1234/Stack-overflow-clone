import React, { useRef, useState } from 'react';
import { uploadVideo } from '../../api/index'; 
import { Cloudinary } from 'cloudinary-core';
import upload from '../../assest/upload-solid.svg';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [resolutions, setResolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  // eslint-disable-next-line 
  const [progress, setProgress] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [pressInterval, setPressInterval] = useState(null);

  // eslint-disable-next-line 
  const cloudinary = new Cloudinary({ cloud_name: 'your_cloud_name' });

  const handleVideoUpload = async (event) => {
    setLoading(true);
    setUploadProgress(0);
    setProgress(0);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await uploadVideo(formData, progressEvent => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setUploadProgress(percentCompleted);
        setProgress(percentCompleted);
      });

      setResolutions(response.data.resolutions);
      setVideoSrc(response.data.defaultSrc);
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoLoaded = () => {
    setUploadProgress(100);
  };

  const handleResolutionChange = (e) => {
    setVideoSrc(e.target.value);
  };

  const handleDoubleTap = (direction) => {
    if (direction === 'left') {
      videoRef.current.currentTime -= 5;
    } else if (direction === 'right') {
      videoRef.current.currentTime += 10;
    } else if (direction === 'middle') {
      togglePlayPause();
    }
  };

  const handlePressHold = (direction) => {
    if (direction === 'left') {
      setPressInterval(
        setInterval(() => {
          videoRef.current.currentTime -= 0.3;
        }, 100)
      );
    } else if (direction === 'right') {
      setPressInterval(
        setInterval(() => {
          videoRef.current.currentTime += 0.2;
        }, 100)
      );
    }
  };

  const resetPlaybackRate = () => {
    if (pressInterval) {
      clearInterval(pressInterval);
      setPressInterval(null);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleTap = (e) => {
    e.preventDefault();
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) {
      const rect = videoRef.current.getBoundingClientRect();
      const tapAreaWidth = rect.width / 3;
      const tapX = e.clientX - rect.left; 

      if (tapX < tapAreaWidth) {
        handleDoubleTap('left');
      } else if (tapX > 2 * tapAreaWidth) {
        handleDoubleTap('right');
      } else {
        handleDoubleTap('middle');
      }
    }

    setLastTap(currentTime);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const rect = videoRef.current.getBoundingClientRect();
    const tapAreaWidth = rect.width / 3;
    const tapX = e.touches[0].clientX - rect.left; 

    if (tapX < tapAreaWidth) {
      handlePressHold('left');
    } else if (tapX > 2 * tapAreaWidth) {
      handlePressHold('right');
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    resetPlaybackRate();
  };

  return (
    <div className='div-hole'>
      <button type='button' className='btn-col'>
        <img src={upload} alt="icon" width={20} style={{ backgroundColor: 'red' }} /> UPLOAD
        <input type="file" onChange={handleVideoUpload} className='input-name' />
      </button>
      <h7 className='h1-co'>(<span className='co'>note : </span>Enjoy your viewing experience with different resolutions like <span className='co'>144p, 240, 360p, 720p, and 1080p</span>.)</h7>
      {loading && (
        <div className='div-upload'>
          Uploading: {uploadProgress}%
          <progress value={uploadProgress} max={100} />
        </div>
      )}
      {videoSrc && (
        <select onChange={handleResolutionChange} className='select-res'>
          {resolutions.map((res, index) => (
            <option key={index} value={res.src}>{res.label}</option>
          ))}
        </select>
      )}
      <h1 className='h1-player'>VIDEO PLAYER</h1>
      {loading && (
        <div className='div-loading'>Loading....</div>
      )}

      {videoSrc && (
        <div>
          <video
            className='video-video'
            onClick={handleTap}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            ref={videoRef}
            src={videoSrc}
            controls
            style={{ width: "900px", height: "400px" }}
            onLoadedData={handleVideoLoaded}
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

