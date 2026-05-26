# UNO AI - Multiplayer Web Card Game

A real-time multiplayer UNO card game built with modern web technologies.

## Tech Stack

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **JavaScript** - Programming language
- **Zustand** - State management
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **TailwindCSS** - Utility-first CSS framework

### Backend

- **Node.js** - Runtime environment
- **Express** - Web server framework
- **Socket.IO** - Real-time bidirectional communication
- **JavaScript** - Programming language

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Project Structure

```
uno-ai/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components (Landing, Home, Lobby, Game)
│   │   ├── services/       # API/service abstractions
│   │   ├── socket/         # Socket.IO service layer
│   │   ├── store/          # Zustand stores (user, lobby, game)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   ├── index.html          # HTML template
│   ├── package.json        # Dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── postcss.config.js   # PostCSS configuration
│
├── server/                 # Express backend application
│   ├── src/
│   │   ├── game/           # Game logic (placeholder)
│   │   ├── rooms/          # Room management (placeholder)
│   │   ├── sockets/        # Socket.IO handlers
│   │   │   ├── index.js    # Socket handler setup
│   │   │   └── handlers/   # Individual socket event handlers
│   │   ├── persistence/    # Database layer (placeholder)
│   │   ├── debug/          # Debug utilities (placeholder)
│   │   ├── utils/          # Utility functions
│   │   │   └── logger.js   # Logging utility
│   │   └── index.js        # Main server file
│   ├── package.json        # Dependencies
│   ├── .env                # Environment variables
│   └── .env.example        # Environment template
│
├── docker/                 # Docker configuration
│   ├── Dockerfile.client   # Client Docker image
│   └── Dockerfile.server   # Server Docker image
│
├── docker-compose.yml      # Docker Compose orchestration
└── README.md               # This file
```

## Features

### Milestone 2 - Identity & Navigation Flow (Completed)

**Authentication & User Management:**

- ✅ Username input with real-time validation
- ✅ Username requirements: 3-20 characters, alphanumeric + underscore only
- ✅ localStorage persistence of username
- ✅ Zustand store synchronization with localStorage
- ✅ Automatic restore on page refresh
- ✅ Logout functionality (clears storage and state)

**Navigation & Routing:**

- ✅ Protected routes with ProtectedRoute component
- ✅ Route guards - redirects unauthenticated users
- ✅ Dynamic routing with room codes
- ✅ "/" → LandingPage (username entry)
- ✅ "/home" → HomePage (main menu)
- ✅ "/lobby/:roomCode" → LobbyPage (placeholder)
- ✅ "/game/:roomCode" → GamePage (placeholder)

**UI Components:**

- ✅ Reusable Button component (5 variants: primary, secondary, danger,
  success + sizes)
- ✅ Reusable Input component with validation error display
- ✅ ProtectedRoute wrapper component
- ✅ UNO-inspired theme with gradient backgrounds
- ✅ Responsive card layout
- ✅ Consistent styling across all pages

### Milestone 1 - Project Setup (Completed)

- ✅ Monorepo structure with client and server
- ✅ React Vite frontend with Tailwind CSS
- ✅ Zustand state management setup
- ✅ React Router configured
- ✅ Express server with Socket.IO
- ✅ CORS configured
- ✅ Health endpoint (`GET /health`)
- ✅ Socket connection with ping/pong test
- ✅ Docker containerization
- ✅ Docker Compose for one-command startup

### Pages

1. **Landing Page** - Username entry with validation
2. **Home Page** - Host Game / Join Game buttons
3. **Lobby Page** - Room info and player list (placeholder)
4. **Game Page** - Main game interface (placeholder)

### Zustand Stores

- **userStore** - Username, connection state, localStorage sync
- **lobbyStore** - Lobby information and player management (placeholder)
- **gameStore** - Game state and cards (placeholder)
- **lobbyStore** - Lobby information and player list
- **gameStore** - Game state and card information

## Local Development

### Prerequisites

- Node.js 18+ (for local development)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

### Setup

#### 1. Clone the repository

```bash
cd uno-ai
```

#### 2. Install Client Dependencies

```bash
cd client
npm install
cd ..
```

#### 3. Install Server Dependencies

```bash
cd server
npm install
cd ..
```

### Running Locally

#### Terminal 1 - Start Backend Server

```bash
cd server
npm run dev
```

Server will run on `http://localhost:3000`

#### Terminal 2 - Start Frontend Development Server

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

### Accessing the Application

1. Open your browser and navigate to `http://localhost:5173`
2. Create a guest account or login
3. Check the console for socket connection status
4. The ping/pong test will run automatically on the Home page

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed on your system

### One-Command Startup

```bash
docker-compose up --build
```

This command will:

1. Build both client and server Docker images
2. Start both services in containers
3. Expose client on `http://localhost:5173`
4. Expose server on `http://localhost:3000`

### Stop Services

```bash
docker-compose down
```

### Remove All Data

```bash
docker-compose down -v
```

### View Logs

```bash
docker-compose logs -f

# Specific service
docker-compose logs -f client
docker-compose logs -f server
```

## API Endpoints

### Health Check

```
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Socket Events

### Client → Server

- `ping` - Test connection (with optional message payload)

### Server → Client

- `pong` - Response to ping

## Environment Variables

### Client (.env.local)

```
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### Server (.env)

```
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Testing

### Test Authentication Flow

1. Start both server and client as described in the setup
2. Open `http://localhost:5173` - should see Landing Page with username input
3. Test validation:
   - Try empty username → "Username is required"
   - Try "ab" → "Username must be at least 3 characters"
   - Try "this_is_a_very_long_username_that_exceeds_twenty" → "Username must be
     at most 20 characters"
   - Try "user@123" → "Username can only contain letters, numbers, and
     underscores"
   - Valid: "john_doe123" → Continue button enabled
4. Enter valid username and click Continue
5. Should redirect to Home Page
6. Verify username is displayed in navigation
7. Close browser tab and reopen `http://localhost:5173` - should still see Home
   Page (localStorage persisted)
8. Click Logout - should redirect to Landing Page
9. Check that localStorage is cleared (refresh should show Landing Page again)

### Test Protected Routes

1. With valid username, directly access `/home` - should load successfully
2. With valid username, directly access `/lobby/ABC123` - should load
   successfully
3. Logout, then try to directly access `/home` - should redirect to `/`
4. Logout, then try to directly access `/lobby/ABC123` - should redirect to `/`

### Test Socket Connection

1. Start the server: `npm run dev` (from server directory)
2. Start the client: `npm run dev` (from client directory)
3. Enter username and navigate to Home page
4. Check browser console for:
   - "Socket connected: [socket-id]"
   - "Received pong: [data]"
5. Connection status should show "Connected ✓"

### Test Health Endpoint

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Components Reference

### Button Component

Located in `client/src/components/Button.jsx`

```jsx
import Button from './components/Button'

<Button 
  onClick={handleClick}
  variant="primary"      // primary, secondary, danger, success
  size="md"              // sm, md, lg
  disabled={false}
  fullWidth={true}
>
  Click Me
</Button>
```

### Input Component

Located in `client/src/components/Input.jsx`

```jsx
import Input from "./components/Input";

<Input
  type="text"
  value={username}
  onChange={handleChange}
  placeholder="Enter username"
  error={validationError}
  maxLength={20}
  autoFocus
/>;
```

### ProtectedRoute Component

Located in `client/src/components/ProtectedRoute.jsx`

Routes that require authentication should be wrapped with ProtectedRoute:

```jsx
<Route
  path="/home"
  element={
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  }
/>;
```

## Validation & Utils

### Username Validation

Located in `client/src/utils/usernameValidation.js`

- `validateUsername(username)` - Validates username against requirements
- `saveUsernameToStorage(username)` - Saves to localStorage
- `getStoredUsername()` - Retrieves from localStorage
- `clearStoredUsername()` - Clears from localStorage

### Navigation Utilities

Located in `client/src/utils/navigation.js`

- `useNavigation()` - Custom hook for programmatic navigation

## Build for Production

### Client

```bash
cd client
npm run build
```

Output will be in `client/dist/`

### Server

Server runs directly from source with `npm start`

## Development Notes

### Adding New Pages

1. Create a new file in `client/src/pages/`
2. Export a default React component
3. For protected pages (requires login), wrap with ProtectedRoute in App.jsx
4. Add route to `client/src/App.jsx`

Example of a protected route:

```jsx
<Route
  path="/mynewpage"
  element={
    <ProtectedRoute>
      <MyNewPage />
    </ProtectedRoute>
  }
/>;
```

### Using Button Component

Always use the reusable Button component instead of native HTML buttons:

```jsx
import Button from '../components/Button'

<Button
  onClick={handleClick}
  variant="primary"      // primary | secondary | danger | success
  size="md"              // sm | md | lg
  fullWidth
  disabled={!isValid}
>
  Click Me
</Button>
```

### Using Input Component

For form inputs with validation errors:

```jsx
import Input from "../components/Input";
import { validateUsername } from "../utils/usernameValidation";

const [username, setUsername] = useState("");
const [error, setError] = useState(null);

const handleChange = (e) => {
  setUsername(e.target.value);
  setError(null); // Clear error on change
};

<Input
  type="text"
  value={username}
  onChange={handleChange}
  placeholder="Enter username"
  error={error}
  maxLength={20}
  autoFocus
/>;
```

### Adding Socket Handlers

1. Create a new file in `server/src/sockets/handlers/`
2. Create a handler function that takes `(socket, io)` parameters
3. Import and call it in `server/src/sockets/index.js`

### Adding Zustand Stores

1. Create a new file in `client/src/store/`
2. Use `create()` from zustand to define the store
3. Export and use with `useYourStore()` hook
4. For stores that need localStorage persistence, follow the userStore pattern

### Adding Validation Rules

To add new validation utilities:

1. Create a new file in `client/src/utils/` (e.g., `emailValidation.js`)
2. Export validation functions that return
   `{ valid: boolean, error: string | null }`
3. Use in components with the Input component

Example structure:

```javascript
export const validateEmail = (email) => {
  if (!email.trim()) return { valid: false, error: "Email is required" };
  if (!isValidEmail(email)) {
    return { valid: false, error: "Invalid email format" };
  }
  return { valid: true, error: null };
};
```

## Troubleshooting

### Socket Connection Issues

- Check that server is running on port 3000
- Verify `VITE_SOCKET_URL` in `.env.local` matches server address
- Check browser console for error messages

### Port Already in Use

```bash
# Kill process on port 3000 (server)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 5173 (client)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Docker Build Fails

```bash
# Clear Docker cache and rebuild
docker-compose build --no-cache
```

### Username Not Persisting

- Check browser's localStorage is enabled
- Check browser console for errors
- Clear localStorage and try again:

```javascript
localStorage.clear();
```

### Cannot Access Protected Routes

- Ensure you've logged in with a username first
- Check that localStorage has the username saved
- Check browser console for redirect messages

## Next Steps

Future development will include:

- UNO game logic and rules
- Player lobby creation and joining
- Real-time game synchronization
- Chat/messaging system
- User authentication and persistence
- Leaderboard system
- AI opponent implementation
- Mobile responsiveness
- Sound effects and animations

## License

MIT License - See LICENSE file for details

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## Support

For issues and questions, please open an GitHub issue.

---

**Last Updated:** January 2024
