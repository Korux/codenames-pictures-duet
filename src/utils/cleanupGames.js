import { ref, get, remove } from 'firebase/database';
import { database } from '../config/firebase';

// This function can be called periodically to clean up abandoned games
export const cleanupAbandonedGames = async () => {
  try {
    const gamesRef = ref(database, 'games');
    const snapshot = await get(gamesRef);
    const games = snapshot.val();
    
    if (!games) return;
    
    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds
    
    for (const [gameId, gameData] of Object.entries(games)) {
      // Check if game has no connected players
      const connectedPlayers = Object.values(gameData.players || {}).filter(p => p.connected);
      
      if (connectedPlayers.length === 0) {
        // Check how long ago the game was created or last active
        const gameAge = now - (gameData.lastActivity || gameData.createdAt || 0);
        
        if (gameAge > ONE_HOUR) {
          console.log(`Cleaning up abandoned game: ${gameId}`);
          await remove(ref(database, `games/${gameId}`));
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up games:', error);
  }
};