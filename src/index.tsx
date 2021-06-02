import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios, { AxiosError } from "axios"

const environment = {
  backendUrl: process.env.BACKEND_URL || "http://127.0.0.1:3000/"
}

interface MyState {
  squares: string[],
  xTurn: boolean,
  winner: boolean,
  currentPlayer: string,
  playerName: string,
  turnNumber: number,
  board: number,
  id: number,
  u: any,
  selectedSquare: boolean[],
  flag: boolean,
}

interface Contenido {
  squares: string[],
  xTurn: boolean,
  winner: boolean,
  turnNumber: number,
}

interface Inicializacion {
  id: number,
  nombre: string,
  board: number,
  squares: string[],
}

function Square(props:any) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Retorno(props:any) {
  return (
    <button className="retorno" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function SquareSelected(props:any) {
  return (
    <button className="squareSelected" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

async function sendBoard (params: {
  id: number,
  board:number, 
  u:number,   
  y:number
}): Promise<Contenido> {
  return (
    await axios.post(environment.backendUrl + "/boards/game", params)).data as Contenido
}

async function armado (params: {
}): Promise<Inicializacion>{
  return (
    await axios.post(environment.backendUrl + "boards/player_start", params)).data as Inicializacion
}

async function tictac (params: {
  board: number,
}): Promise<Contenido>{
  return(
    await axios.post(environment.backendUrl + "boards/time_passes", params)).data as Contenido
}

async function abandono (params: {
  id: number,
  board: number,
}): Promise<Contenido> {
  return(
    await axios.delete(environment.backendUrl + "boards/leave", { data: params})).data
}

async function fin (params: {
  id: number,
  board: number,
}): Promise<Contenido> {
  return(
    await axios.delete(environment.backendUrl + "boards/leave", { data: params})).data
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class Board extends React.Component<{}, MyState> {
  constructor (props: any){
    super(props);
    this.state = {
    winner: false,
    playerName: " ",
    currentPlayer: " ",
    xTurn: true,
    squares: [] = [" ", " ", " ", " ", " ", " ", " ", " ", " "],
    turnNumber: 1,
    board: 0,
    id: 0,
    u: null,
    selectedSquare: [] = [false, false, false, false, false, false, false, false, false],
    flag: true
    }
    this.timePasses=this.timePasses.bind(this);
    this.inicio=this.inicio.bind(this);
  }

  componentDidMount(){
    this.inicio()
  }

  waitAMoment = async () => {
    await delay(5000);
    this.useEffect()
  };

  timePasses(){
    let board:number = this.state.board
    if (board != 0){
      tictac({board}).then(val => this.actualizacion(val))
    }
  }

  useEffect() {   
    if (this.state.winner == false){
    const t = setInterval(this.timePasses, 2000);

    return () => clearInterval(t);
    }
  }


  asignacion(payload:Inicializacion){
    console.log("inicializando")
    this.setState({id: payload.id,playerName: payload.nombre, board: payload.board, squares: payload.squares})
    this.waitAMoment()
    
  }
  

  inicio() {
    if (this.state.flag == true){
      this.setState({flag: false})
      armado({}).then(val => this.asignacion(val))
    }
  }
  
  renderSquare(i: number) {
    if (this.state.selectedSquare[i] == true){
      return (
        <SquareSelected
          value={this.state.squares[i]}
          onClick={() => this.handleClick(i)} />
      );}
    else{
      return (
        <Square
          value={this.state.squares[i]}
          onClick={() => this.handleClick(i)} />
      );}
  }

  actualizacion(payload: Contenido) {
    console.log(this.state.board)
    this.setState({squares: payload.squares, xTurn: payload.xTurn, winner: payload.winner, turnNumber: payload.turnNumber})
  }

  handleClick(i: number) {
    if ((this.state.playerName == "X" && this.state.xTurn == true) || (this.state.playerName == "O" && this.state.xTurn == false)){
      if (this.state.turnNumber < 7) {
        if (this.state.squares[i] == " ") {
          console.log(this.state.turnNumber)
          let u: number = 0
          let y: number = i
          let id: number = this.state.id
          let board: number = this.state.board
          sendBoard({id, board, u, y}).then(val => this.actualizacion(val))
        }
      }else {
        let colores: boolean[] = [false, false, false, false, false, false, false, false, false]
        if (this.state.u == null){
          if (this.state.squares[i] == this.state.playerName){    
            colores[i] = true
            this.setState({u: i, selectedSquare: colores})
          }
        }
        else if (this.state.u == i) {
          if (this.state.squares[i] == this.state.playerName){            
            this.setState({u: null, selectedSquare: colores})
          }
        }
        else {
          let u: number = this.state.u          
          let id: number = this.state.id
          let board: number = this.state.board
          switch (u){
            case 0: if ((i == 1) || (i == 3)) {
              let y: number = i
              sendBoard({id, board, u, y}).then(val => this.actualizacion(val))          
              this.setState({u: null, selectedSquare: colores})}
              break;
            
            case 1: if ((i == 0) || (i == 2) || (i == 4)) {
              let y: number = i
              sendBoard({id, board, u, y}).then(val => this.actualizacion(val))          
              this.setState({u: null, selectedSquare: colores})}
              break;
            
            case 2: if ((i == 1) || (i == 5)) {
              let y: number = i
              sendBoard({id, board, u, y}).then(val => this.actualizacion(val))          
              this.setState({u: null, selectedSquare: colores})}
              break;
            
            case 3: if ((i == 0) || (i == 4) || (i == 6)) {
              let y: number = i
              sendBoard({id, board, u, y}).then(val => this.actualizacion(val))          
              this.setState({u: null, selectedSquare: colores})}
              break;
            
            case 4: if ((i == 1) || (i == 3) || (i == 5) || (i == 7)) {
              let y: number = i
              sendBoard({id, board, u, y}).then(val => this.actualizacion(val))          
              this.setState({u: null, selectedSquare: colores})}
              break;
            
            case 5: if ((i == 2) || (i == 4) || (i == 8)) {
              let y: number = i
              sendBoard({id, board, u, y}).then(val => this.actualizacion(val))          
              this.setState({u: null, selectedSquare: colores})}
              break;
            
            case 6: if ((i == 3) || (i == 7)) {
              let y: number = i
              sendBoard({id, board, u, y}).then(val => this.actualizacion(val))          
              this.setState({u: null, selectedSquare: colores})}
              break;
            case 7: if ((i == 4) || (i == 6) || (i == 8)) {
              let y: number = i
              sendBoard({id, board, u, y}).then(val => this.actualizacion(val))          
              this.setState({u: null, selectedSquare: colores})}
              break;
            case 8: if ((i == 5) || (i == 7)) {
              let y: number = i
              sendBoard({id, board, u, y}).then(val => this.actualizacion(val))          
              this.setState({u: null, selectedSquare: colores})}
              break;
          }
          
        }
      }
    }
  }

  handleRetorno(texto:string){
    if ((texto = 'Jugar otra vez') || (texto = 'Abandonar')) {
      let id: number = this.state.id
      let board: number = this.state.board
      abandono({id, board})
      window.location.reload(false);
    }
    else if (texto = 'Volver a jugar') {
      let id: number = this.state.id
      let board: number = this.state.board
      fin({id, board})
      window.location.reload(false);
    }
  }

  renderRetorno(texto: string) {
    return (
      <Retorno
        value={texto}
        onClick={() => this.handleRetorno(texto)}/>
    );
  }

  render() {
    let textColor: string;
    let status: string;
    let mensaje: string;
    if (this.state.winner == false){
      textColor = "#343434"
      mensaje = 'Abandonar'
      if ((this.state.xTurn == true && this.state.playerName == "X") || (this.state.xTurn == false && this.state.playerName == "O")){
        status = `Es tu turno`
      }
      else if (this.state.xTurn == true){
        status = 'Es el turno de X'
      }
      else {
        status = 'Es el turno de O'
      }
    }
    else {
      textColor = "#6BA3FF"      
      if ((this.state.xTurn == false && this.state.playerName == "X") || (this.state.xTurn == true && this.state.playerName == "O")){
        status = '¡Ganaste!'
        mensaje = 'Volver a jugar'
      }
      else if (this.state.xTurn == false){
        status = `¡El jugador X ganó!`
        mensaje = 'Jugar otra vez'
      }
      else {
        status = '¡El jugador O ganó'
        mensaje = 'Jugar otra vez'
      }
    }
 
    return(
      <div>
        <div className="status" style = {{color: textColor}}>{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
       </div>
       <div>{this.renderRetorno(mensaje)}</div>
      </div>)}
  
  
}

interface MyGame {
    estado: number;
}

function Botoncillo(props:any) {
  return (
    <button className="botoncillo" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Game extends React.Component <{}, MyGame>{
  constructor (props: any){
    super(props);
    this.state = {
      estado: 1,
    }
  }
  
  changeEstado(){
    this.setState({estado: 1})
  }

  renderCambio() {
    return (
      <Botoncillo 
        value={"Jugar"}
        onClick={() => this.handleCambio()}/>
    );
  }

  handleCambio(){
    if (this.state.estado == 1){
      this.setState({estado: 2})
    }
    else {
      this.setState({estado:1})
    }
  }

  render() {
    if (this.state.estado == 1){
      return (
        <div className="welcome">     
          <div className="banner">
            <div className="titulo">{"Ta-te-tí"}</div>
          </div>
            {this.renderCambio()}
        </div>
      );
    }
    else{
      return (
        <div className="game">
          <div className="game-board">
            <Board/>
          </div>
        </div>
      );
    }    
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);

export default Game;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
