import { makeSprite, t } from "@replay/core";
import { Player } from "./player";
import { PlayerLife } from "./playerLife";
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

export const Game = makeSprite({
  init({ updateState, preloadFiles }) {
    preloadFiles({
      audioFileNames: ["boop.wav"],
      imageFileNames: ["goku.png", "playerLife.png", "Namek.png"],
    }).then(() => {
      updateState((state) => ({ ...state, loaded: true }));
    });

    return {
      loaded: false,
      //players: [newPlayer()],
      player1X: -250,
      player1Y: 0,
      player2X: +150,
      player2Y: 0,
    };
  },

  loop({ state, device, getInputs }) {
    if (!state.loaded) return state;

    const inputs = getInputs();
    let { player1X, player1Y, player2X, player2Y } = state;
    if (inputs.keysDown["ArrowUp"]) {
      device.audio("boop.wav").play();
      if (player1Y <= 150) {
        player1Y += 5;
      }
    }
    if (inputs.keysDown["ArrowDown"]) {
      device.audio("boop.wav").play();
      if (player1Y >= -150) {
        player1Y -= 5;
      }
    }

    if (inputs.keysDown["ArrowRight"]) {
      device.audio("boop.wav").play();
      player2X += 5;
    }
    if (inputs.keysDown["ArrowLeft"]) {
      device.audio("boop.wav").play();
      player2X -= 5;
    }

    // if (inputs.pointer.justPressed) {
    //   device.audio("boop.wav").play();
    //   player1X = inputs.pointer.x;
    //   player1Y = inputs.pointer.y;
    // }

    return {
      loaded: true,
      player1X: player1X + (player1X - player1X) / 10,
      player1Y: player1Y + (player1Y - player1Y) / 10,
      player2X: player2X + (player2X - player2X) / 10,
      player2Y: player2Y + (player2Y - player2Y) / 10,
      // player1X,
      // player1Y,
      // player2X,
      // player2Y,
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
      // t.text({
      //   color: "red",
      //   text: "Hello Replay! To get started, edit src/index.js",
      //   y: 50,
      // }),
      // t.image({
      //   testId: "icon",
      //   x: state.pos1X,
      //   y: state.pos1Y,
      //   fileName: "goku.png",
      //   width: 100,
      //   height: 50,
      // }),
      t.image({

        fileName: "Namek.png",

        width: device.size.width,

        height: device.size.height,

      }),
      // ...state.players.map((player, index) =>
      //   Player({
      //     id: `player-${index}`,
      //     player,
      //     x: player.x,
      //   })
      // ),
      Player({
        id: "Player1",
        x: state.player1X,
        y: state.player1Y,
      }),
      Player({
        id: "Player2",
        x: state.player2X,
        y: state.player2Y,
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
      t.rectangle({
        height: device.size.height,
        x: -210,
        width: 5,
        color: "black",
      }),
    ];
  },
});

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
