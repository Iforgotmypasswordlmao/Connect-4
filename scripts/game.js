export class ConnectXGame
{
    constructor({ MAX_ROWS=6, MAX_COLUMNS=7, CONNECT_TARGET=4 })
    {
        /**
         * 0 = Null
         * 1 = Crosses
         * 2 = Knots
         */
        this.Board = []
        this.hasGameEnded = false
        
        this.MAX_ROWS = MAX_ROWS
        this.MAX_COLUMNS = MAX_COLUMNS
        this.CONNECT_TARGET = CONNECT_TARGET
    }

    printBoard()
    {
        for (let rows = 0; rows < this.MAX_ROWS; rows++)
        {
            console.log(this.Board[rows])
        }
    }

    resetGameBoard()
    {
        let dummyRow = []
        for (let columns = 0; columns < this.MAX_COLUMNS; columns++)
        {
            dummyRow.push(0)
        }

        let dummyBoard = []
        for (let rows = 0; rows < this.MAX_ROWS; rows++)
        {
            dummyBoard.push([...dummyRow])
        }

        this.Board = [...dummyBoard]
    }

    findAvailableSquareInColumn(column)
    {
        for (let AvailableRow = this.MAX_ROWS-1; AvailableRow >= 0; AvailableRow--)
        {
            if (this.Board[AvailableRow][column] == 0)
            {
                return [AvailableRow, column]
            }
        }
        return [-1, -1]
    }

    makeMove(column, player)
    {
        const availableSquare = this.findAvailableSquareInColumn(column)
        if (availableSquare[0] != -1)
        {
            this.Board[availableSquare[0]][availableSquare[1]] = player
            return true
        }
        return false 
    }

    CheckSquareForWin(row, column)
    {
        function CheckIfElementsInArrayAreTheSame(arr)
        {
            const FixedElement = arr[0]
            if (FixedElement == -1)
            {
                return false
            }
            return arr.every(element => element === FixedElement) && (FixedElement != 0)
        }

        let DiagonalSquares = []
        let DiagonalToLeftSquares = []
        let HorizontalSquares = []
        let VerticalSquares = []

        for (let targetSquares = 0; targetSquares < this.CONNECT_TARGET; targetSquares++)
        {
            
            const DiagValue = ((row + targetSquares < this.MAX_ROWS) && (column + targetSquares < this.MAX_COLUMNS)) ? this.Board[row + targetSquares][column + targetSquares] : -1
            const HoriValue = (column + targetSquares < this.MAX_COLUMNS) ? this.Board[row][column + targetSquares] : -1
            const VertValue = (row + targetSquares < this.MAX_ROWS) ? this.Board[row + targetSquares][column] : -1
            const DiagLeftValue = ((row - targetSquares > 0) && (column - targetSquares < this.MAX_COLUMNS)) ? this.Board[row - targetSquares][column + targetSquares] : -1
            DiagonalSquares.push(DiagValue)
            HorizontalSquares.push(HoriValue)
            VerticalSquares.push(VertValue)
            DiagonalToLeftSquares.push(DiagLeftValue)
        }

        return (CheckIfElementsInArrayAreTheSame(DiagonalSquares) 
        || CheckIfElementsInArrayAreTheSame(HorizontalSquares) 
        || CheckIfElementsInArrayAreTheSame(VerticalSquares)
        || CheckIfElementsInArrayAreTheSame(DiagonalToLeftSquares))
    }

    //fix this
    checkWin()
    {

        for (let rowsToCheck = 0; rowsToCheck < (this.MAX_ROWS); rowsToCheck++)
        {
            for (let columnsToCheck = 0; columnsToCheck < (this.MAX_COLUMNS); columnsToCheck++)
            {
                const hasSomeoneWon = this.CheckSquareForWin(rowsToCheck, columnsToCheck)
                if (hasSomeoneWon)
                {
                    return true
                }
            }
        }
        return false
    }

    checkForAnyAvailableMoves()
    {
        for (let columns = 0; columns < this.MAX_COLUMNS; columns++)
        {
            let AvailableMovesInAColumn = this.findAvailableSquareInColumn(columns)
            if (AvailableMovesInAColumn[0] != -1)
            {
                return true
            }
        }
        return false
    }
}