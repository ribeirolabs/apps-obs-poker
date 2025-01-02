export class OBS {
  protected ws: WebSocket;
  protected v: number = 0;

  constructor() {
    this.ws = new WebSocket("ws://192.168.10.50:4455");
    this.ws.addEventListener("error", (e) => console.error(e));
    this.ws.addEventListener("message", (message) => {
      const data = JSON.parse(message.data);
      console.log("received", data);

      if (data.op === 0) {
        this.ws.send(
          JSON.stringify({
            op: 1,
            d: {
              rpcVersion: data.d.rpcVersion,
            },
          }),
        );
      } else if (data.op === 2) {
        this.v = data.d.negotiatedRpcVersion;

        this.ws.send(
          JSON.stringify({
            op: 6,
            d: {
              requestType: "GetSceneItemTransform",
              requestData: {
                sceneName: "Table 1",
                sceneItemId: 0,
              },
            },
          }),
        );
      }
    });
  }
}
