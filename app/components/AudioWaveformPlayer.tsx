import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioWaveformPlayerProps {
  fileUrl: string;
}

const AudioWaveformPlayer: React.FC<AudioWaveformPlayerProps> = ({ fileUrl }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  

  const handlePlayPause = () => {
    setIsPlaying((prevState) => !prevState);
  };

  return (
    <div className="w-full">
      <div ref={waveformRef} className="w-full h-24" />
      <button
        onClick={handlePlayPause}
        className="mt-4 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>
    </div>
  );
};

export default AudioWaveformPlayer;
