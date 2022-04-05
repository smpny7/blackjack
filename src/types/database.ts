import { Card, Position, Role } from 'types'

// ======================================================

export type ICard = {
    [key in Card]: number
}

export type ICards = {
    [key in Role]: ICard
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

export interface IRoom {
    name: string
    playerCount: number
    isFinished: boolean
}

export interface IRooms {
    [key: string]: IRoom
}

// ======================================================

export interface IPlayerStatus {
    isReady: boolean
    avatar: string
    name: string
    role: Role
}

export interface IPlayerStatuses {
    [key: string]: IPlayerStatus
}

// ======================================================

export type IPosition = {
    [key in Role]: number
}

// ======================================================

export type IHasMoved = {
    [key in Role]: boolean
}

export interface ITern {
    action: Position
    count: number
    hasMoved: IHasMoved
}

// ======================================================
