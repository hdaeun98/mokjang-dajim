# Mokjang Dajim Points (목장 다짐 포인트)

## Features

- **Person Management**: Add people with customizable goals and emoji selection
- **Flexible Frequency Tracking**: Choose specific days of the week or set weekly target counts
- **Visual Progress Tracking**: Weekly calendar view with completion status
- **Streak Counting**: Track consecutive day achievements
- **Announcements Board**: Share important updates with the community
- **Real-time Sync**: Firebase integration for live data updates
- **Responsive Design**: Works beautifully on all devices

## Setup

1. **Firebase Configuration**:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - **Configure Firestore Security Rules**:
     - Go to Firestore Database → Rules tab
     - Replace the default rules with the following for development:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true;
         }
       }
     }
     ```
     - Click "Publish" to apply the rules
     - **Important**: These rules allow public access. For production, implement proper authentication and restrict access accordingly.
   - Get your Firebase configuration from Project Settings
   - Update `src/lib/firebase.ts` with your configuration

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Firebase Collections

The app uses two main Firestore collections:

### `persons` Collection
```typescript
{
  id: string;
  name: string;
  goal: string;
  emoji: string;
  frequencyType: 'specific' | 'count';
  specificDays?: string[]; // ['Monday', 'Tuesday', ...]
  targetCount?: number;
  completions: Record<string, boolean>; // date string -> completed
  createdAt: Date;
  updatedAt: Date;
}
```

### `announcements` Collection
```typescript
{
  id: string;
  title: string;
  content: string;
  author: string;
  isImportant: boolean;
  createdAt: Date;
}
```

## Usage

1. **Add People**: Click "인원 추가" to add new members with their goals
2. **Set Goals**: Choose between specific days or weekly count targets
3. **Track Progress**: Click on calendar days to mark completions
4. **View Statistics**: See completion rates, streaks, and progress
5. **Announcements**: Share important updates with the group

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- Firebase Firestore for data storage
- Lucide React for icons
- date-fns for date utilities
- Vite for development and building

## License

MIT License
