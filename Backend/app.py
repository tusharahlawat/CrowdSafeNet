from flask import Flask 
from flask_socketio import SocketIO
import cv2
import threading
import base64
import time
import os
from pathlib import Path
import json


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')

# Store all trigger reasons in a list






@socketio.on("video_frame_1")
def stream_video(data):
    
    socketio.emit('video_frame_1', data)


@socketio.on("video_frame_2")
def stream_video(data):
   
    socketio.emit('video_frame_2', data)

@socketio.on("Alert")
def stream_video(data):
    #print(f"Received data: {data}")

    socketio.emit('Alert', data)
@socketio.on("Threat")
def stream_video(data):
    
    socketio.emit('Threat', data)
    #print(f"Received data: {data}")


@app.route('/')
def index():
    return "Socket.IO Server Running."

if __name__ == '__main__':
 
    # Run Flask and SocketIO server
    socketio.run(app, port=5000)