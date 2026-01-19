# 🎯 Wordle Breaker

An AI-powered Wordle solver with an interactive Vue.js frontend. Uses information theory and entropy calculation to find optimal guesses and solve Wordle puzzles efficiently.

![Wordle Breaker Screenshot](https://github.com/user-attachments/assets/4d760c12-77fe-45ea-9c74-1fb976a243da)

## Features

- **Intelligent Algorithm**: Uses entropy-based information theory to calculate the most optimal guesses
- **Interactive UI**: Clean, Wordle-like interface built with Vue 3
- **Real-time Filtering**: Dynamically narrows down possible words based on feedback
- **Fast Performance**: Efficiently processes 500+ word combinations
- **Visual Feedback**: Color-coded tiles matching Wordle's interface (Green/Yellow/Gray)

## How It Works

The solver uses an entropy-based approach to maximize information gain with each guess:

1. **Initial Guess**: Starts with optimally-chosen starter words like "SOARE" that maximize letter coverage
2. **Feedback Processing**: Takes your Wordle feedback (correct position, wrong position, not in word)
3. **Word Filtering**: Eliminates impossible words based on the feedback
4. **Entropy Calculation**: Calculates information gain for remaining possible guesses
5. **Optimal Selection**: Suggests the next best word that maximizes expected information

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Lake3205/WorldeBreaker.git
cd WorldeBreaker

# Install dependencies
npm install
```

### Running the App

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173/`

## Usage

1. **Get Suggestion**: Click "Use Suggestion" to see the optimal word to guess
2. **Enter in Wordle**: Use that word in your actual Wordle game
3. **Input Feedback**: Return to Wordle Breaker and enter the word
4. **Set Colors**: Click each letter tile to cycle through:
   - **Gray**: Letter not in word
   - **Yellow**: Letter in word but wrong position  
   - **Green**: Letter in correct position
5. **Submit**: Click "Submit Feedback" to get the next suggestion
6. **Repeat**: Continue until solved!

## Algorithm Details

The solver implements several optimization strategies:

- **Starter Word Pool**: Pre-calculated optimal starting words for maximum coverage
- **Information Theory**: Uses Shannon entropy to measure expected information gain
- **Pattern Matching**: Efficient filtering based on positional and character constraints
- **Smart Sampling**: For large candidate sets, samples strategically to maintain performance

## Project Structure

```
WorldeBreaker/
├── src/
│   ├── components/
│   │   ├── WordleBoard.vue      # Game board display
│   │   └── SolverControls.vue   # Input and controls
│   ├── wordlist.js              # 500+ common 5-letter words
│   ├── solver.js                # Core solving algorithm
│   ├── App.vue                  # Main application
│   └── main.js                  # Vue app initialization
├── public/                      # Static assets
└── index.html                   # Entry HTML
```

## Technologies Used

- **Vue 3**: Progressive JavaScript framework
- **Vite**: Next-generation frontend tooling
- **JavaScript**: Core algorithm implementation
- **CSS3**: Styling and animations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Inspired by the Wordle game by Josh Wardle
- Algorithm based on information theory principles
- Word list curated from common English 5-letter words

