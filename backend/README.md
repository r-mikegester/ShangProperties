# ShangProperties Backend

This is the backend API for the ShangProperties real estate platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:

```env
# Firebase Service Account (required for production)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}

# Alternative Firebase Project ID (if not using service account)
FIREBASE_PROJECT_ID=your-project-id

# Port (optional, defaults to 5000)
PORT=5000
```

3. Start the development server:
```bash
npm run dev
```

## Environment Variables

### FIREBASE_SERVICE_ACCOUNT_KEY
This is the complete service account key JSON provided by Firebase. It's required for production environments.

To obtain this key:
1. Go to the Firebase Console
2. Navigate to Project Settings > Service Accounts
3. Click "Generate new private key"
4. Download the JSON file
5. Set the contents as the value of FIREBASE_SERVICE_ACCOUNT_KEY

### FIREBASE_PROJECT_ID
Alternative way to specify the Firebase project ID. Used when FIREBASE_SERVICE_ACCOUNT_KEY is not provided.

### PORT
The port on which the backend server will run. Defaults to 5000.

## API Endpoints

- POST `/api/inquiry` - Submit a new inquiry
- GET `/api/inquiry` - Get all inquiries
- PUT `/api/inquiry/:id` - Update an inquiry
- DELETE `/api/inquiry/:id` - Delete an inquiry

## Development

Run the development server with hot reloading:
```bash
npm run dev
```

Run the production server:
```bash
npm start
```