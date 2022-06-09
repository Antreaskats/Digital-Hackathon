/* eslint-disable prettier/prettier */
import { makeSprite, t } from "@replay/core";
import { Player } from "./player";
import { PlayerLife } from "./playerLife";
import { Enemy, enemyHeight, enemyWidth} from "./enemy";
import { EnergyWave, energyHeight, energyWidth } from "./energyWave";

let enemiesCount = 0;
let isMusicPlaying = false;
const audioArray = ["dbz-1.mp3", "naruto-kokuten.mp3"];
let audioPlayingCounter=0;
let isWaveActive = false;
let wavesCount = 0;

export const options = {
  dimensions: "scale-up",
};

export const gameProps = {
  id: "Game",
  size: {
    landscape: {
      width: 850,
      height: 400,
      maxWidthMargin: 150,
    },
    portrait: {
      width: 400,
      height: 600,
      maxHeightMargin: 150,
    },
  },
  defaultFont: {
    family: "Courier",
    size: 10,
  },
};

const initialState = {
  enemies: [],
  energyWaves: [],
  // kamehameha: {
  //   id: "Kamehameha",
  //   x: -200,
  //   y: 0,
  // },
  player1: {
    id: "Player1",
    x: -250,
    y: 0,
    score: 0
  },
  isGameOver: false
};


export const Game = makeSprite({
  init({ updateState, preloadFiles }) {
    preloadFiles({
      audioFileNames: ["boop.wav", "dbz-1.mp3"],
      imageFileNames: ["goku.png", "playerLife.png", "Namek.png", "icon.png", "kamehameha.png   "],
    }).then(() => {
      updateState((state) => ({ ...state, loaded: true }));
    });
    return initialState;
  },
  //This is the loop in which the game is played. It refreshes at 60 frames per second
  loop({ state, device, getInputs }) {
    if (!state.loaded) return state;
    if(device.audio(audioArray[audioPlayingCounter]).getStatus()!=="playing"){
      device.audio(audioArray[audioPlayingCounter]).play();
    }//else if(device.audio(audioArray[audioPlayingCounter]).getPosition() === device.audio(audioArray[audioPlayingCounter]).getDuration()){
    //   if(audioPlayingCounter < audioArray.length){
    //     audioPlayingCounter++;
    //   }
    
    let i= 0;
    let enemy,energyWave;
    const inputs = getInputs(); //This reads the inputs of the keyboard and the mouse
    let { player1, enemies, energyWaves } = state; //These are the states used to update the position of your player objects (You can see how it's used at the render() function)
    //inputs.keysDown[] is taking a String to identify the key pressed and recognizes that they key is pressed until it's released

    enemy = spawnEnemy(enemies);
    if (enemy != undefined)
      enemies = [...enemies, enemy];
    if(enemies.length > 0){
      for(i = 0; i < enemies.length; i++){
        if(i == 0){
        enemies[0].x += -1;
        }
        if(i > 0 && enemies[i-1].x < 250 ){
          enemies[i].x += -1;
        }
      }
    }
    
    enemies = [...enemies.filter(
      (enemy) => enemy.targetHit === false
      )
      .filter(
        (enemy) => enemy.x > -210
      ),
    ];
    if (inputs.keysJustPressed[" "]){
      device.audio("boop.wav").play();
      energyWave = createEnergyWave(player1,energyWaves);
    }
    if(energyWave != undefined){
      energyWaves = [...energyWaves,energyWave];
    }
    if(energyWaves.length>0){
      energyWaves[0].x += 5;
    }
    didWaveHitTarget(energyWaves,enemies);

    if(energyWaves.length > 0){
      energyWaves = [...energyWaves.filter(
        (energy) => energy.targetHit === false
        )
        .filter(
          (energy) => energy.x < 400
        ),
      ];
    }

    if (inputs.keysDown["ArrowUp"]) {
      if (player1.y <= 150) {
        player1.y += 5;
      }
    }
    if (inputs.keysDown["ArrowDown"]) {
      if (player1.y >= -150) {
        player1.y -= 5;
      }
    }

    return { 
      ...state,
      loaded: true,
      player1,
      energyWaves,
      enemies
    };
  },
  render({ device, state }) {
    if (!state.loaded) {
      return [
        t.text({
          text: "Loading...",
          color: "black",
        }),
      ];
    }
    return [
      t.image({
        fileName: "Namek.png",
        width: device.size.width,
        height: device.size.height,
      }),
      Player({
        id: state.player1.id,
        x: state.player1.x,
        y: state.player1.y,
      }),
      PlayerLife({
        id: "life1",
        x: -350,
        y: +50,
      }),
      PlayerLife({
        id: "life2",
        x: -350,
        y: 0,
      }),
      PlayerLife({
        id: "life3",
        x: -350,
        y: -50,
      }),
      PlayerLife({
        id: "life4",
        x: -350,
        y: -100,
      }),
      ...state.enemies.map(({ x, y, id }) =>
        Enemy({ x, y, id: "enemy" + id })
      ),
      ...state.energyWaves.map(({ x, y, id}) =>
        EnergyWave({x, y, id: "kamehameha" + id})
      ),
      t.rectangle({
        height: device.size.height,
        x: -210,
        width: 5,
        color: "black",
      }),
      // EnergyWave({
      //   id: state.kamehameha.id,
      //   x: state.kamehameha.x,
      //   y: state.kamehameha.y,
      // }),
    ];
  },
});

//This function is not used. I am experimenting to create objects dynamically (See replay-bird example from tutorial)
function newPlayer(device){
  const max = 150;
  const min = -150;
  const width = device.width - 50;
  const height = Math.random() * (max - min) + min;

  return{
    x: width,
    y: height,
  };
}

function didWaveHitTarget(energyWaves, enemies){
  if(energyWaves.length > 0) {
    let energyX = energyWaves[0].x;
    let energyTop = energyWaves[0].y + energyHeight/2;
    let energyBottom = energyWaves[0].y - energyHeight/2;
    let i = 0;
    for(i = 0; i < enemies.length; i++){
      let enemyTop = enemies[i].y + enemyHeight/2;
      let enemyBottom = enemies[i].y - enemyHeight/2;
      if(energyX > enemies[i].x && ((energyBottom < enemyTop && energyBottom > enemyBottom ) || (energyTop > enemyBottom && energyTop < enemyBottom))){ //&& energyY > enemyBottom && energyY < enemyTop){
        energyWaves[0].targetHit = true;
        enemies[i].targetHit = true;
      }
    }
  }
  
}

function createEnergyWave(player1,energyWaves){
  wavesCount++;
  if(energyWaves.length === 0)
    return {x: -190, y: player1.y, id: wavesCount-1, targetHit: false};
}

function spawnEnemy(enemies) {
    const enemiesLength = enemies.length;
    enemiesCount++;
    if (enemies.length == 0) { // add first enemy
      return {x: 400, y: 0, id: enemiesCount-1, targetHit: false};
    }
    let lastY = enemies[enemies.length-1].y;
    if(enemiesLength > 0 && enemies[enemiesLength-1].x < 250){
      if (enemiesCount % 2 != 0) { // lower 
        console.log("lower");
        return {x: 400, y: Math.random() * 150 * -1, id: enemiesCount-1, targetHit: false};
      } else {// upper
        return {x: 400, y: Math.random() * 140, id: enemiesCount-1, targetHit: false};
      }
    }
  
};
