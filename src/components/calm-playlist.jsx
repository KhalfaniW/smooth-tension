import React, {useState, useRef} from "react";
import YouTube from "react-youtube";

// import {calmVideoUrls} from "api/configuration";
import "./playlist.css";
export default function CalmPlaylist({containerStyle}) {
  const [isShown, setIsShown] = useState(true);
  // const [calmVideoUrlIndex, setcalmVideoUrlIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const [player, setPlayer] = useState(null);
  const videoIdGroup = [
    "Mw9qiV7XlFs",
    "TjsDd5ZKIfA",
    "3rDjPLvOShM",
    "ZOZOqbK86t0",
    "v0vrhCqFUFE",
  ];
  const [videoIndex, setVideoIndex] = useState(0);
  function toggleMute() {
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  }
  return (
    <div
      id="calmPlaylist"
      style={{...containerStyle, display: "flex", flexDirection: "column"}}
    >
      <div style={{flexGrow: "1"}}>
        {/* use div to manage size dynamically */}
        <YouTube
          videoId={videoIdGroup[videoIndex]} // defaults -> null
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: false,
            },
          }}
          containerClassName={"youtubeHolder"}
          onReady={(event) => {
            if (isMuted) {
              event.target.mute();
              console.log("mute it");
            }
            setPlayer(event.target);
          }}
        />
        <button onClick={toggleMute}> {isMuted ? "Un-Mute" : "Mute"}</button>
        <button
          onClick={() => {
            setVideoIndex(
              (videoIndex) => (videoIndex + 1) % videoIdGroup.length,
            );
          }}
        >
          "Next"
        </button>
      </div>
    </div>
  );
}
