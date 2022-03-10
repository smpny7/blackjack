module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    {
      pattern: /bg-(thief|player1|player2|player3|player4|player5)/,
    },
    {
      pattern: /text-(thief|player1|player2|player3|player4|player5)/,
    }
  ],
  theme: {
    extend: {
      colors:{
        'thief': '#8C8C8C',
        'player1': '#EF5F5F',
        'player2': '#61B0FF',
        'player3': '#E9A800',
        'player4': '#58CC58',
        'player5': '#D96FFF',
        'history': '#24C316',
      },
      spacing: {
        '13': '3.25rem',
      }
    },
  },
  plugins: [],
}
