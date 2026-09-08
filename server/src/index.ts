import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] DON Streetwear Backend running at http://localhost:${PORT}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
});
