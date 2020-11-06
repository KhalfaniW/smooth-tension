import React, {useState, useRef} from "react";
import YouTube from "react-youtube";

// import {calmVideoUrls} from "api/configuration";
import "./playlist.css";
export default function CalmPlaylist({containerStyle}) {
  const [isShown, setIsShown] = useState(true);
  // const [calmVideoUrlIndex, setcalmVideoUrlIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const [player, setPlayer] = useState(null);

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
    <>
      <div
        id="calmPlaylist"
        style={{...containerStyle, display: "flex", flexDirection: "column"}}
      >
        <h1
          style={{
            display: "inline-block",
            width: "30%",
            fontSize: "large!important",
            fontWeight: "bold",
            textAlign: "center",
            background: "white",
            borderRadius: "10px",
          }}
        >
          Calming Video
        </h1>
        <button onClick={toggleMute}> {isMuted ? "Un-Mute" : "Mute"}</button>
        <div style={{flexGrow: "1"}}>
          {/* use div to manage size dynamically */}
          <YouTube
            videoId={"pIallVw48SY"} // defaults -> null
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
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
        </div>
      </div>
    </>
  );
}
