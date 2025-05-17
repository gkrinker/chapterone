# ChapterOne

A mobile application for journaling inspired by books. ChapterOne helps users maintain a regular journaling practice with prompts and insights based on their selected books.

## Features

- Book selection for journaling inspiration
- Customizable journaling schedule with daily notifications:
  - Tap "Select Time" to open a centered time picker modal.
  - Confirm the time using the "Submit" button in the modal.
  - After submission, a confirmation message displays the chosen time.
  - A daily notification is scheduled at the selected time with the title "You have a new journaling prompt!" and body "Take a moment today to invest in your growth."
- User growth tracking
- Beautiful, intuitive interface

## Technology Stack

- React Native
- Expo

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/gkrinker/chapterone.git
   cd chapterone/HelloWorldApp
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

## Project Structure

- `HelloWorldApp/` - Main application directory
  - `src/` - Source code
    - `components/` - Reusable UI components
    - `screens/` - Application screens
    - `context/` - React Context providers
    - `data/` - Mock data and data models 