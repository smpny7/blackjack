import React from 'react'

interface CounterProps {
    count: number
}

const Counter = React.memo((props: CounterProps) => (
    <div className="mx-auto w-52 rounded-2xl bg-black/50 pt-2 pb-4 text-center">
        <span className="relative left-1 ml-2 align-top text-7xl font-bold text-yellow-300 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)]">
            {props.count}
        </span>
        <span className="text-8xl font-extralight text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)]">
            /
        </span>
        <span className="relative right-3 text-5xl font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)]">
            23
        </span>
    </div>
))

export default Counter
