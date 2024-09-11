import { ResponseGameInfoEvent } from "@src/scripts/customEvents";
import type { GameState, Player } from "@src/scripts/types";

// This script runs in page context and registers a listener.
// Note that the page may override/hook things like addEventListener...
(() => {
  addEventListener("RequestGameInfoEvent", () => {
    dispatchEvent(new ResponseGameInfoEvent({}));
  });
})();

const getPlayerPai = () => {
  let playerHand = [];
  let playerMing = [];
  for (let i = 0; i < window.view.DesktopMgr.Inst.players[0].hand.length; i++) {
    playerHand.push(window.view.DesktopMgr.Inst.players[0].hand[i].val);
  }
  for (
    let i = 0;
    i < window.view.DesktopMgr.Inst.players[0].container_ming.mings.length;
    i++
  ) {
    playerMing.push(
      window.view.DesktopMgr.Inst.players[0].container_ming.mings[i]
    );
  }
  let playerPai = {
    playerHand: playerHand,
    playerMing: playerMing,
  };
  return playerPai;
};

const getGameState = () => {
  const gameState: GameState = {
    leftTile: window.view.DesktopMgr.Inst.left_tile_count,
    honba: window.view.DesktopMgr.Inst.index_ben,
    kyoku: window.view.DesktopMgr.Inst.index_ju, // 0~3
    fu: window.view.DesktopMgr.Inst.index_change, // 0~3
    liqibang:
      Number(
        uiscript.UI_DesktopInfo.Inst.me
          .getChildByName("container_lefttop")
          .getChildByName("num_lizhi_0")
          ._skin.replace(/[^0-9]/g, "")
      ) +
      Number(
        uiscript.UI_DesktopInfo.Inst.me
          .getChildByName("container_lefttop")
          .getChildByName("num_lizhi_1")
          ._skin.replace(/[^0-9]/g, "")
      ) *
        10,
  };

  return gameState;
};

const getPlayers = () => {
  const players: Player[] = [];
  const playerCount: number = window.view.DesktopMgr.Inst.players.length;
  const playerIndex: number = window.view.DesktopMgr.Inst.seat;

  for (let i = 0; i < playerCount; i++) {
    const player: Player = {
      nickName: window.view.DesktopMgr.Inst.player_datas[i].nickname,
      score:
        window.view.DesktopMgr.Inst.players[(i + (4 - playerIndex)) % 4].score,
      isLiqi:
        window.view.DesktopMgr.Inst.players[(i + (4 - playerIndex)) % 4]
          .liqibang._activeInHierarchy ||
        window.view.DesktopMgr.Inst.players[i].container_qipai.last_is_liqi,
      isPlayer: i === playerIndex,
    };
  }

  return players;
};

const getDoraState = () => {
  return window.view.DesktopMgr.Inst.dora;
};
