export interface Horse {
  id: string
  name: string
  condition: number
  color: string
}

export interface Round {
  number: number
  distance: number
  horses: Horse[]
}

export interface RoundResult {
  number: number
  distance: number
  horses: { position: number; horse: Horse }[]
}
