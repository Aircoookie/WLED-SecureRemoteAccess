import { signMessage } from "./crypto";

export function handleMessageEvent(event : MessageEvent) {
  console.log(`Received message: ${event.data}`);
  console.log(`origin: ${event.origin}`);
  console.log(`source: ${event.source}`);
  // TODO: Check if the message is from the expected source
  signMessage(event.data).then((signature) => {
    event.source!.postMessage(signature, {'targetOrigin':event.origin});
  });
}