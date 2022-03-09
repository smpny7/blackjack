import { Role, Transportation } from 'types'
import { ICard, IPosition } from 'types/database'

export const getNextRole = (role: Role): Role =>
    ({
        thief: 'player1' as Role,
        player1: 'thief' as Role, // TODO: thief -> player2
        player2: 'player3' as Role,
        player3: 'player4' as Role,
        player4: 'player5' as Role,
        player5: 'thief' as Role,
    }[role])

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
