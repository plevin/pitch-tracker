import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PitchTracker = ({ savePitch, currentGame }) => {
  const { pitcherId } = useParams();
  const navigate = useNavigate();
  
  // State for current at-bat
  const [balls, setBalls] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [inning, setInning] = useState(1);
  const [isTop, setIsTop] = useState(true);
  const [batterSide, setBatterSide] = useState('R'); // R for right, L for left
  
  // Current pitcher info
  const [pitcher, setPitcher] = useState(null);
  
  // Load pitcher data
  useEffect(() => {
    // In a real app, fetch the pitcher from your storage
    const loadPitcher = async () => {
      // Placeholder - replace with actual data fetch
      setPitcher({
        id: pitcherId,
        name: "John Doe",
        number: "21",
        team: "Opponents"
      });
    };
    
    loadPitcher();
  }, [pitcherId]);
  
  // Handle pitch logging
  const logPitch = (type, result) => {
    const pitchData = {
      pitcherId,
      gameId: currentGame.id,
      inning,
      isTop,
      count: `${balls}-${strikes}`,
      pitchType: type,
      result,
      batterSide
    };
    
    // Save pitch data
    savePitch(pitchData);
    
    // Update count based on result
    if (result === 'ball') {
      if (balls === 3) {
        // Walk - reset count
        setBalls(0);
        setStrikes(0);
      } else {
        setBalls(balls + 1);
      }
    } else if (result === 'strike' || result === 'foul') {
      if (strikes === 2 && result === 'foul') {
        // Foul with 2 strikes stays at 2 strikes
        setStrikes(2);
      } else if (strikes === 2) {
        // Strikeout - reset count
        setBalls(0);
        setStrikes(0);
      } else {
        setStrikes(strikes + 1);
      }
    } else {
      // In play - reset count
      setBalls(0);
      setStrikes(0);
    }
  };
  
  // Handle inning changes
  const changeInning = (increment) => {
    if (increment) {
      if (isTop) {
        setIsTop(false);
      } else {
        setInning(inning + 1);
        setIsTop(true);
      }
    } else {
      if (!isTop) {
        setIsTop(true);
      } else if (inning > 1) {
        setInning(inning - 1);
        setIsTop(false);
      }
    }
  };
  
  // Reset count manually
  const resetCount = () => {
    setBalls(0);
    setStrikes(0);
  };
  
  if (!pitcher) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate('/game')} 
            className="font-bold"
          >
            &lt; Back
          </button>
          <h1 className="text-lg font-bold">
            {pitcher.name} #{pitcher.number}
          </h1>
          <div className="w-6"></div> {/* Spacer for symmetry */}
        </div>
      </div>
      
      {/* Game Info */}
      <div className="bg-blue-500 text-white p-2 flex justify-between items-center">
        <button 
          onClick={() => changeInning(false)}
          className="bg-blue-700 px-3 py-1 rounded"
        >
          &lt;
        </button>
        <div className="text-center">
          <span className="font-bold">{isTop ? 'Top' : 'Bottom'} {inning}</span>
        </div>
        <button 
          onClick={() => changeInning(true)}
          className="bg-blue-700 px-3 py-1 rounded"
        >
          &gt;
        </button>
      </div>
      
      {/* Count Display */}
      <div className="flex justify-center py-4 text-xl">
        <div className="px-4">
          <span className="font-bold">Balls: </span>
          <span className="text-2xl">{balls}</span>
        </div>
        <div className="px-4">
          <span className="font-bold">Strikes: </span>
          <span className="text-2xl">{strikes}</span>
        </div>
      </div>
      
      {/* Batter Side Toggle */}
      <div className="flex justify-center py-2">
        <span className="mr-2">Batter: </span>
        <button
          onClick={() => setBatterSide('L')}
          className={`px-3 py-1 mx-1 rounded ${batterSide === 'L' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
        >
          L
        </button>
        <button
          onClick={() => setBatterSide('R')}
          className={`px-3 py-1 mx-1 rounded ${batterSide === 'R' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}
        >
          R
        </button>
      </div>
      
      {/* Pitch Type Buttons */}
      <div className="flex flex-col items-center py-4">
        <h2 className="text-lg font-bold mb-2">Pitch Type</h2>
        <div className="flex w-full max-w-xs justify-around">
          <button 
            onClick={() => logPitch('fastball', 'strike')}
            className="bg-red-500 text-white py-3 px-6 rounded-lg text-lg shadow-md"
          >
            Fastball
          </button>
          <button 
            onClick={() => logPitch('off-speed', 'strike')}
            className="bg-green-500 text-white py-3 px-6 rounded-lg text-lg shadow-md"
          >
            Off-Speed
          </button>
        </div>
      </div>
      
      {/* Result Buttons */}
      <div className="flex flex-col items-center py-4">
        <h2 className="text-lg font-bold mb-2">Result</h2>
        <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
          <button 
            onClick={() => logPitch('fastball', 'ball')}
            className="bg-blue-500 text-white py-2 px-4 rounded shadow"
          >
            Ball
          </button>
          <button 
            onClick={() => logPitch('fastball', 'strike')}
            className="bg-red-500 text-white py-2 px-4 rounded shadow"
          >
            Strike
          </button>
          <button 
            onClick={() => logPitch('fastball', 'foul')}
            className="bg-yellow-500 text-white py-2 px-4 rounded shadow"
          >
            Foul
          </button>
          <button 
            onClick={() => logPitch('fastball', 'in_play')}
            className="bg-green-500 text-white py-2 px-4 rounded shadow"
          >
            In Play
          </button>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-auto p-4 border-t">
        <div className="flex justify-between">
          <button 
            onClick={resetCount}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Reset Count
          </button>
          <button 
            onClick={() => navigate(`/insights/${pitcherId}`)}
            className="bg-blue-600 text-white py-2 px-4 rounded"
          >
            View Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default PitchTracker;