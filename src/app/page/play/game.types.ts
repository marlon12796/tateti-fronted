type Player = string
export interface Room {
  id: string
  type: 'public' | 'private'
  players: [Player, Player]
}
