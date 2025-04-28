# Baseball Pitch Tracker

A mobile-friendly web application designed to track baseball pitches during games, primarily for youth baseball (8th-grade level). This app allows coaches and players to track pitch patterns and generate insights to gain competitive advantages.

## Features

- **Mobile-First Design**: Optimized for iPhone and other mobile devices for easy use during games
- **Simple Data Entry**: Quick tracking of pitches with minimal input required
- **Pitcher Insights**: Analyze tendencies based on count, batter handedness, and more
- **Game Management**: Track multiple games and pitchers
- **Data Persistence**: Save your tracking data locally using browser storage
- **Offline Capability**: Works without an internet connection
- **Data Import/Export**: Backup and restore your data

## Implementation Details

All six of our proposed implementation steps have been completed:

1. **Inning Tracking**: Added functionality to track and navigate through innings
2. **Game Management**: Create and select games with date, opponent, and location info
3. **Pitcher Management**: Create profiles for pitchers from both teams
4. **More Pitch Results**: Expanded pitch result options (balls, strikes, fouls, hits, etc.)
5. **Data Persistence**: All data saved locally with import/export capabilities
6. **Insights Generation**: Analyze pitching patterns and tendencies with statistical breakdowns

## Project Structure

The project follows a standard React application structure:

```
src/
├── components/      # UI components
├── models/          # Data models
├── services/        # Business logic and data services
├── styles/          # CSS styles
├── App.jsx          # Main application component
└── index.js         # Entry point
```

## How to Use

1. **Game Setup**: Create a new game or select an existing one
2. **Pitcher Selection**: Choose a pitcher to track (opponent or your team)
3. **Track Pitches**: Select pitch type, result, and track counts through innings
4. **View Insights**: See patterns and tendencies based on collected data
5. **Export Data**: Back up your data through the Settings screen

## Next Steps

Potential improvements for future versions:

- Enhanced visualizations (strike zone heat maps)
- Cloud synchronization for team sharing
- Advanced statistics and metrics
- Multiple season support
- Pitcher comparison tools

## License

This project is open source and available under the MIT License.