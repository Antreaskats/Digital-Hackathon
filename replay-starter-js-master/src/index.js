import { makeSprite, t } from "@replay/core";
import { Player } from "./player";
import { PlayerLife } from "./playerLife";
import { Enemy } from "./enemy";

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
      audioFileNames: ["boop.wav"],
      imageFileNames: ["goku.png", "playerLife.png", "Namek.png", "icon.png"],
    }).then(() => {
      updateState((state) => ({ ...state, loaded: true }));
    });
    return initialState;
  },
  //This is the loop in which the game is played. It refreshes at 60 frames per second
  loop({ state, device, getInputs }) {
    if (!state.loaded) return state;

    const inputs = getInputs(); //This reads the inputs of the keyboard and the mouse
    let { player1, enemies } = state; //These are the states used to update the position of your player objects (You can see how it's used at the render() function)
    //inputs.keysDown[] is taking a String to identify the key pressed and recognizes that they key is pressed until it's released
    let enemy = spawnEnemy(enemies);
    if (enemy != undefined)
      enemies = [...enemies, enemy];
    if (inputs.keysDown["ArrowUp"]) {
      device.audio("boop.wav").play();
      if (player1.y <= 150) {
        player1.y += 5;
      }
    }
    if (inputs.keysDown["ArrowDown"]) {
      device.audio("boop.wav").play();
      if (player1.y >= -150) {
        player1.y -= 5;
      }
    }

    return { 
      ...state,
      loaded: true,
      player1,
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
      t.rectangle({
        height: device.size.height,
        x: -210,
        width: 5,
        color: "black",
      }),
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

function spawnEnemy(enemies) {
  if (enemies.length <= 10) {
    if (enemies.length == 0) { // add first enemy
      return {x: 400, y: 0, id: enemies.length};
    }
    let lastY = enemies[enemies.length-1].y;
    if (enemies.length % 2 != 0) { // lower 
      console.log("lower");
      return {x: 400, y: Math.random() * 150 * -1, id: enemies.length};
    } else {// upper
      return {x: 400, y: Math.random() * 140, id: enemies.length};
    }
  }
};
