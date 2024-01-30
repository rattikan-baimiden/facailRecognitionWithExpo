import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';

export default function App() {
  const cameraRef = useRef(null);
  const [hasPermission, setHaspermission] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHaspermission(status === 'granted');
    })();
  }, []);

  const handleFaceDetected = ({ faces }) => {
    if (faces.length > 0) {
      console.log('Faces Detected : ', faces.length);
      setDetectedFaces(faces);
    } else {
      console.log('No faces detected!!');
    }
  };

  const toggleFaceDetection = async () => {
    if (isDetecting) {
      if (cameraRef.current) {
        await cameraRef.current.pausePreview();
      }
    } else {
      if (cameraRef.current) {
        await cameraRef.current.resumePreview();
      }
    }
    setIsDetecting((prev) => !prev);
  };

  const renderFaceBoxes = () => {
    return detectedFaces.map((face, index) => (
      <View
        key={index}
        style={{
          position: 'absolute',
          borderColor: 'green',
          borderWidth: 2,
          borderRadius: 5,
          left: face.bounds.origin.x,
          top: face.bounds.origin.y,
          width: face.bounds.size.width,
          height: face.bounds.size.height,
        }}
      />
    ));
  };

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {isDetecting && (
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.front}
            onFacesDetected={handleFaceDetected}
          >
            {renderFaceBoxes()}
          </Camera>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={toggleFaceDetection}>
        <Text style={styles.buttonText}>
          {isDetecting ? 'Stop Detection' : 'Start face Detection'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceBox: {
    position: 'absolute',
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 5
  },
  cameraContainer: {
    flex: 1,
    width:'100%',
    overflow: 'hidden',
    borderRadius: 10,
  },
  camera: {
    flex: 1
  },
  button: {
    backgroundColor:'#03498db',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  button: {
    color: 'white',
    frontSize: 18
  }
});
