import React, { useState, useRef } from "react";
//import Styles
import "../src/Style/app.scss";
//import Components
import Player from "../src/Component/Player";
import Song from "../src/Component/Song";
import Library from "../src/Component/Library";
import Nav from "../src/Component/Nav";
//import data
import chillHop from "./data";

export default function App() {
  //Ref
  const audioRef = useRef(null);
  //State
  const [songs, setSongs] = useState(chillHop());
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  });
  const [repeat, setRepeat] = useState(false);
  const volumeStorage = () =>
    localStorage.getItem("volume") ? localStorage.getItem("volume") : 1;

  const [volume, setVolume] = useState(JSON.parse(volumeStorage()));
  const [libraryStatus, setLibraryStatus] = useState(false);

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    //claculate percentage
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);
    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
      animationPercentage: animation,
    });
  };
  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) audioRef.current.play();
  };
  const setSongVolume = () => {
    audioRef.current.volume = volumeStorage();
  };
  return (
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      <div clasName="header_s" style={{ backgroundColor: "#9aabe1fa" }}>
        <Nav
          libraryStatus={libraryStatus}
          setLibraryStatus={setLibraryStatus}
        />
        <Song currentSong={currentSong} isPlaying={isPlaying} />
        <Player
          setSongVolume={setSongVolume}
          volume={volume}
          setVolume={setVolume}
          audioRef={audioRef}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
          currentSong={currentSong}
          setSongInfo={setSongInfo}
          songInfo={songInfo}
          songs={songs}
          setCurrentSong={setCurrentSong}
          setSongs={setSongs}
          setRepeat={setRepeat}
          repeat={repeat}
        />
        <Library
          audioRef={audioRef}
          songs={songs}
          setCurrentSong={setCurrentSong}
          isPlaying={isPlaying}
          setSongs={setSongs}
          libraryStatus={libraryStatus}
          currentSong={currentSong}
        />
        <audio
          onLoadedMetadataCapture={setSongVolume}
          onTimeUpdate={timeUpdateHandler}
          onLoadedMetadata={timeUpdateHandler}
          ref={audioRef}
          src={currentSong.audio}
          onEnded={songEndHandler}
        ></audio>
      </div>
    </div>
  );
}
