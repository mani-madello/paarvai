# PaarvAI Face Recognition Dashboard (TypeScript, Vite, React, Tailwind)

This upgraded starter includes:
- Fixed 2x2 quadrants (no page scroll) with equal sizes
- Light/Dark theme toggle
- Placeholder PaarvAI logo (white + orange) in header
- Multiple demo video sources (Video.js) with camera selector
- Auto-updating detection list (mock live stream)
- Location pagination (1 of 10); click a detection to update profile & history
- Alerts with color-coded priority (red/orange/green)

## Run
npm install
npm run dev
Open http://localhost:5173

## Notes
- Video sources are remote sample MP4 URLs (internet required)
- Replace `/src/assets/logo.svg` with your real logo file
- Replace mock detections with real WebSocket/GraphQL feeds
