# ChapterOne

A simple journaling app that generates daily prompts based on insights from non-fiction books.

## Getting Started

This is a minimal app that displays the "ChapterOne" title when opened.

### Prerequisites

- Node.js 
- npm
- Expo Go app on your iOS device or simulator

### Installation

1. Clone this repository
2. Navigate to the project directory:
   ```
   cd HelloWorldApp
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Follow the instructions in the terminal to open the app in Expo Go on your iOS device or simulator

## Project Structure

- `App.js` - Main application component that displays the ChapterOne title
- `assets/` - Static assets like images
- `app.json` - Expo configuration file

## Features

### Book Selection Screen

#### Requirements

- Users should be able to pick whether they get a morning preparation prompt or an evening reflection prompt and at what time they would like to be reminded to journal
- Users should be able to select a book from a gallery of books
- Selecting a book brings up a bottom tray with the following information:
  - Book title
  - Book cover image
  - Author name
  - 3 short concise bullets of the key insights behind the book
  - A confirmation button to select this book
- Confirming selection sets that book as the source for journaling prompts

#### Implementation Plan

1. **Create Components**:
   - `BookSelectionScreen.js`: Main screen component
   - `BookGrid.js`: Gallery view of available books
   - `BookCard.js`: Individual book card in the grid
   - `BookDetailBottomSheet.js`: Bottom sheet with book details and confirmation
   - `PromptScheduleSelector.js`: Component for selecting prompt type and reminder time

2. **Data Structure**:
   - Create a mock data file `bookData.js` with sample books, each containing:
     - ID
     - Title
     - Author
     - Cover image URL
     - Key insights (3 bullet points)
     - Categories/tags

3. **UI Implementation**:
   - Create a grid layout with book covers
   - Implement a custom bottom sheet component
   - Add time picker for reminders
   - Create toggle for morning/evening prompt selection

4. **State Management**:
   - Track selected book
   - Store user preferences for prompt timing and type
   - Persist selections to device storage

5. **Navigation**:
   - Add route to journal prompt screen after book selection

6. **Testing**:
   - Test layout on different device sizes
   - Verify bottom sheet behavior
   - Confirm data persistence works correctly 