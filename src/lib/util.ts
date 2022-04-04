import { Role, Transportation } from 'types'
import { ICard, IPosition, ITern } from 'types/database'

export const isTern = (role: Role, tern: ITern): boolean => {
    switch (role) {
        case 'thief':
            return tern.action === 'thief'
        case 'player1':
            return tern.action === 'player' && !tern.hasMoved.player1
        case 'player2':
            return tern.action === 'player' && !tern.hasMoved.player2
        case 'player3':
            return tern.action === 'player' && !tern.hasMoved.player3
        case 'player4':
            return tern.action === 'player' && !tern.hasMoved.player4
        case 'player5':
            return tern.action === 'player' && !tern.hasMoved.player5
    }
}

export const isPlayerCard = (cardKey: keyof ICard) => {
    switch (cardKey) {
        case 'underGround': {
            return true
        }
        case 'bus': {
            return true
        }
        case 'taxi': {
            return true
        }
        case 'black': {
            return false
        }
        case 'double': {
            return false
        }
    }
}

export const getCardKeyFromTransportation = (
    transportationKey: Transportation,
): keyof ICard => {
    switch (transportationKey) {
        case 'underGround': {
            return 'underGround'
        }
        case 'bus': {
            return 'bus'
        }
        case 'taxi': {
            return 'taxi'
        }
        case 'boat': {
            return 'black'
        }
    }
}

export const judgeIsGameOver = (p: IPosition) =>
    p.thief !== undefined &&
    (p.thief === p.player1 ||
        p.thief === p.player2 ||
        p.thief === p.player3 ||
        p.thief === p.player4 ||
        p.thief === p.player5)
