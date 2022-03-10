const HistoryButton = () => {
    return (
        <button className="rounded-full border-4 border-history bg-white/70 py-2 pl-5 pr-7 drop-shadow-xl transition duration-150 ease-in-out hover:scale-105">
            <img
                className="inline-block h-9 align-text-top"
                src={`${process.env.PUBLIC_URL}/img/escape.png`}
                alt="経路"
            />
            <span className="white-text-stroke ml-2 align-text-top text-2xl font-bold tracking-widest text-history">
                経路
            </span>
        </button>
    )
}

export default HistoryButton
