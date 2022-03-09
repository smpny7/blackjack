import { Card, Role, Transportation } from 'types'

export const CARD: Record<Card, string> = {
    underGround: '地下鉄',
    bus: 'バス',
    taxi: 'タクシー',
    black: 'ブラック・チケット',
    double: 'ダブル・ムーブ・カード	',
}

export const OPEN_TERN: number[] = [3, 8, 13, 18, 24]

export const ROLES: Record<Role, string> = {
    thief: '怪盗',
    player1: 'プレイヤー1',
    player2: 'プレイヤー2',
    player3: 'プレイヤー3',
    player4: 'プレイヤー4',
    player5: 'プレイヤー5',
}

export const TRANSPORTATION: Record<Transportation, string> = {
    underGround: '地下鉄',
    bus: 'バス',
    taxi: 'タクシー',
    boat: 'ボート',
}
