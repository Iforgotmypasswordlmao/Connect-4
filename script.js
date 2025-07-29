import { ConnectXGame } from "./scripts/game.js"
import { GameDrawer } from "./scripts/drawer.js"
import { GameUI } from "./scripts/ui.js"

const SelectCan = document.getElementById("selectcanvas")
const GameCan = document.getElementById("gamecanvas")
const BorderCan = document.getElementById("bordercanvas")
const PlayerTurnCan = document.getElementById("playerturn")


class GameManager
{
    /**
     * 
     * Square size = [height (Vertical) x Width (Horizontal)]
     */
    constructor({DefaultPlayerSize=2, DefaultSquareSize=[100, 100], DefaultRows=6, DefaultColumns=7, DefaultTargetCount=4})
    {
        this.SquareSize = DefaultSquareSize
        this.GraphicsManager = new GameDrawer({
            SquareSizeInPixel: DefaultSquareSize,
            GameCanvas: GameCan,
            SelectCanvas: SelectCan,
            BorderCanvas: BorderCan,
            BorderWidthInPixel: 5,
        })

        this.CanvasWidth = GameCan.width 
        this.CanvasHeight = GameCan.height

        this.PlayerSize = DefaultPlayerSize
        // between 0 and Playersize -1
        this.CurrentPlayer = 0

        this.GameLogicManager = new ConnectXGame({
            MAX_COLUMNS: DefaultColumns, 
            MAX_ROWS: DefaultRows,
            CONNECT_TARGET: DefaultTargetCount
        })
        this.GameLogicManager.resetGameBoard()

        this.GameUIManager = new GameUI({
            PlayerTurnCanvas: PlayerTurnCan
        })

        this.AmountColumns = DefaultColumns
        this.AmountRows = DefaultRows

        this.MAX_GAME_WIDTH = this.AmountColumns*this.SquareSize[1]
        this.MAX_GAME_HEIGHT = this.AmountRows*this.SquareSize[0]

        this.GraphicsManager.drawBorder(DefaultRows, DefaultColumns)
        this.CurrentSelectedColumn = null

        this.HasSomeoneWon = false
        this.Stalemate = false

        this.GameUIManager.drawPlayerTurn(this.CurrentPlayer + 1)
    }

    calculateSquareSize()
    {
        const SquareWidth = this.CanvasWidth/this.AmountColumns
        const SquareHeight = this.CanvasHeight/this.AmountRows
        this.SquareSize = [SquareHeight, SquareWidth]
    }

    findNearestColumn(xPositionOfMouse, yPositionOfMouse)
    {
        if (xPositionOfMouse >= this.MAX_GAME_WIDTH)
        {
            return
        }

        if (yPositionOfMouse >= this.MAX_GAME_HEIGHT)
        {
            return
        }

        const ColumnWeAreIn = xPositionOfMouse/this.SquareSize[1]
        return Math.floor(ColumnWeAreIn)
    }

    selectColumn(xPositionOfMouse, yPositionOfMouse)
    {
        if (this.HasSomeoneWon || this.Stalemate)
        {
            return
        }

        const NearestColumn = this.findNearestColumn(xPositionOfMouse, yPositionOfMouse)

        if (NearestColumn == this.CurrentSelectedColumn)
        {
            return
        }

        this.CurrentSelectedColumn = NearestColumn

        this.GraphicsManager.clearSelection()
        const AvailablePosition = this.GameLogicManager.findAvailableSquareInColumn(NearestColumn)
        if (AvailablePosition[0] == -1)
        {
            return
        }

        this.GraphicsManager.drawSelection(AvailablePosition[0], AvailablePosition[1])
    }

    makeGameMove(xPositionOfMouse, yPositionOfMouse)
    {
        if (this.HasSomeoneWon || this.Stalemate)
        {
            return
        }

        const NearestColumn = this.findNearestColumn(xPositionOfMouse, yPositionOfMouse)
        const moveMade = this.GameLogicManager.makeMove(NearestColumn, this.CurrentPlayer + 1)
        if (!moveMade)
        {
            // do something
            return
        }

        const CheckForWin = this.GameLogicManager.checkWin()

        if (CheckForWin)
        {   
            this.GameUIManager.handlePlayerWin(this.CurrentPlayer + 1)
            this.HasSomeoneWon = true
            return
        }

        const CheckForStalemate = !this.GameLogicManager.checkForAnyAvailableMoves()
        if (CheckForStalemate)
        {
            this.Stalemate = true
            this.GameUIManager.handleStalemate()
            return
        }

        // this null thingy is so the select column check doesnt trigger
        this.CurrentSelectedColumn = null
        this.selectColumn(xPositionOfMouse)
        this.nextTurn()
        this.GameUIManager.drawPlayerTurn(this.CurrentPlayer + 1)
    }

    drawBoard()
    {
        this.GraphicsManager.drawGameBoard(
            this.GameLogicManager.Board
        )
    }

    nextTurn()
    {
        this.CurrentPlayer += 1
        this.CurrentPlayer = (this.CurrentPlayer % this.PlayerSize)
    }
}


function main()
{
    const test = new GameManager({})

    // BorderCanvas is used as its the top layer
    BorderCan.addEventListener('mousemove', (event) => {
        test.selectColumn(event.offsetX, event.offsetY)
    })

    BorderCan.addEventListener('click', (event) => {
        test.makeGameMove(event.offsetX, event.offsetY)
        test.drawBoard()
    })
}

window.onload = () => {
    main()
}