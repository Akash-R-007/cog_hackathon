// Simple WebSocket server for fraud alerts (ESM version)
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 5050 });

wss.on('connection', (ws, req) => {
  const ip = req.socket?.remoteAddress || 'unknown';
  console.log(`🔔 Client connected for fraud alerts from ${ip}`);
  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

export function broadcastFraudAlert(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

console.log('🚨 Fraud alert WebSocket server running on ws://localhost:5050');

// Log uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
