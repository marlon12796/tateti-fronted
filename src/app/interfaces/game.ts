export interface Player {
  name: string
  health: number
}
export interface Room {
  id: string
  type: 'public' | 'private'
  players: [Player, Player]
  state: GameState
  board: (PlayerTurn | '')[]
  votes: PlayerTurn[]
  playerTurn: PlayerTurn
}
export enum PlayerTurn {
  PLAYER_1 = 0,
  PLAYER_2 = 1
}
export const enum GameState {
  WAITING_FOR_PARTNER = 'ESPERANDO_COMPAÑERO',
  TURN_PLAYER1 = 'TURNO_JUGADOR1',
  TURN_PLAYER2 = 'TURNO_JUGADOR2',
  DRAW = 'EMPATE',
  VICTORY_PLAYER1 = 'VICTORIA_JUGADOR1',
  VICTORY_PLAYER2 = 'VICTORIA_JUGADOR2',
  ABANDONED = 'ABANDONADO',
  FINAL_VICTORY_PLAYER1 = 'VICTORIA_FINAL_JUGADOR1',
  FINAL_VICTORY_PLAYER2 = 'VICTORIA_FINAL_JUGADOR2',
  VOTING_FOR_NEW_GAME = 'VOTANDO_POR_NUEVA_PARTIDA'
}
export type GameStateValues = `${GameState}`

export type BOARD_POSITION = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
