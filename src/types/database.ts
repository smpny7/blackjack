// ======================================================

import { Role } from 'types'

export interface ICard {
    black: number
    bus: number
    double: number
    taxi: number
    underGround: number
}

export interface ICards {
    thief: ICard
    player1: ICard
    player2: ICard
    player3: ICard
    player4: ICard
    player5: ICard
}

// ======================================================

export interface IHistory {
    card: string
    position: number
}

export interface IHistories {
    [key: string]: IHistory
}

// ======================================================

export interface IPlayerStatus {
    isReady: boolean
    avatar: string
    name: string
    role: Role
}

// ======================================================

export interface IPosition {
    thief: number
    player1: number
    player2: number
    player3: number
    player4: number
    player5: number
}

// ======================================================

export interface ITern {
    action: string
    count: number
}

// ======================================================
