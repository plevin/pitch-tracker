// src/services/AnalyticsService.js

/**
 * Generates insights about a pitcher based on their pitch history
 * @param {Array} pitches - Array of pitch objects
 * @returns {Object} - Object containing various statistics and insights
 */
export const generatePitcherInsights = (pitches) => {
  if (!pitches || pitches.length === 0) {
    return {
      message: "Not enough data to generate insights.",
      hasInsights: false
    };
  }

  // Basic stats
  const totalPitches = pitches.length;
  const strikes = pitches.filter(p => 
    p.result === 'strike' || p.result === 'foul' || p.result === 'in_play'
  ).length;
  const balls = pitches.filter(p => p.result === 'ball').length;
  const strikePercentage = Math.round((strikes / totalPitches) * 100);
  
  // Pitch type breakdown
  const pitchTypes = {};
  pitches.forEach(pitch => {
    pitchTypes[pitch.pitchType] = (pitchTypes[pitch.pitchType] || 0) + 1;
  });
  
  // First pitch tendencies
  const firstPitches = pitches.filter(p => p.count === '0-0');
  const firstPitchTypes = {};
  firstPitches.forEach(pitch => {
    firstPitchTypes[pitch.pitchType] = (firstPitchTypes[pitch.pitchType] || 0) + 1;
  });
  
  // Convert to percentages
  const firstPitchPercentages = {};
  if (firstPitches.length > 0) {
    Object.keys(firstPitchTypes).forEach(type => {
      firstPitchPercentages[type] = Math.round((firstPitchTypes[type] / firstPitches.length) * 100);
    });
  }
  
  // Three ball counts
  const threeBallCounts = pitches.filter(p => {
    const [balls] = p.count.split('-').map(Number);
    return balls === 3;
  });
  
  // What they throw with 3 balls
  const threeBallPitchTypes = {};
  threeBallCounts.forEach(pitch => {
    threeBallPitchTypes[pitch.pitchType] = (threeBallPitchTypes[pitch.pitchType] || 0) + 1;
  });
  
  // VS Left/Right
  const vsLeft = pitches.filter(p => p.batterSide === 'L');
  const vsRight = pitches.filter(p => p.batterSide === 'R');
  
  // Pitch type by batter handedness
  const vsLeftTypes = {};
  vsLeft.forEach(pitch => {
    vsLeftTypes[pitch.pitchType] = (vsLeftTypes[pitch.pitchType] || 0) + 1;
  });
  
  const vsRightTypes = {};
  vsRight.forEach(pitch => {
    vsRightTypes[pitch.pitchType] = (vsRightTypes[pitch.pitchType] || 0) + 1;
  });
  
  // Convert to percentages
  const vsLeftPercentages = {};
  if (vsLeft.length > 0) {
    Object.keys(vsLeftTypes).forEach(type => {
      vsLeftPercentages[type] = Math.round((vsLeftTypes[type] / vsLeft.length) * 100);
    });
  }
  
  const vsRightPercentages = {};
  if (vsRight.length > 0) {
    Object.keys(vsRightTypes).forEach(type => {
      vsRightPercentages[type] = Math.round((vsRightTypes[type] / vsRight.length) * 100);
    });
  }
  
  // Generate predictions
  const predictions = {};
  
  // Predict first pitch - use most common or default to fastball
  if (firstPitches.length >= 3) {
    const mostCommonFirstPitch = Object.entries(firstPitchPercentages)
      .sort((a, b) => b[1] - a[1])[0];
    predictions.firstPitch = {
      type: mostCommonFirstPitch ? mostCommonFirstPitch[0] : 'fastball',
      confidence: mostCommonFirstPitch ? mostCommonFirstPitch[1] : 50
    };
  }
  
  // Predict 3-ball pitch
  if (threeBallCounts.length >= 2) {
    const mostCommonThreeBallPitch = Object.entries(threeBallPitchTypes)
      .sort((a, b) => b[1] - a[1])[0];
    predictions.threeBallPitch = {
      type: mostCommonThreeBallPitch ? mostCommonThreeBallPitch[0] : 'fastball',
      confidence: mostCommonThreeBallPitch 
        ? Math.round((mostCommonThreeBallPitch[1] / threeBallCounts.length) * 100) 
        : 50
    };
  }
  
  // Predict vs lefty/righty
  if (vsLeft.length >= 3) {
    const mostCommonVsLeft = Object.entries(vsLeftPercentages)
      .sort((a, b) => b[1] - a[1])[0];
    predictions.vsLefty = {
      type: mostCommonVsLeft ? mostCommonVsLeft[0] : 'fastball',
      confidence: mostCommonVsLeft ? mostCommonVsLeft[1] : 50
    };
  }
  
  if (vsRight.length >= 3) {
    const mostCommonVsRight = Object.entries(vsRightPercentages)
      .sort((a, b) => b[1] - a[1])[0];
    predictions.vsRighty = {
      type: mostCommonVsRight ? mostCommonVsRight[0] : 'fastball',
      confidence: mostCommonVsRight ? mostCommonVsRight[1] : 50
    };
  }
  
  return {
    hasInsights: true,
    totalPitches,
    strikes,
    balls,
    strikePercentage,
    pitchTypes,
    firstPitchPercentages,
    threeBallCounts: threeBallCounts.length,
    vsLeft: vsLeft.length,
    vsRight: vsRight.length,
    vsLeftPercentages,
    vsRightPercentages,
    predictions,
    dataQuality: totalPitches < 10 ? 'low' : totalPitches < 20 ? 'medium' : 'high'
  };
};

/**
 * Generates count-based tendencies
 * @param {Array} pitches - Array of pitch objects
 * @returns {Object} - Object containing pitch tendencies by count
 */
export const generateCountTendencies = (pitches) => {
  if (!pitches || pitches.length < 10) {
    return null;
  }
  
  const countMatrix = {};
  
  // Build matrix of counts
  for (let balls = 0; balls <= 3; balls++) {
    for (let strikes = 0; strikes <= 2; strikes++) {
      const count = `${balls}-${strikes}`;
      const pitchesInCount = pitches.filter(p => p.count === count);
      
      if (pitchesInCount.length > 0) {
        // Calculate pitch type percentages for this count
        const types = {};
        pitchesInCount.forEach(pitch => {
          types[pitch.pitchType] = (types[pitch.pitchType] || 0) + 1;
        });
        
        const typesPercent = {};
        Object.keys(types).forEach(type => {
          typesPercent[type] = Math.round((types[type] / pitchesInCount.length) * 100);
        });
        
        // Determine primary pitch for this count
        const primaryPitch = Object.entries(types)
          .sort((a, b) => b[1] - a[1])[0];
        
        countMatrix[count] = {
          total: pitchesInCount.length,
          types: typesPercent,
          primaryPitch: primaryPitch ? primaryPitch[0] : 'unknown',
          primaryPitchPercentage: primaryPitch 
            ? Math.round((primaryPitch[1] / pitchesInCount.length) * 100) 
            : 0
        };
      }
    }
  }
  
  // Define count types
  const evenCounts = ['0-0', '1-1', '2-2'];
  const hitterCounts = ['1-0', '2-0', '3-0', '2-1', '3-1'];
  const pitcherCounts = ['0-1', '0-2', '1-2'];
  
  // Analyze by count type
  const aggregateByCountType = (counts) => {
    const relevantPitches = pitches.filter(p => counts.includes(p.count));
    
    if (relevantPitches.length === 0) return null;
    
    const types = {};
    relevantPitches.forEach(pitch => {
      types[pitch.pitchType] = (types[pitch.pitchType] || 0) + 1;
    });
    
    const typesPercent = {};
    Object.keys(types).forEach(type => {
      typesPercent[type] = Math.round((types[type] / relevantPitches.length) * 100);
    });
    
    const primaryPitch = Object.entries(types)
      .sort((a, b) => b[1] - a[1])[0];
    
    return {
      total: relevantPitches.length,
      types: typesPercent,
      primaryPitch: primaryPitch ? primaryPitch[0] : 'unknown',
      primaryPitchPercentage: primaryPitch 
        ? Math.round((primaryPitch[1] / relevantPitches.length) * 100) 
        : 0
    };
  };
  
  return {
    byCount: countMatrix,
    evenCounts: aggregateByCountType(evenCounts),
    hitterCounts: aggregateByCountType(hitterCounts),
    pitcherCounts: aggregateByCountType(pitcherCounts)
  };
};

export default {
  generatePitcherInsights,
  generateCountTendencies
};