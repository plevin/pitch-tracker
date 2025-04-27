# Baseball Pitch Tracker

A mobile-friendly web application designed to track baseball pitches during games, primarily for youth baseball (8th-grade level). This app allows coaches and players to track pitch patterns and generate insights to gain competitive advantages.

## Features

- **Mobile-First Design**: Optimized for iPhone and other mobile devices for easy use during games
- **Simple Data Entry**: Quick tracking of pitches with minimal input required
- **Pitcher Insights**: Analyze tendencies based on count, batter handedness, and more
- **Game Management**: Track multiple games and pitchers
- **Offline Capability**: Works without an internet connection (data stored locally)
- **Pattern Recognition**: Identify predictable pitcher behaviors

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- [npm](https://www.npmjs.com/) (v6.0.0 or higher)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/pitch-tracker.git
   cd pitch-tracker
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:3000` (or use your phone by connecting to your local IP address)

### Adding to Home Screen (iOS)

For the best experience on iOS, add the app to your home screen:

1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Give the app a name

## Using the App

### Game Setup
1. When you first open the app, you'll be prompted to select an existing game or create a new one
2. To create a new game, enter the opponent's name and tap "Create Game"

### Pitcher Selection
1. After selecting a game, you can choose between tracking an opponent's pitcher or your own team's pitcher
2. Select a previously tracked pitcher or add a new one by entering their name and jersey number
3. Tap "Track This Pitcher" to begin tracking pitches

### Tracking Pitches
1. Use the pitch type buttons (Fastball/Off-Speed) to record each pitch
2. Select the result (Ball, Strike, Foul, In Play)
3. Toggle the batter's handedness (L/R) as needed
4. The count will automatically update based on the pitch result
5. Use the inning controls to track the game situation

### Viewing Insights
1. Tap "View Insights" to see patterns and tendencies for the current pitcher
2. Review statistics on first pitch tendencies, behavior in different counts, and performance against left/right batters
3. The app will generate predictions based on collected data (requires at least 10 pitches for reliability)

## Data Storage

All data is stored locally on your device using IndexedDB. This means:
- The app works offline
- No data is sent to any server
- Your data persists between visits

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the needs of youth baseball coaches and players
- Built with React and modern web technologies