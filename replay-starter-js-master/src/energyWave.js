import { makeSprite, t } from "@replay/core";

export const EnergyWave = makeSprite({
  render() {
    return [
      t.image({
        fileName: "kamehameha.png",
        width: 100,
        height: 20,
        // x: posX,
        // y: posY,
      }),
    ];
  },
});