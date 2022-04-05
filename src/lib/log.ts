const style = (color: string) =>
    `background-color:${color}; border-radius:4px; color:white; padding:2px 4px`

export const errorLog = (title: any, message: any) => {
    console.log('%cERROR', style('red'), `${title}\n`, message)
}

export const fetchLog = (message: any) => {
    console.log(
        '%cFETCH',
        style('purple'),
        'Fetch the following data from a Realtime Database.\n',
        message,
    )
}

export const logoutLog = () => {
    console.log('%cLOGOUT', style('orange'), 'Logout completed.')
}

export const loginLog = (message: any) => {
    console.log('%cLOGIN', style('orange'), 'Login completed.\n', message)
}
