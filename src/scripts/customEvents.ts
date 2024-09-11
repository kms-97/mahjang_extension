import type { GameInfo } from "@src/scripts/types";

export class RequestGameInfoEvent extends CustomEvent<any> {
  static type = "RequestGameInfo";

  constructor() {
    super(RequestGameInfoEvent.type, {
      bubbles: true,
      composed: true,
    });
  }
}

export class ResponseGameInfoEvent extends CustomEvent<GameInfo> {
  private static type = "ResponseGameInfo";

  constructor(detail: boolean) {
    super(ResponseGameInfoEvent.type, {
      bubbles: true,
      composed: true,
      detail,
    });
  }
}
