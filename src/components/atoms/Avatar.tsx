import React from 'react'
import { IPlayerStatus } from 'types/database'

interface AvatarProps {
    isTern: boolean
    playerStatus: IPlayerStatus
}

const Avatar = React.memo((props: AvatarProps) => (
    <div className="mb-3 mt-2">
        <div className="px-2">
            <div className="relative flex">
                {props.isTern && (
                    <span
                        className={`bg-${props.playerStatus.role} absolute inline-flex h-full w-full animate-[ping_1.5s_linear_infinite] rounded-full opacity-50`}
                    />
                )}
                <img
                    className={`relative inline-flex rounded-full border-4 border-${props.playerStatus.role} bg-white`}
                    src={props.playerStatus.avatar}
                    alt={props.playerStatus.name}
                />
            </div>
        </div>
        <div
            className={`inline-block rounded-full bg-${props.playerStatus.role} px-3`}
        >
            <div className="flex items-center py-0.5">
                <span className="text-xs font-medium tracking-wider text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.2)]">
                    {props.playerStatus.name}
                </span>
            </div>
        </div>
    </div>
))

export default Avatar
