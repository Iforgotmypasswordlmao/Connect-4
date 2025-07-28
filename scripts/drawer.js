import { Players } from "../configs.js"

export class GameDrawer
{
    constructor({ SquareSizeInPixel=100, GameCanvas, SelectCanvas, BorderCanvas, BorderWidthInPixel=10})
    {
        this.GameCanvasContext = GameCanvas.getContext('2d')
        this.SquareSize = SquareSizeInPixel
        this.SelectCanvasContext = SelectCanvas.getContext('2d')
        this.GAME_CANVAS_WIDTH = GameCanvas.width
        this.GAME_CANVAS_HEIGHT = GameCanvas.height
        this.BorderCanvasContext = BorderCanvas.getContext('2d')
        this.BorderWidth = BorderWidthInPixel
    }
    
    /**
     * 
     * @param {Array} GameBoardState 
     */
    drawGameBoard(GameBoardState)
    {
        const rowLength = GameBoardState.length
        const columnLength = GameBoardState[0].length
        for (let rows = 0; rows < rowLength; rows++)
        {
            for (let columns = 0; columns < columnLength; columns++)
            {
                const SquareValue = GameBoardState[rows][columns]
                const Player = `Player ${SquareValue}`
                if (SquareValue != 0)
                {
                    const PlayerMarker = new Image()
                    PlayerMarker.onload = () => {
                        this.GameCanvasContext.drawImage(
                            PlayerMarker,
                            columns*this.SquareSize,
                            rows*this.SquareSize
                        )
                    }
                    PlayerMarker.src = Players[Player]['marker']
                }
            }
        }
    }

    resetGameCanvas()
    {
        this.GameCanvasContext.clearRect(0, 0, this.GAME_CANVAS_WIDTH, this.GAME_CANVAS_HEIGHT)
    }

    drawSelection(row, column)
    {
        const SelectMarker = new Image()
        SelectMarker.onload = () => {
            this.SelectCanvasContext.drawImage(
                SelectMarker,
                column*this.SquareSize,
                row*this.SquareSize
            )
        }
        SelectMarker.src = "../assets/Select.png"
    }

    clearSelection()
    {
        this.SelectCanvasContext.clearRect(0, 0, this.GAME_CANVAS_WIDTH, this.GAME_CANVAS_HEIGHT)
    }

    drawBorder(AmountOfRows, AmountOfColumns)
    {
        this.BorderCanvasContext.fillStyle = "#0000FF"
        console.log()
        for (let row = 0; row <= AmountOfRows; row++)
        {
            this.BorderCanvasContext.fillRect(0, row*this.SquareSize - (this.BorderWidth/2), this.GAME_CANVAS_WIDTH, this.BorderWidth)
        }

        for (let column = 0; column <= AmountOfColumns; column++)
        {
            this.BorderCanvasContext.fillRect(column*this.SquareSize - (this.BorderWidth/2), 0, this.BorderWidth, this.GAME_CANVAS_HEIGHT)
        }

    }
}