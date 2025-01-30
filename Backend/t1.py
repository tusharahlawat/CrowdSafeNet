import os
import cv2
import numpy as np
import joblib
import base64
import socketio
sio = socketio.Client()
sio.connect('http://127.0.0.1:5000')

# Load trained Gaussian Mixture Model (GMM)
model = joblib.load("model.pkl")  # Ensure correct model path
threshold = 2.0  # Adjust based on training data

### ✅ Preprocess Frames Before Extracting Features ###
def preprocess_frame(frame):
    resized_frame = cv2.resize(frame, (224, 224))  # Resize
    normalized_frame = resized_frame / 255.0  # Normalize
    return normalized_frame

### ✅ Extract Features for Anomaly Detection ###
def extract_features(frames):
    features = []
    
    for i in range(len(frames) - 1):
        prev_frame = cv2.cvtColor(frames[i], cv2.COLOR_BGR2GRAY)
        next_frame = cv2.cvtColor(frames[i + 1], cv2.COLOR_BGR2GRAY)
        
        # Compute Optical Flow
        flow = cv2.calcOpticalFlowFarneback(prev_frame, next_frame, None, 0.5, 3, 15, 3, 5, 1.2, 0)

        # Extract motion-based features
        mean_flow = np.mean(flow)
        std_flow = np.std(flow)

        # Take first 237 features from X and Y directions
        flow_x = flow[..., 0].flatten()[:237]
        flow_y = flow[..., 1].flatten()[:237]

        feature_vector = np.concatenate(([mean_flow, std_flow], flow_x, flow_y))  # Shape (476,)
        features.append(feature_vector)

    return np.array(features)

### ✅ Apply Threshold to Anomaly Scores ###
def further_processing(predictions):
    threshold = 0.5
    return (predictions > threshold).astype(int)

### ✅ Detect Anomalies in Video Feed ###
def detect_anomaly(frame, prev_gray):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Compute Optical Flow
    flow = cv2.calcOpticalFlowFarneback(prev_gray, gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)

    # Extract features
    mean_flow = np.mean(flow)
    std_flow = np.std(flow)
    flow_x = flow[..., 0].flatten()[:237]
    flow_y = flow[..., 1].flatten()[:237]

    features = np.concatenate(([mean_flow, std_flow], flow_x, flow_y)).reshape(1, -1)  # Shape (1, 476)

    # Compute anomaly score
    anomaly_score = -model.score_samples(features)

    detected_anomaly = False
    detected_area = None

    if anomaly_score > threshold:
        detected_anomaly = True
        detected_area = flow

    return gray, detected_anomaly, detected_area

### ✅ Process Video Feed (Live or Pre-recorded) ###
def process_video(video_source='TIME_SQUARE.mp4'):
    cap = cv2.VideoCapture(video_source)
    ret, prev_frame = cap.read()

    if not ret:
        print("Error: Cannot read video source")
        return

    prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Detect anomaly
        gray, anomaly_detected, anomaly_area = detect_anomaly(frame, prev_gray)

        if anomaly_detected and anomaly_area is not None:
            cv2.putText(frame, "", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 
                        1, (0, 0, 255), 2, cv2.LINE_AA)

            # ✅ HEATMAP FIX ✅
            anomaly_area = np.abs(anomaly_area)
            anomaly_area = (anomaly_area - np.min(anomaly_area)) / (np.max(anomaly_area) - np.min(anomaly_area) + 1e-6)
            heatmap = np.uint8(255 * anomaly_area)

            if heatmap.shape[-1] == 2:
                heatmap = heatmap[..., 0]

            heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

            frame = cv2.addWeighted(frame, 0.6, heatmap, 0.4, 0)
        
            frame = cv2.resize(frame, (frame.shape[1] * 2, frame.shape[0] * 2))
            _, buffer = cv2.imencode('.jpg', frame)  # Convert frame to JPG format
            frame_bytes = buffer.tobytes()  # Convert the buffer to a byte object
            frame_base64 = base64.b64encode(frame_bytes).decode('utf-8')
            

        # Encode the byte object to base64
          # Base64 encode the frame

        sio.emit('video_frame_2', {'data': frame_base64})

        prev_gray = gray
        if cv2.waitKey(30) & 0xFF == ord("q"):
            break  

    cap.release()
    cv2.destroyAllWindows()

### ✅ Process Image Files in a Directory ###


### ✅ Run on Live Camera, Video File, or Image Folder ###
    #process_video(0)  # Live feed
process_video(0) # Pre-recorded video
    # process_images("Crowd-Anomaly-Detection-master/TEST")  # Process images in a directory