import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import brandRoutes from './routes/brand.route.js';
import assetRoutes from './routes/asset.route.js';
import campaignRoutes from './routes/campaign.route.js';
import audioRoutes from './routes/audio.route.js';
import authRoutes from './routes/auth.route.js';
import { mockImageStore } from './config/cloudinary.js';
import { mockStorageFiles } from './config/supabase.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Marketing Asset Platform API is running' });
});

// In-memory media endpoints when Cloudinary/Supabase storage env vars are absent
app.get('/api/media/image/:id', (req, res) => {
  const item = mockImageStore.get(req.params.id);
  if (!item) return res.status(404).send('Not found');
  res.setHeader('Content-Type', item.mimeType);
  res.send(item.buffer);
});

app.get('/api/media/storage/:key', (req, res) => {
  const key = decodeURIComponent(req.params.key);
  const item = mockStorageFiles.get(key);
  if (!item) return res.status(404).send('Not found');
  res.setHeader('Content-Type', item.contentType);
  res.send(item.buffer);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/campaigns', campaignRoutes);

// Serve built frontend static assets
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

// SPA fallback for client-side routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error({
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    userId: req.user?.id,
    error: err.message,
    stack: err.stack
  });

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: err.details
      }
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    });
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
