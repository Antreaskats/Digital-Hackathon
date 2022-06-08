import { makeSprite, t } from "@replay/core";
 
export const Player = makeSprite({
  render() {
    return [
      t.image({
        testId: "goku",
        fileName: "goku.png",
        width: 100,
        height: 50,
      }),
    ];
  },
});
