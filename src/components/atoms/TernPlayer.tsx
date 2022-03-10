interface TernPlayerProps {
    name: string
    borderColor: string
    textColor: string
    isActive: boolean
}

const TernPlayer = (props: TernPlayerProps) => {
    const animation = 'transition-all duration-300 ease-in-out'
    const normalContainerStyle = `inline-block bg-white/70 h-11 w-48 rounded-l-md text-left drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] ${animation}`
    const activeContainerStyle = `${normalContainerStyle} mb-2 h-13 w-56`
    const containerStyle = props.isActive
        ? activeContainerStyle
        : normalContainerStyle

    const normalBorderStyle = `${props.borderColor} inline-block h-11 w-3 rounded-l-md ${animation}`
    const activeBorderStyle = `${normalBorderStyle} h-13`
    const borderStyle = props.isActive ? activeBorderStyle : normalBorderStyle

    const normalTextStyle = `${props.textColor} inline-block align-top ml-6 mt-2 text-lg font-bold tracking-widest white-text-stroke ${animation}`
    const activeTextStyle = `${normalTextStyle} mt-3 text-2xl`
    const textStyle = props.isActive ? activeTextStyle : normalTextStyle

    return (
        <div className={containerStyle}>
            <div className={borderStyle} />
            <span className={textStyle}>{props.name}</span>
        </div>
    )
}

export default TernPlayer
