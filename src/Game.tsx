import React from 'react'

interface SquareProps {
  value: number;
  onClick: (sqr:Square) => void;
}

interface SquareState {
  style?: string;
}

interface GameProps {
  
}

interface GameState {
  board: Array<JSX.Element>;
  canTryAgain?: Boolean;
  status: string;
  size: number;
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

/**
 * Represent a cell of the board
 * 
 */
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

class Game extends React.Component<GameProps, GameState> {
  lastClickedNumber: number;
  listSelectedSquares: Square[];

  constructor(props: any) {
    super(props);

    this.lastClickedNumber = -1;
    this.listSelectedSquares = [];
    let b: Array<JSX.Element> = this.initBoard(3);
    this.state = {canTryAgain: false, board: b, status: "Playing...", size: 3};
  }

  /**
   * Create a new board
   * 
   * @returns the new board of type Array<JSX.Element>
   */
  initBoard = (s: number) => {
    let listNumber: number[] = getRandomListInRange(s * s);
    let board: Array<JSX.Element> = [];
    this.lastClickedNumber = -1;
    this.reinitializeSquares();
    for(let i= 0; i < s; i++) {
      let squares: Array<JSX.Element> = [];
      for(let j=0; j < s; j++) {
        let val = listNumber[i * s + j];
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
      this.setState({canTryAgain: true, status: "Tu as perdu !"});
    } 
    else if(this.lastClickedNumber + 2 === this.state.size * this.state.size) {
      this.setState({canTryAgain: true, status: "Tu as gagné !"});
    } 
    else {
      this.lastClickedNumber++;
    }
  }

  
/**
 * Restore squares state
 */
  reinitializeSquares = () => {
    this.listSelectedSquares.forEach(square => {
      square.setState({style: "square"});
    });
    this.listSelectedSquares.length=0;
  }


  tryAgain = () => {
    let b: Array<JSX.Element> = this.initBoard(this.state.size);
    this.setState({canTryAgain: false, board: b});
  }

  handleChange = (event: any) => {
    let s: number = event.target.value;
    let b: Array<JSX.Element> = this.initBoard(s);
    this.setState({size: s, board: b});
  }

  render() {
    return(
      <div className="game-board">
        <label>
          <b>Taille  </b>
          <input type="number" value={this.state.size} onChange={this.handleChange} />
        </label>
        {this.state.canTryAgain && <div>{this.state.status}</div>}
        {this.state.canTryAgain && <button onClick={this.tryAgain}>Rejouer</button>}
        <br/><br/>
        { this.state.board }
      </div>
      
    );
  }
}

export default Game;