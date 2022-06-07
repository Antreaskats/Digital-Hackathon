import { makeSprite, t } from "@replay/core";

export const Player = makeSprite({
  render(/*posX, posY*/) {
    return [
      t.image({
        testId: "icon",
        fileName: "goku.png",
        width: 100,
        height: 50,
        // x: posX,
        // y: posY,
      }),
    ];
  },
});
