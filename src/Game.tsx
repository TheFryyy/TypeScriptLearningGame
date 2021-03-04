import React from 'react'

interface SquareProps {
  value: number;
  onClick: (sqr:Square) => void;
}

interface SquareState {
  style?: string;
}

interface BoardProps {
  size: number;
}

interface BoardState {
  board: Array<JSX.Element>;
  canTryAgain?: Boolean;
  status: string;
}

/**
   * @param max the max value that can be returned
   * 
   * @returns a value between 0 and max
   */
function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * 
 * @param size the number of element you want
 * 
 * @returns an array of size element from 0 to size ordered randomly
 */
function getRandomListInRange(size: number) {
  let start: number[] = [];
  let result: number[] = [];
  
  for(let i = 0; i < size; i++) {
    start[i] = i;
  }
  for(let i = 0; i < size; i++) {
    let r: number = getRandomInt(start.length);
    result[i] = start[r];
    start.splice(r, 1);
  }
  return result;

}

class Square extends React.Component<SquareProps, SquareState> {
  constructor(props: SquareProps) {
    super(props);
    this.state = {style: "square"};
  }
  handleClick = () => {
    this.props.onClick(this);
  }
  render() {
    return(
      <button className={this.state.style}  onClick={this.handleClick}>
        {this.props.value}
      </button>
    );
  }
}

export class Board extends React.Component<BoardProps, BoardState> {
  lastClickedNumber: number;
  listSelectedSquares: Square[];

  constructor(props: any) {
    super(props);

    this.lastClickedNumber = -1;
    this.listSelectedSquares = [];
    let b: Array<JSX.Element> = this.initBoard();
    this.state = {canTryAgain: false, board: b, status: "Playing..."};
  }

  /**
   * Create a new board
   * 
   * @returns the new board of type Array<JSX.Element>
   */
  initBoard = () => {
    let listNumber: number[] = getRandomListInRange(this.props.size*this.props.size);
    let board: Array<JSX.Element> = [];
    this.lastClickedNumber = -1;
    for(let i= 0; i <this.props.size; i++) {
      let squares: Array<JSX.Element> = [];
      for(let j=0; j < this.props.size; j++) {
        let val = listNumber[i * this.props.size + j];
        let square: JSX.Element = <Square key={val} value={val} onClick={(sqr:Square) => this.handleClick(sqr)}/>;
        squares.push(square);
      }
      board.push(<div key={i} className="board-row">{squares}</div>);
    }
    return board;
  }

  /**
   * Find out if the player win or loose after the last action.
   * 
   * @param sqr Reference to the selected square
   */
  handleClick = (sqr: Square) => {
    if(this.state.canTryAgain)
      return;
    
    sqr.setState({style: "selectedSquare"});
    this.listSelectedSquares.push(sqr);
    if(this.lastClickedNumber + 1 !== sqr.props.value) {
      this.reinitializeBoard();
      this.setState({canTryAgain: true, status: "You lost !"});
    } else if(this.lastClickedNumber + 2 === this.props.size * this.props.size) {
      this.reinitializeBoard();
      this.setState({canTryAgain: true, status: "You Won !"});
    } else {
      this.lastClickedNumber++;
    }
  }

  
/**
 * Restore squares state
 */
  reinitializeBoard = () => {
    this.listSelectedSquares.forEach(square => {
      square.setState({style: "square"});
    });
    this.listSelectedSquares.length=0;
  }

  /**
   * Create a new board
   */
  tryAgain = () => {
    let b: Array<JSX.Element> = this.initBoard();
    this.setState({canTryAgain: false, board: b});
  }

  render() {
    return(
      <div className="game-board">
        { this.state.board }
        {this.state.canTryAgain && <div>{this.state.status}</div>}
        {this.state.canTryAgain && <button onClick={this.tryAgain}>Play Again</button>}
      </div>
      
    );
  }
}
