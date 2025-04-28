// src/services/StorageService.js
import Dexie from 'dexie';

// Initialize the database
const db = new Dexie('baseballPitchTracker');

// Define database schema
db.version(1).stores({
  games: '++id, date, opponent, location',
  pitchers: '++id, name, number, team',
  pitches: '++id, pitcherId, gameId, inning, count, pitchType, result, batterSide, timestamp'
});

// Game-related functions
export const saveGame = async (game) => {
  // Add timestamp if not present
  if (!game.date) {
    game.date = new Date().toISOString();
  }
  
  try {
    const id = await db.games.add(game);
    return { ...game, id };
  } catch (error) {
    console.error('Error saving game:', error);
    throw error;
  }
};

export const getGames = async () => {
  try {
    return await db.games.toArray();
  } catch (error) {
    console.error('Error fetching games:', error);
    return [];
  }
};

export const getGameById = async (id) => {
  try {
    return await db.games.get(id);
  } catch (error) {
    console.error(`Error fetching game ${id}:`, error);
    return null;
  }
};

// Pitcher-related functions
export const savePitcher = async (pitcher) => {
  try {
    const id = await db.pitchers.add(pitcher);
    return { ...pitcher, id };
  } catch (error) {
    console.error('Error saving pitcher:', error);
    throw error;
  }
};

export const getPitchers = async (team = null) => {
  try {
    if (team) {
      return await db.pitchers.where('team').equals(team).toArray();
    }
    return await db.pitchers.toArray();
  } catch (error) {
    console.error('Error fetching pitchers:', error);
    return [];
  }
};

export const getPitcherById = async (id) => {
  try {
    return await db.pitchers.get(id);
  } catch (error) {
    console.error(`Error fetching pitcher ${id}:`, error);
    return null;
  }
};

// Pitch-related functions
export const savePitch = async (pitch) => {
  // Add timestamp
  pitch.timestamp = new Date().toISOString();
  
  try {
    const id = await db.pitches.add(pitch);
    return { ...pitch, id };
  } catch (error) {
    console.error('Error saving pitch:', error);
    throw error;
  }
};

export const getPitchesByPitcher = async (pitcherId, gameId = null) => {
  try {
    if (gameId) {
      return await db.pitches
        .where({ pitcherId, gameId })
        .sortBy('timestamp');
    }
    return await db.pitches
      .where('pitcherId')
      .equals(pitcherId)
      .sortBy('timestamp');
  } catch (error) {
    console.error(`Error fetching pitches for pitcher ${pitcherId}:`, error);
    return [];
  }
};

export const getPitchesByGame = async (gameId) => {
  try {
    return await db.pitches
      .where('gameId')
      .equals(gameId)
      .sortBy('timestamp');
  } catch (error) {
    console.error(`Error fetching pitches for game ${gameId}:`, error);
    return [];
  }
};

// Export data functions
export const exportData = async () => {
  try {
    const data = {
      games: await db.games.toArray(),
      pitchers: await db.pitchers.toArray(),
      pitches: await db.pitches.toArray(),
      exportDate: new Date().toISOString()
    };
    
    return data;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

// Import data function
export const importData = async (data) => {
  try {
    // Clear existing data
    await db.games.clear();
    await db.pitchers.clear();
    await db.pitches.clear();
    
    // Import new data
    if (data.games && data.games.length) {
      await db.games.bulkAdd(data.games);
    }
    
    if (data.pitchers && data.pitchers.length) {
      await db.pitchers.bulkAdd(data.pitchers);
    }
    
    if (data.pitches && data.pitches.length) {
      await db.pitches.bulkAdd(data.pitches);
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

export default {
  saveGame,
  getGames,
  getGameById,
  savePitcher,
  getPitchers,
  getPitcherById,
  savePitch,
  getPitchesByPitcher,
  getPitchesByGame,
  exportData,
  importData
};