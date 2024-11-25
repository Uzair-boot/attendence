/* eslint-disable no-unused-vars */
import React, {useEffect, useState, useRef} from 'react';
import {Text, View, Button, Image} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

const MyCamera = ({capturedPhoto, setCapturedPhoto, camera}) => {
  const [cameraPermission, setCameraPermission] = useState(null);
  // const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  const device = useCameraDevice('back');
  // const camera = useRef(null);

  // request camera permission
  const checkCameraPermission = async () => {
    const status = await Camera.getCameraPermissionStatus();
    setCameraPermission(status === 'granted');
  };

  // Re-request permission and immediately recheck
  const requestPermission = async () => {
    await Camera.requestCameraPermission();
    await checkCameraPermission();
  };

  useEffect(() => {
    checkCameraPermission();
  }, []);

  if (cameraPermission === null) {
    return <Text>Checking camera permission...</Text>;
  }

  if (cameraPermission === false) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{marginBottom: 20}}>
          Camera permission is required to use this feature.
        </Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  if (!device) {
    return <Text>No camera device available</Text>;
  }

  const takePhoto = async () => {
    try {
      if (!camera.current) {
        console.error('Camera reference not available.', camera);
        return;
      }

      const photo = await camera.current.takePhoto();
      console.log(photo);

      if (photo) {
        setCapturedPhoto(`file://${photo.path}`);
        setShowPreview(true);
      } else {
        console.error('Photo captured is undefined or empty.');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  const confirmPhoto = () => {
    console.log('Photo confirmed:', capturedPhoto);
    setShowPreview(false);
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setShowPreview(false);
  };

  const onInitialized = () => {
    setCameraReady(true);
    console.log('Camera initialized and ready!');
  };

  return (
    <View style={{flex: 1}}>
      <Camera
        style={{flex: 1}}
        device={device}
        isActive={true}
        ref={camera}
        photo={true}
        video={true}
        onInitialized={onInitialized}
      />
      {showPreview && capturedPhoto ? (
        <></>
      ) : (
        // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        //   <Image
        //     source={{uri: capturedPhoto}}
        //     style={{width: 300, height: 300, marginBottom: 20}}
        //   />
        //   <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        //     <Button title="Retake" onPress={retakePhoto} />
        //     <Button title="Confirm" onPress={confirmPhoto} />
        //   </View>
        // </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          {/* <Button
            title="Take Photo"
            onPress={takePhoto}
            disabled={!cameraReady}
          /> */}
        </View>
      )}
    </View>
  );
};

export default MyCamera;
