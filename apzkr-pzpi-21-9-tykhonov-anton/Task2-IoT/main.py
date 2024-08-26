from fastapi import FastAPI, WebSocket
from fastapi.websockets import WebSocketDisconnect
import asyncio
import websockets
import json

app = FastAPI()

# This will hold the connections to the IoT devices
iot_connections = {}

# Function to forward messages to another WebSocket server
async def forward_to_server(message: dict, uri: str):
    async with websockets.connect(uri) as websocket:
        await websocket.send(json.dumps(message))
        response = await websocket.recv()
        return response

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    iot_id = None
    
    try:
        while True:
            # Receive a message from the WebSocket
            data = await websocket.receive_text()
            message = json.loads(data)
            message_type = message.get("type")
            iot_id = message.get("MACADDR")

            if message_type == "init":
                print(f"Init message received from IoT device {iot_id}")

                # Forward the init message to the WebSocket server on port 5000
                uri = "ws://localhost:5000/ws"
                response = await forward_to_server(message, uri)

                # Send the response back to the IoT device
                await websocket.send_text(response)

            elif message_type == "emergency_alert":
                print(f"Emergency alert received from IoT device {iot_id}")

                # Forward the emergency alert message to the WebSocket server on port 5000
                uri = "ws://localhost:5000/ws"
                response = await forward_to_server(message, uri)

                # Send the response back to the IoT device
                await websocket.send_text(response)
                
    except WebSocketDisconnect:
        print(f"IoT device {iot_id} disconnected")
        if iot_id in iot_connections:
            del iot_connections[iot_id]

# Run the server using: uvicorn filename:app --reload