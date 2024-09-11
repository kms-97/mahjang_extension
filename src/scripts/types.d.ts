import {
  RequestGameInfoEvent,
  ResponseGameInfoEvent,
} from "@src/scripts/customEvents";

export declare global {
  interface GlobalEventHandlersEventMap {
    RequestGameInfo: RequestGameInfoEvent;
    ResponseGameInfo: ResponseGameInfoEvent;
  }
}

export declare interface Pai {}

export declare interface GameState {
  leftTile: number;
  honba: number;
  kyoku: number;
  fu: number;
  liqibang: number;
}

export declare interface Player {
  nickName: string;
  score: number;
  isLiqi: boolean;
  isPlayer: boolean;
}

export declare interface GameInfo {
  pai: Array[];
  gameState: GameState;
  players: Player[];
}
