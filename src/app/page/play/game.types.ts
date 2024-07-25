interface Player {
  name: string
  health: number
  clientId: string
}
export interface Room {
  id: string
  type: 'public' | 'private'
  players: [Player, Player]
}
