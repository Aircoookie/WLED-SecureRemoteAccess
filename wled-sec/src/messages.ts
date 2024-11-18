import { signMessage, nonceCounter, getSessionId, setSessionId } from "./crypto";

export function handleMessageEvent(event : MessageEvent) {
  console.log(`Received message: ${event.data}`);
  console.log(`origin: ${event.origin}`);
  //console.log(`source: ${event.source}`);
  // TODO: Check if the message is from the expected source
  try {
    var json = JSON.parse(event.data)
  } catch (e) {
    console.log(`Error parsing JSON: ${e}`);
    return;
  }
  if (json['wled-ui'] === 'onload') {
    event.source!.postMessage('{"wled-rc":"ready"}', {'targetOrigin':event.origin});
  }
  else if (json['wled-ui'] === 'sid') {
    setSessionId(json['sid']);
  } else if (json['wled-ui'] === 'hmac-req') {
    // include nonce in msg
    json['msg']['nc'] = {"sid":getSessionId(), "c":nonceCounter()};
    signMessage(JSON.stringify(json['msg'])).then((signature) => {
      var msgObject = {'wled-rc':'hmac', 'msg': json['msg'], 'mac': signature};
      event.source!.postMessage(JSON.stringify(msgObject), {'targetOrigin':event.origin});
    });
  }
}