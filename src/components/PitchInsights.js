import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPitchesByPitcher, getPitcherById } from '../services/StorageService';

const PitchInsights = () => {
  const { pitcherId } = useParams();
  const navigate = useNavigate();
  
  const [pitcher, setPitcher] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get pitcher data
        const pitcherData = await getPitcherById(Number(pitcherId));
        setPitcher(pitcherData);
        
        // Get pitch data
        const pitchData = await getPitchesByPitcher(Number(pitcherId));
        setPitches(pitchData);
        
        // Generate insights once we have the data
        if (pitchData.length > 0) {
          generateInsights(pitchData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, [pitcherId]);
  
  // Generate insights from pitch data
  const generateInsights = (pitchData) => {
    // Total pitches
    const totalPitches = pitchData.length;
    
    // Pitch type breakdown
    const pitchTypes = pitchData.reduce((acc, pitch) => {
      acc[pitch.pitchType] = (acc[pitch.pitchType] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate percentages
    const pitchTypePercentages = {};
    Object.keys(pitchTypes).forEach(type => {
      pitchTypePercentages[type] = Math.round((pitchTypes[type] / totalPitches) * 100);
    });
    
    // First pitch tendencies
    const firstPitches = pitchData.filter(pitch => pitch.count === '0-0');
    const firstPitchTypes = firstPitches.reduce((acc, pitch) => {
      acc[pitch.pitchType] = (acc[pitch.pitchType] || 0) + 1;
      return acc;
    }, {});
    
    // First pitch percentages
    const firstPitchPercentages = {};
    const totalFirstPitches = firstPitches.length;
    if (totalFirstPitches > 0) {
      Object.keys(firstPitchTypes).forEach(type => {
        firstPitchPercentages[type] = Math.round((firstPitchTypes[type] / totalFirstPitches) * 100);
      });
    }
    
    // When behind in count (more balls than strikes)
    const behindInCount = pitchData.filter(pitch => {
      const [balls, strikes] = pitch.count.split('-').map(Number);
      return balls > strikes;
    });
    
    // When ahead in count (more strikes than balls)
    const aheadInCount = pitchData.filter(pitch => {
      const [balls, strikes] = pitch.count.split('-').map(Number);
      return strikes > balls;
    });
    
    // 3 ball counts
    const threeBallCounts = pitchData.filter(pitch => {
      const [balls, strikes] = pitch.count.split('-').map(Number);
      return balls === 3;
    });
    
    // VS left/right batters
    const vsLeft = pitchData.filter(pitch => pitch.batterSide === 'L');
    const vsRight = pitchData.filter(pitch => pitch.batterSide === 'R');
    
    // VS left/right pitch type breakdowns
    const vsLeftTypes = vsLeft.reduce((acc, pitch) => {
      acc[pitch.pitchType] = (acc[pitch.pitchType] || 0) + 1;
      return acc;
    }, {});
    
    const vsRightTypes = vsRight.reduce((acc, pitch) => {
      acc[pitch.pitchType] = (acc[pitch.pitchType] || 0) + 1;
      return acc;
    }, {});
    
    // Percentage of strikes
    const strikes = pitchData.filter(pitch => 
      pitch.result === 'strike' || pitch.result === 'foul'
    ).length;
    const strikePercentage = Math.round((strikes / totalPitches) * 100);
    
    // Set all insights
    setInsights({
      totalPitches,
      pitchTypes,
      pitchTypePercentages,
      firstPitchPercentages,
      behindInCount: behindInCount.length,
      aheadInCount: aheadInCount.length,
      threeBallCounts: threeBallCounts.length,
      vsLeft: vsLeft.length,
      vsRight: vsRight.length,
      vsLeftTypes,
      vsRightTypes,
      strikePercentage
    });
  };
  
  // Format insights for display
  const formatInsight = (value) => {
    if (typeof value === 'object') {
      return Object.entries(value)
        .map(([key, val]) => `${key}: ${val}%`)
        .join(', ');
    }
    return value;
  };
  
  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  
  if (!pitcher) return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pitcher not found</h2>
      <button 
        onClick={() => navigate('/game')}
        className="bg-blue-600 text-white py-2 px-4 rounded"
      >
        Back to Game
      </button>
    </div>
  );
  
  // No pitches data
  if (pitches.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{pitcher.name} #{pitcher.number}</h2>
        <p className="mb-4">No pitch data available for this pitcher yet.</p>
        <button 
          onClick={() => navigate(`/track/${pitcherId}`)}
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Track Pitches
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate(`/track/${pitcherId}`)} 
            className="font-bold"
          >
            &lt; Back
          </button>
          <h1 className="text-lg font-bold">
            {pitcher.name} #{pitcher.number} Insights
          </h1>
          <div className="w-6"></div> {/* Spacer for symmetry */}
        </div>
      </div>
      
      {/* Insights Content */}
      <div className="p-4 overflow-auto">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-bold mb-2">Overview</h2>
          <p className="mb-2">Total Pitches: {insights.totalPitches}</p>
          <p className="mb-2">Strike %: {insights.strikePercentage}%</p>
          <p className="mb-2">Pitch Types: {formatInsight(insights.pitchTypePercentages)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-bold mb-2">First Pitch Tendencies</h2>
          <p>{formatInsight(insights.firstPitchPercentages)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-bold mb-2">Count Situations</h2>
          <p className="mb-2">When Behind: {insights.behindInCount} pitches</p>
          <p className="mb-2">When Ahead: {insights.aheadInCount} pitches</p>
          <p className="mb-2">3-Ball Counts: {insights.threeBallCounts} pitches</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-bold mb-2">vs. Left/Right Batters</h2>
          <p className="mb-2">vs. Left: {insights.vsLeft} pitches</p>
          <p className="mb-2">vs. Right: {insights.vsRight} pitches</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-bold mb-2">Predictions</h2>
          {insights.totalPitches > 10 ? (
            <>
              <p className="mb-2">First Pitch: Likely {
                Object.entries(insights.firstPitchPercentages || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([type]) => type)[0] || 'fastball'
              }</p>
              <p className="mb-2">3-Ball Count: Watch for {
                insights.threeBallCounts > 3 ? 'fastball (control pitch)' : 'their best pitch'
              }</p>
              <p className="mb-2">vs. Lefties: Prefers {
                Object.entries(insights.vsLeftTypes || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([type]) => type)[0] || 'fastball'
              }</p>
            </>
          ) : (
            <p>Need more data for reliable predictions (at least 10 pitches)</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PitchInsights;