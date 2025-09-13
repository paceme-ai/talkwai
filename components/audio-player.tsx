"use client";
import { useRef, useState } from "react";

interface Track {
  title: string;
  file: string;
  duration: number;
}

interface AudioPlayerProps {
  tracks: Track[];
}

interface SingleAudioPlayerProps {
  track: Track;
  duration: number;
}

function SingleAudioPlayer({ track, duration: trackDuration }: SingleAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(trackDuration || 0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current)
      setDuration(audioRef.current.duration || trackDuration || 0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-white border rounded-lg px-3 py-2 w-full">
      {/* Responsive container */}
      <div className="flex flex-wrap gap-2">
        {/* Description - always 150px wide */}
        <div className="w-[150px] flex-shrink-0 flex items-center">
          <h4 className="font-medium text-sm text-gray-900 leading-tight">
            {track.title}
          </h4>
        </div>
        
        {/* Playback controls - flexible width, wraps on small screens */}
        <div className="flex-1 min-w-[200px] flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center hover:opacity-80 flex-shrink-0 text-lg"
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <div className="flex-1 bg-gray-200 rounded-full h-1 min-w-[100px]">
            <div
              className="bg-emerald-600 h-1 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Duration - always 70px wide */}
        <div className="w-[70px] flex-shrink-0 text-right flex items-center justify-end">
          <p className="text-sm text-gray-500">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track.file}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      >
        <track kind="captions" />
      </audio>
    </div>
  );
}

export default function AudioPlayer({ tracks }: AudioPlayerProps) {
  return (
    <div className="space-y-2 max-w-full">
      {tracks.map((track) => (
        <SingleAudioPlayer
          key={track.title}
          track={track}
          duration={track.duration}
        />
      ))}
    </div>
  );
}