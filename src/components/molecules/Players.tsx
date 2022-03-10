import { Role } from 'types'
import { IPlayerStatus } from 'types/database'

interface PlayersProps {
    action: Role
    playerStatuses: [string, IPlayerStatus][]
    titleSrc: string
    titleAlt: string
}

const Players = (props: PlayersProps) => (
    <div className="relative">
        <img
            className="relative z-10 inline-block h-8 drop-shadow-lg"
            src={props.titleSrc}
            alt={props.titleAlt}
        />
        <div className="relative -top-4 z-0 grid grid-cols-2 rounded-2xl bg-white/80 px-3 py-8 drop-shadow-xl">
            {props.playerStatuses.map(([index, playerStatus]) => (
                <div className="mb-3 mt-2" key={index}>
                    <div className="px-2">
                        <div className="relative flex">
                            {props.action === playerStatus.role && (
                                <span
                                    className={`bg-${playerStatus.role} absolute inline-flex h-full w-full animate-ping rounded-full opacity-75`}
                                />
                            )}
                            <img
                                className={`relative inline-flex rounded-full border-4 border-${playerStatus.role} bg-white`}
                                src={playerStatus.avatar}
                                alt={playerStatus.name}
                            />
                        </div>
                    </div>
                    <div
                        className={`inline-block rounded-full bg-${playerStatus.role} px-3`}
                    >
                        <div className="flex items-center py-0.5">
                            <span className="text-xs font-medium tracking-wider text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.2)]">
                                {playerStatus.name}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)

export default Players
