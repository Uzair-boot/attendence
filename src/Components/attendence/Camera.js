// import React, {useState, useRef, useEffect} from 'react';
// import {
//   View,
//   Button,
//   StyleSheet,
//   Image,
//   ActivityIndicator,
//   Text,
// } from 'react-native';
// import {RNCamera} from 'react-native-camera';
// import {PermissionsAndroid, Platform} from 'react-native';

// const MyCamera = () => {
//   const cameraRef = useRef(null);
//   const [photo, setPhoto] = useState(null);

//   const requestPermissions = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.requestMultiple([
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         ]);
//         if (
//           granted['android.permission.CAMERA'] !==
//           PermissionsAndroid.RESULTS.GRANTED
//         ) {
//           console.error('Camera permission denied');
//         }
//         if (
//           granted['android.permission.RECORD_AUDIO'] !==
//           PermissionsAndroid.RESULTS.GRANTED
//         ) {
//           console.error('Record audio permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     }
//   };

//   useEffect(() => {
//     requestPermissions();
//   }, []);
//   useEffect(() => {
//     const checkCameraStatus = async () => {
//       const status = await RNCamera.getStatus();
//       console.log('Camera status:', status);
//     };
//     checkCameraStatus();
//   }, []);

//   const getPictureSizes = async () => {
//     if (cameraRef.current) {
//       const sizes = await cameraRef.current.getAvailablePictureSizes('4:3');
//       console.log('Available picture sizes:', sizes);
//     }
//   };

//   useEffect(() => {
//     getPictureSizes();
//   }, []);

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       try {
//         console.log('Taking picture...');
//         const data = await cameraRef.current.takePictureAsync({
//           quality: 1,
//           base64: true,
//         });
//         console.log('Picture data:', data);
//         setPhoto(data.uri);
//       } catch (error) {
//         console.error('Error taking picture:', error);
//       }
//     } else {
//       console.error('Camera is not ready');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {photo ? (
//         <Image source={{uri: photo}} style={styles.preview} />
//       ) : (
//         // <RNCamera
//         //   ref={cameraRef}
//         //   style={styles.preview}
//         //   type={RNCamera.Constants.Type.back}
//         //   flashMode={RNCamera.Constants.FlashMode.auto}
//         //   androidCameraPermissionOptions={{
//         //     title: 'Permission to use camera',
//         //     message: 'We need your permission to use your camera',
//         //     buttonPositive: 'Ok',
//         //     buttonNegative: 'Cancel',
//         //   }}
//         //   androidRecordAudioPermissionOptions={{
//         //     title: 'Permission to use audio recording',
//         //     message: 'We need your permission to use your audio recording',
//         //     buttonPositive: 'Ok',
//         //     buttonNegative: 'Cancel',
//         //   }}
//         // />
//         <RNCamera
//           ref={cameraRef}
//           style={styles.preview}
//           type={RNCamera.Constants.Type.back}
//           flashMode={RNCamera.Constants.FlashMode.auto}
//           pictureSize="1920x1080"
//           pendingAuthorizationView={
//             <View style={styles.container}>
//               <Text>Waiting for camera authorization...</Text>
//               <ActivityIndicator size="large" />
//             </View>
//           }
//           notAuthorizedView={
//             <View style={styles.container}>
//               <Text>
//                 Camera access is not authorized. Please enable it in settings.
//               </Text>
//             </View>
//           }
//           androidCameraPermissionOptions={{
//             title: 'Permission to use camera',
//             message: 'We need your permission to use your camera',
//             buttonPositive: 'Ok',
//             buttonNegative: 'Cancel',
//           }}
//           androidRecordAudioPermissionOptions={{
//             title: 'Permission to use audio recording',
//             message: 'We need your permission to use your audio recording',
//             buttonPositive: 'Ok',
//             buttonNegative: 'Cancel',
//           }}
//         />
//       )}
//       <Button title="Take Picture" onPress={takePicture} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   //   preview: {
//   //     flex: 1,
//   //     justifyContent: 'flex-end',
//   //     alignItems: 'center',
//   //   },
//   preview: {
//     flex: 1,
//     width: '100%',
//   },
// });

// export default MyCamera;

// // import React, {useState, useEffect} from 'react';
// // import {View, Button, StyleSheet, Image, Text} from 'react-native';
// // import {Camera, useCameraDevices} from 'react-native-vision-camera';

// // const MyCamera = () => {
// //   const [photo, setPhoto] = useState(null);
// //   const devices = useCameraDevices();
// //   const device = devices.back;

// //   const takePicture = async () => {
// //     const photoData = await device.takePhoto();
// //     setPhoto(photoData.uri);
// //   };

// //   if (device == null) {
// //     return <View><Text>Loading camera...</Text></View>;
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <Camera style={styles.camera} device={device} isActive />
// //       <Button title="Take Picture" onPress={takePicture} />
// //       {photo && <Image source={{uri: photo}} style={styles.preview} />}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
// //   camera: {flex: 1, width: '100%'},
// //   preview: {width: 200, height: 200},
// // });

// // export default MyCamera;
// import React, {useState, useRef} from 'react';
// import {View, Button, Image} from 'react-native';
// import {Camera} from 'react-native-vision-camera';

// const MyCamera = () => {
//   const [photo, setPhoto] = useState(null);
//   const cameraRef = useRef(null);

//   const takePhoto = async () => {
//     if (cameraRef.current) {
//       const myPphoto = await cameraRef.current.takePhoto({
//         qualityPrioritization: 'quality',
//         format: 'jpeg',
//       });
//       setPhoto(myPphoto.path);
//     }
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Camera ref={cameraRef} style={{flex: 1}} />
//       <Button title="Take Picture" onPress={takePhoto} />
//       {photo && (
//         <Image source={{uri: photo}} style={{width: 300, height: 200}} />
//       )}
//     </View>
//   );
// };

// export default MyCamera;

// import React, {useEffect, useState, useRef} from 'react';
// import {Text, View, Button, Image} from 'react-native';
// import {
//   Camera,
//   useCameraDevice,
//   useCameraDevices,
// } from 'react-native-vision-camera';

// const MyCamera = () => {
//   const [cameraPermission, setCameraPermission] = useState(null);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);

//   const device = useCameraDevice('back');
//   const camera = useRef < Camera > null;

//   const checkCameraPermission = async () => {
//     const status = await Camera.getCameraPermissionStatus();
//     console.log('status', status);

//     if (status === 'granted') {
//       setCameraPermission(true);
//     } else if (status === 'notDetermined') {
//       const permission = await Camera.requestCameraPermission();
//       setCameraPermission(permission === 'authorized');
//     } else {
//       setCameraPermission(false);
//     }
//   };

//   useEffect(() => {
//     checkCameraPermission();
//   }, []);

//   if (cameraPermission === null) {
//     return <Text>Checking camera permission...</Text>;
//   } else if (!cameraPermission) {
//     return <Text>Camera permission not granted</Text>;
//   }

//   if (!device) {
//     return <Text>No camera device available</Text>;
//   }

//   // const camera = useRef<Camera>(null);
//   // const camera = useRef(null);

//   const takePhoto = async () => {
//     try {
//       if (!camera.current) {
//         console.error('Camera reference not available.', camera);
//         return;
//       }

//       const photo = await camera.current.takePhoto();
//       console.log(photo);

//       if (photo) {
//         setCapturedPhoto(`file://${photo.path}`);
//         setShowPreview(true);
//       } else {
//         console.error('Photo captured is undefined or empty.');
//       }
//     } catch (error) {
//       console.error('Error capturing photo:', error);
//     }
//   };

//   const confirmPhoto = () => {
//     console.log('Photo confirmed:', capturedPhoto);
//     setShowPreview(false);
//   };

//   const retakePhoto = () => {
//     setCapturedPhoto(null); // Clear the captured photo
//     setShowPreview(false);
//   };

//   const onCameraReady = ref => {
//     camera.current = ref;
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Camera
//         style={{flex: 1}}
//         device={device}
//         isActive={true}
//         ref={ref => onCameraReady(ref)}
//         photo={true}
//         video={true}
//       />
//       {showPreview && capturedPhoto ? (
//         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//           <Image
//             source={{uri: capturedPhoto}} // Assuming the photo is a valid URI
//             style={{width: 300, height: 300, marginBottom: 20}}
//           />
//           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//             <Button title="Retake" onPress={retakePhoto} />
//             <Button title="Confirm" onPress={confirmPhoto} />
//           </View>
//         </View>
//       ) : (
//         <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
//           <Button title="Take Photo" onPress={takePhoto} />
//         </View>
//       )}
//     </View>
//   );
// };

// export default MyCamera;

// import React, {useEffect, useState, useRef} from 'react';
// import {Text, View, Button, Image} from 'react-native';
// import {
//   Camera,
//   useCameraDevice,
//   useCameraDevices,
// } from 'react-native-vision-camera';

// const MyCamera = () => {
//   const [cameraPermission, setCameraPermission] = useState(null);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [cameraReady, setCameraReady] = useState(false); // New state to track camera readiness

//   const device = useCameraDevice('back');
//   const camera = useRef(null);

//   const checkCameraPermission = async () => {
//     const status = await Camera.getCameraPermissionStatus();
//     console.log('status', status);

//     if (status === 'granted') {
//       setCameraPermission(true);
//     } else if (status === 'notDetermined') {
//       const permission = await Camera.requestCameraPermission();
//       setCameraPermission(permission === 'authorized');
//     } else {
//       setCameraPermission(false);
//     }
//   };

//   useEffect(() => {
//     checkCameraPermission();
//   }, []);

//   if (cameraPermission === null) {
//     return <Text>Checking camera permission...</Text>;
//   } else if (!cameraPermission) {
//     return <Text>Camera permission not granted</Text>;
//   }

//   if (!device) {
//     return <Text>No camera device available</Text>;
//   }

//   const takePhoto = async () => {
//     try {
//       if (!camera.current) {
//         console.error('Camera reference not available.', camera);
//         return;
//       }

//       const photo = await camera.current.takePhoto();
//       console.log(photo);

//       if (photo) {
//         setCapturedPhoto(`file://${photo.path}`);
//         setShowPreview(true);
//       } else {
//         console.error('Photo captured is undefined or empty.');
//       }
//     } catch (error) {
//       console.error('Error capturing photo:', error);
//     }
//   };

//   const confirmPhoto = () => {
//     console.log('Photo confirmed:', capturedPhoto);
//     setShowPreview(false);
//   };

//   const retakePhoto = () => {
//     setCapturedPhoto(null); // Clear the captured photo
//     setShowPreview(false);
//   };

//   const onInitialized = () => {
//     setCameraReady(true); // Set camera readiness
//     console.log('Camera initialized and ready!');
//   };

//   return (
//     <View style={{flex: 1}}>
//       <Camera
//         style={{flex: 1}}
//         device={device}
//         isActive={true}
//         ref={camera}
//         photo={true}
//         video={true}
//         onInitialized={onInitialized} // Ensure the camera is ready
//       />
//       {showPreview && capturedPhoto ? (
//         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//           <Image
//             source={{uri: capturedPhoto}} // Assuming the photo is a valid URI
//             style={{width: 300, height: 300, marginBottom: 20}}
//           />
//           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//             <Button title="Retake" onPress={retakePhoto} />
//             <Button title="Confirm" onPress={confirmPhoto} />
//           </View>
//         </View>
//       ) : (
//         <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
//           <Button
//             title="Take Photo"
//             onPress={takePhoto}
//             disabled={!cameraReady} // Disable button if camera is not ready
//           />
//         </View>
//       )}
//     </View>
//   );
// };

// export default MyCamera;

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
