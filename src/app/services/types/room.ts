export type GameState =
  | 'WAITING_FOR_PARTNER'
  | 'TURN_PLAYER1'
  | 'TURN_PLAYER2'
  | 'DRAW'
  | 'VICTORY_PLAYER1'
  | 'VICTORY_PLAYER2'
  | 'ABANDONED'
  | 'FINAL_VICTORY_PLAYER1'
  | 'FINAL_VICTORY_PLAYER2'
