# MQTT Message Receiver

This element can receive public message sent from [HiveMQ](http://www.hivemq.com/demos/websocket-client/).
HiveMQ is a public available MQTT server. Do not use them for productive or private
message. All messages are public and can be subscribed by anyone and anyone can
send you a message.

## Connect
Go to the [HiveMQ](http://www.hivemq.com/demos/websocket-client/) web socket client and press the `connect` button.

## Topic
The topic is a kind of `channel` in MQTT. For this element the topic is always 
`freegroup/brainbox`

## Message
The element checks if the message.elementId is related to the element.elementId.
If yes take the value and send them to the output port.

Set the `value` to `1` if you want the the output port goes high.

```
{
 "value":0,
 "elementId":"yourElementId"
}
```