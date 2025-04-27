import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveGame, getGames, savePitcher, getPitchers } from '../services/StorageService';

const GameSetup = () => {
  const navigate = useNavigate();
  
  // State
  const [games, setGames] = useState([]);
  const [pitchers, setPitchers] = useState([]);
  const [currentGame, setCurrentGame] = useState(null);
  const [newGameOpponent, setNewGameOpponent] = useState('');
  const [newPitcherName, setNewPitcherName] = useState('');
  const [newPitcherNumber, setNewPitcherNumber] = useState('');
  const [pitcherTeam, setPitcherTeam] = useState('opponent');
  const [step, setStep] = useState('game'); // 'game' or 'pitcher'
  
  // Load existing data
  useEffect(() => {
    const loadData = async () => {
      // Get games
      const gameData = await getGames();
      setGames(gameData);
      
      // Get pitchers
      const pitcherData = await getPitchers();
      setPitchers(pitcherData);
      
      // If there's a recent game, select it
      if (gameData.length > 0) {
        setCurrentGame(gameData[gameData.length - 1]);
      }
    };
    
    loadData();
  }, []);
  
  // Create a new game
  const handleCreateGame = async () => {
    if (!newGameOpponent.trim()) {
      alert('Please enter an opponent name');
      return;
    }
    
    try {
      const game = {
        opponent: newGameOpponent,
        date: new Date().toISOString(),
        location: 'Home' // Default value, could be made selectable
      };
      
      const savedGame = await saveGame(game);
      setGames([...games, savedGame]);
      setCurrentGame(savedGame);
      setNewGameOpponent('');
      
      // Move to pitcher selection
      setStep('pitcher');
    } catch (error) {
      console.error('Error creating game:', error);
      alert('Failed to create game');
    }
  };
  
  // Select an existing game
  const handleSelectGame = (game) => {
    setCurrentGame(game);
    setStep('pitcher');
  };
  
  // Create a new pitcher
  const handleCreatePitcher = async () => {
    if (!newPitcherName.trim()) {
      alert('Please enter a pitcher name');
      return;
    }
    
    if (!newPitcherNumber.trim()) {
      alert('Please enter a pitcher number');
      return;
    }
    
    try {
      const pitcher = {
        name: newPitcherName,
        number: newPitcherNumber,
        team: pitcherTeam
      };
      
      const savedPitcher = await savePitcher(pitcher);
      setPitchers([...pitchers, savedPitcher]);
      setNewPitcherName('');
      setNewPitcherNumber('');
      
      // Navigate to pitch tracker for this pitcher
      navigate(`/track/${savedPitcher.id}`);
    } catch (error) {
      console.error('Error creating pitcher:', error);
      alert('Failed to create pitcher');
    }
  };
  
  // Select an existing pitcher
  const handleSelectPitcher = (pitcher) => {
    navigate(`/track/${pitcher.id}`);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Render game selection screen
  if (step === 'game') {
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 shadow">
          <h1 className="text-xl font-bold text-center">Baseball Pitch Tracker</h1>
        </div>
        
        {/* Game Selection */}
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">Select Game</h2>
          
          {/* Recent Games */}
          {games.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold mb-2">Recent Games</h3>
              <div className="space-y-2">
                {games.slice().reverse().map(game => (
                  <button
                    key={game.id}
                    onClick={() => handleSelectGame(game)}
                    className="w-full bg-white p-3 rounded-lg shadow text-left flex justify-between items-center"
                  >
                    <span>vs. {game.opponent}</span>
                    <span className="text-gray-500 text-sm">{formatDate(game.date)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* New Game Form */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">New Game</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opponent
                </label>
                <input
                  type="text"
                  value={newGameOpponent}
                  onChange={(e) => setNewGameOpponent(e.target.value)}
                  placeholder="Enter opponent name"
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                onClick={handleCreateGame}
                className="w-full bg-blue-600 text-white py-2 rounded font-bold"
              >
                Create Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Render pitcher selection screen
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setStep('game')} 
            className="font-bold"
          >
            &lt; Back
          </button>
          <h1 className="text-lg font-bold">
            vs. {currentGame?.opponent}
          </h1>
          <div className="w-6"></div> {/* Spacer for symmetry */}
        </div>
      </div>
      
      {/* Pitcher Selection */}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Select Pitcher</h2>
        
        {/* Team Selection Tabs */}
        <div className="flex mb-4 border-b">
          <button
            onClick={() => setPitcherTeam('opponent')}
            className={`flex-1 py-2 text-center ${
              pitcherTeam === 'opponent' 
                ? 'border-b-2 border-blue-600 text-blue-600 font-bold' 
                : 'text-gray-500'
            }`}
          >
            Opponent
          </button>
          <button
            onClick={() => setPitcherTeam('our')}
            className={`flex-1 py-2 text-center ${
              pitcherTeam === 'our' 
                ? 'border-b-2 border-blue-600 text-blue-600 font-bold' 
                : 'text-gray-500'
            }`}
          >
            Our Team
          </button>
        </div>
        
        {/* Recent Pitchers */}
        {pitchers.filter(p => p.team === pitcherTeam).length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-2">Recent Pitchers</h3>
            <div className="space-y-2">
              {pitchers
                .filter(p => p.team === pitcherTeam)
                .map(pitcher => (
                  <button
                    key={pitcher.id}
                    onClick={() => handleSelectPitcher(pitcher)}
                    className="w-full bg-white p-3 rounded-lg shadow text-left flex justify-between items-center"
                  >
                    <span>{pitcher.name}</span>
                    <span className="text-gray-500">#{pitcher.number}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
        
        {/* New Pitcher Form */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-2">New Pitcher</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newPitcherName}
                onChange={(e) => setNewPitcherName(e.target.value)}
                placeholder="Enter pitcher name"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number
              </label>
              <input
                type="text"
                value={newPitcherNumber}
                onChange={(e) => setNewPitcherNumber(e.target.value)}
                placeholder="Enter jersey number"
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleCreatePitcher}
              className="w-full bg-blue-600 text-white py-2 rounded font-bold"
            >
              Track This Pitcher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSetup;