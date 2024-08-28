import { GameState, GameStateValues } from '@/app/interfaces/game'
import { RoomService } from '@/app/services/room.service'

export const isReturnButtonVisible = (roomService: RoomService) => {
  const statesReturn: GameStateValues[] = [
    GameState.WAITING_FOR_PARTNER,
    GameState.ABANDONED,
    GameState.FINAL_VICTORY_PLAYER1,
    GameState.FINAL_VICTORY_PLAYER2,
    GameState.VOTING_FOR_NEW_GAME
  ]
  return statesReturn.includes(roomService.stateGame())
}

export const getTextTitle = (roomService: RoomService) => {
  const state = roomService.stateGame()
  const titleMap = new Map<GameStateValues, string>([
    [GameState.VICTORY_PLAYER1, `Ganó ${roomService.player1().name}`],
    [GameState.VICTORY_PLAYER2, `Ganó ${roomService.player2().name}`],
    [GameState.WAITING_FOR_PARTNER, 'BUSCANDO COMPAÑERO'],
    [GameState.FINAL_VICTORY_PLAYER1, `Ganador Final ${roomService.player1().name}`],
    [GameState.FINAL_VICTORY_PLAYER2, `Ganador Final ${roomService.player2().name}`],
    [GameState.ABANDONED, 'El otro jugador ha salido'],
    [GameState.DRAW, 'Los jugadores empataron'],
    [GameState.VOTING_FOR_NEW_GAME, 'Vota para el próximo juego']
  ])
  return titleMap.get(state) || ''
}

export const getButtonTitle = (roomService: RoomService) => {
  const state = roomService.stateGame()
  const validationVictory = [GameState.VICTORY_PLAYER1, GameState.VICTORY_PLAYER2, GameState.DRAW].includes(state)
  const validationFinalVictory = [GameState.FINAL_VICTORY_PLAYER1, GameState.FINAL_VICTORY_PLAYER2].includes(state)
  const validationWaiting = state === GameState.VOTING_FOR_NEW_GAME && roomService.isPlayerVotingForNewGame()
  const validationWaitingNotPlayer = state === GameState.VOTING_FOR_NEW_GAME && !roomService.isPlayerVotingForNewGame()

  if (validationVictory) return 'Próxima Ronda'
  if (validationFinalVictory || validationWaitingNotPlayer) return 'Nueva Partida'
  if (validationWaiting) return 'Esperando...'
  return ''
}
