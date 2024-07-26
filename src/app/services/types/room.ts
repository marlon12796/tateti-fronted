export const enum GameState {
  WAITING_FOR_PARTNER = 'ESPERANDO_COMPAÑERO',
  TURN_PLAYER1 = 'TURNO_JUGADOR1',
  TURN_PLAYER2 = 'TURNO_JUGADOR2',
  DRAW = 'EMPATE',
  VICTORY_PLAYER1 = 'VICTORIA_JUGADOR1',
  VICTORY_PLAYER2 = 'VICTORIA_JUGADOR2',
  ABANDONED = 'ABANDONADO',
  FINAL_VICTORY_PLAYER1 = 'VICTORIA_FINAL_JUGADOR1',
  FINAL_VICTORY_PLAYER2 = 'VICTORIA_FINAL_JUGADOR2'
}