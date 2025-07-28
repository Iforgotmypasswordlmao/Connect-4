import { ConnectXGame } from "./scripts/game.js"
import { GameDrawer } from "./scripts/drawer.js"
import { GameUI } from "./scripts/ui.js"

const SelectCan = document.getElementById("selectcanvas")
const GameCan = document.getElementById("gamecanvas")
const BorderCan = document.getElementById("bordercanvas")


class GameManager
{
    constructor({DefaultPlayerSize=3, DefaultSquareSize=100, DefaultRows=6, DefaultColumns=7, DefaultTargetCount=4})
    {
        this.SquareSize = DefaultSquareSize
        this.GraphicsManager = new GameDrawer({
            GameCanvas: GameCan,
            SelectCanvas: SelectCan,
            BorderCanvas: BorderCan,
            BorderWidthInPixel: 5
        })

        

        this.PlayerSize = DefaultPlayerSize
        // between 0 and Playersize -1
        this.CurrentPlayer = 0

        this.GameLogicManager = new ConnectXGame({
            MAX_COLUMNS: DefaultColumns, 
            MAX_ROWS: DefaultRows,
            CONNECT_TARGET: DefaultTargetCount
        })
        this.GameLogicManager.resetGameBoard()

        this.GameUIManager = new GameUI({})


        this.GraphicsManager.drawBorder(DefaultRows, DefaultColumns)
        this.CurrentSelectedColumn = null

        this.HasSomeoneWon = false
    }

    selectColumn(xPositionOfMouse)
    {

        const XColumn = xPositionOfMouse/this.SquareSize
        const NearestColumn = Math.floor(XColumn)

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

    makeGameMove(xPositionOfMouse)
    {
        if (this.HasSomeoneWon)
        {
            return
        }
        const XColumn = xPositionOfMouse/this.SquareSize
        const NearestColumn = Math.floor(XColumn)
        const moveMade = this.GameLogicManager.makeMove(NearestColumn, this.CurrentPlayer + 1)
        if (!moveMade)
        {
            // do something
            return
        }

        const CheckForWin = this.GameLogicManager.checkWin()

        if (CheckForWin)
        {   
            console.log("victory")
            this.HasSomeoneWon = true
            return
        }

        // this null thingy is so the select column check doesnt trigger
        this.CurrentSelectedColumn = null
        this.selectColumn(xPositionOfMouse)
        this.nextTurn()
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
    test.selectColumn(122)

    // BorderCanvas is used as its the top layer
    BorderCan.addEventListener('mousemove', (event) => {
        test.selectColumn(event.offsetX)
    })

    BorderCan.addEventListener('click', (event) => {
        test.makeGameMove(event.offsetX)
        test.drawBoard()
    })
}

window.onload = () => {
    main()
}