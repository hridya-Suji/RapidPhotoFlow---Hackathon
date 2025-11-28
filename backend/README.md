# RapidPhotoFlow Backend

Node.js + Express backend API for RapidPhotoFlow.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rapidphotoflow
NODE_ENV=development
UPLOAD_DIR=./uploads
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

3. Make sure MongoDB and Redis are running locally:
   - MongoDB: `mongodb://localhost:27017`
   - Redis: `localhost:6379` (default)
   
   Or update the connection strings in `.env`

4. Start the server:
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

5. Start the worker (in a separate terminal):
```bash
# Development (with nodemon)
npm run worker:dev

# Production
npm run worker
```

## API Endpoints

### Photos
- `POST /api/photos/upload` - Upload photos (multipart/form-data)
- `GET /api/photos` - Get all photos
- `GET /api/photos/:id` - Get photo by ID
- `DELETE /api/photos/:id` - Delete photo
- `GET /api/photos/queue` - Get processing queue
- `GET /api/photos/:id/status` - Get processing status
- `POST /api/photos/process` - Start processing photos
- `PATCH /api/photos/:id/status` - Update photo status

### Health
- `GET /api/health` - Health check

## File Upload

- Max file size: 10MB
- Allowed types: JPEG, JPG, PNG, WEBP
- Files are stored in `uploads/` directory
- Files are served statically at `/uploads/:filename`

## CORS

CORS is enabled for `http://localhost:5173` (Vite dev server).

## Queue System

The backend uses BullMQ with Redis for job processing:

- **Queue**: `photoQueue`
- **Job Type**: `processPhoto`
- **Auto-triggered**: When photos are uploaded via `POST /photos`

Each uploaded photo automatically gets a job added to the queue for processing.

### Redis Configuration

Default Redis connection:
- Host: `localhost`
- Port: `6379`
- Password: (optional, set in `.env`)

Update `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD` in `.env` if using a different Redis instance.

