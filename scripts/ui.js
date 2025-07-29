import { Players } from "../configs.js"

export class GameUI 
{
    constructor({ PlayerTurnCanvas })
    {
        this.PlayerTurnContext = PlayerTurnCanvas.getContext('2d')
        this.CANVAS_WIDTH = PlayerTurnCanvas.width
        this.CANVAS_HEIGHT = PlayerTurnCanvas.height
        this.PlayerTurnContext.font = "30px Arial"
        this.PlayerTurnContext.fillText("Current Turn:", 10, this.CANVAS_HEIGHT/2)
    }

    /**
     * 
     * @param {Number} player 
     */
    drawPlayerTurn(player)
    {
        const PlayerMarker = Players[`Player ${player}`]['marker']
        const MarkerSquareSize = 100 // pixels
        const TurnMarker = new Image(MarkerSquareSize, MarkerSquareSize)
        TurnMarker.onload = () => {
            this.PlayerTurnContext.drawImage(TurnMarker, this.CANVAS_WIDTH-MarkerSquareSize, 0)
        }
        TurnMarker.src = PlayerMarker
    }

    handlePlayerWin(Victor)
    {
        console.log(Victor, "Won")
    }

    handleStalemate()
    {
        console.log("stalemate")
    }

}