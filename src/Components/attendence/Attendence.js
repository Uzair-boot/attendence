/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   Image,
//   FlatList,
//   TouchableOpacity,
//   useColorScheme,
// } from 'react-native';
// import socket from '../../config/socket';
// import {
//   getallStudentsApi,
//   markAttendanceApi,
// } from '../../api/students/studentsApi';
// import {launchCamera} from 'react-native-image-picker';

// const defaultImage = require('../../assets/default.jpeg');

// const Attendance = () => {
//   const isDarkMode = useColorScheme() === 'dark';

//   const styles = getStyles(isDarkMode);

//   const [message, setMessage] = useState('');
//   const [attendanceScreen, setAttendanceScreen] = useState(false);
//   const [warning, setWarning] = useState(false);
//   const [backgroundColor, setBackgroundColor] = useState(new Animated.Value(0));
//   const [students, setStudents] = useState([]);

//   useEffect(() => {
//     socket.on('connect', () => {
//       console.log('Connected to WebSocket');
//       setMessage('Successfully connected');
//     });

//     socket.on('connected', () => {
//       setMessage('Successfully connected');
//     });

//     socket.on('start', () => {
//       setAttendanceScreen(true);
//       setMessage('Attendance screen started');
//       if (students.length === 0) {
//         fetchStudents();
//       } else {
//         return;
//       }
//     });

//     socket.on('warn', () => {
//       triggerWarning();
//     });

//     socket.on('stop', () => {
//       setAttendanceScreen(false);
//       setWarning(false);
//       setMessage('No active session');
//       setStudents([]);
//     });

//     socket.on('disconnect', () => {
//       console.log('Socket disconnected');
//     });

//     // Cleanup socket on component unmount
//     return () => {
//       socket.off('connect');
//       socket.off('connected');
//       socket.off('start');
//       socket.off('warn');
//       socket.off('stop');
//       socket.off('disconnect');
//     };
//   }, [students]);

//   const fetchStudents = async () => {
//     try {
//       const response = await getallStudentsApi();
//       setStudents(response.data.students);
//     } catch (error) {
//       console.error('Failed to fetch students:', error.message);
//     }
//   };

//   const triggerWarning = () => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(backgroundColor, {
//           toValue: 1,
//           duration: 500,
//           useNativeDriver: false,
//         }),
//         Animated.timing(backgroundColor, {
//           toValue: 0,
//           duration: 500,
//           useNativeDriver: false,
//         }),
//       ]),
//     ).start();
//     setWarning(true);
//   };
//   const handlePress = async item => {
//     try {
//       // Launch camera
//       const result = await launchCamera({
//         mediaType: 'photo',
//         cameraType: 'back',
//         includeBase64: true,
//       });

//       if (result.didCancel) {
//         console.log('User canceled image capture');
//         return;
//       }

//       if (result.errorCode) {
//         console.error('Camera error:', result.errorMessage);
//         return;
//       }

//       const base64Image = result.assets[0].base64;
//       const imageData = `data:${result.assets[0].type};base64,${base64Image}`;

//       // Make API call to send image and student ID
//       await markAttendanceApi(item._id, imageData);
//       console.log('Attendance marked successfully for student:', item.name);
//     } catch (error) {
//       console.error(
//         'Error capturing image or marking attendance:',
//         error.message,
//       );
//     }
//   };

//   const renderStudent = ({item}) => (
//     <TouchableOpacity
//       style={[styles.studentSquare, {backgroundColor: item.color}]}
//       onPress={() => handlePress(item)}>
//       <Text style={styles.studentName}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <>
//       <Animated.View
//         pointerEvents="none"
//         style={[
//           styles.warningContainer,
//           {
//             backgroundColor: backgroundColor.interpolate({
//               inputRange: [0, 1],
//               outputRange: ['transparent', 'yellow'],
//             }),
//           },
//         ]}
//       />
//       <View style={styles.container}>
//         <Text style={styles.text}>{message}</Text>

//         {!attendanceScreen && !warning && (
//           <Image source={defaultImage} style={styles.defaultImage} />
//         )}
//       </View>
//       {attendanceScreen && (
//         <FlatList
//           data={students}
//           renderItem={renderStudent}
//           keyExtractor={item => item._id}
//           numColumns={3}
//           columnWrapperStyle={styles.row}
//           keyboardShouldPersistTaps="handled"
//         />
//       )}
//     </>
//   );
// };

// const getStyles = isDarkMode =>
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       marginTop: 20,
//     },
//     text: {
//       fontSize: 18,
//       color: isDarkMode ? '#fff' : 'black',
//       textAlign: 'center',
//       margin: 10,
//     },
//     defaultImage: {
//       width: 200,
//       height: 200,
//       resizeMode: 'contain',
//     },
//     warningContainer: {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       alignItems: 'center',
//       zIndex: 10,
//     },
//     studentsContainer: {
//       flex: 1,
//       padding: 10,
//       backgroundColor: 'white',
//     },
//     row: {
//       justifyContent: 'space-between',
//     },

//     studentSquare: {
//       flex: 1,
//       margin: 5,
//       height: 100,
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderRadius: 10,
//     },
//     studentName: {
//       color: 'white',
//       fontWeight: 'bold',
//       textAlign: 'center',
//     },
//   });

// export default Attendance;
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {RNCamera} from 'react-native-camera-kit';
import socket from '../../config/socket';
import {
  getallStudentsApi,
  markAttendanceApi,
} from '../../api/students/studentsApi';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const defaultImage = require('../../assets/default.jpeg');

const Attendance = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);

  const [message, setMessage] = useState('');
  const [attendanceScreen, setAttendanceScreen] = useState(false);
  const [warning, setWarning] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(new Animated.Value(0));
  const [students, setStudents] = useState([]);

  const cameraRef = useRef(null);

  // Request camera permissions using react-native-permissions
  const requestCameraPermissions = async () => {
    const result = await request(PERMISSIONS.ANDROID.CAMERA);
    return result === RESULTS.GRANTED;
  };

  useEffect(() => {
    (async () => {
      const permissionGranted = await requestCameraPermissions();
      console.log(permissionGranted, 'permissionGranted');

      if (!permissionGranted) {
        console.error('Camera access is required to use this feature.');
      }
    })();
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket');
      setMessage('Successfully connected');
    });

    socket.on('connected', () => {
      setMessage('Successfully connected');
    });

    socket.on('start', () => {
      setAttendanceScreen(true);
      setMessage('Attendance screen started');
      if (students.length === 0) fetchStudents();
    });

    socket.on('warn', () => triggerWarning());

    socket.on('stop', () => {
      setAttendanceScreen(false);
      setWarning(false);
      setMessage('No active session');
      setStudents([]);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Cleanup socket on component unmount
    return () => {
      socket.off('connect');
      socket.off('connected');
      socket.off('start');
      socket.off('warn');
      socket.off('stop');
      socket.off('disconnect');
    };
  }, [students]);

  const fetchStudents = async () => {
    try {
      const response = await getallStudentsApi();
      setStudents(response.data.students);
    } catch (error) {
      console.error('Failed to fetch students:', error.message);
    }
  };

  const triggerWarning = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundColor, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundColor, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
    ).start();
    setWarning(true);
  };

  const handlePress = async item => {
    if (!cameraRef.current) {
      console.error('Camera not ready');
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync();
      const base64Image = `data:image/jpeg;base64,${photo.base64}`;

      await markAttendanceApi(item._id, base64Image);
      console.log('Attendance marked successfully for student:', item.name);
    } catch (error) {
      console.error(
        'Error capturing image or marking attendance:',
        error.message,
      );
    }
  };

  const renderStudent = ({item}) => (
    <TouchableOpacity
      style={[styles.studentSquare, {backgroundColor: item.color}]}
      onPress={() => handlePress(item)}>
      <Text style={styles.studentName}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Render Camera and UI
  return (
    <>
      {/* Warning Background */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.warningContainer,
          {
            backgroundColor: backgroundColor.interpolate({
              inputRange: [0, 1],
              outputRange: ['transparent', 'yellow'],
            }),
          },
        ]}
      />
      <RNCamera
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        captureAudio={false}
        onCameraReady={() => console.log('Camera ready')}
      />
      <View style={styles.container}>
        <Text style={styles.text}>{message}</Text>
        {!attendanceScreen && !warning && (
          <Image source={defaultImage} style={styles.defaultImage} />
        )}
      </View>
      {attendanceScreen && (
        <FlatList
          data={students}
          renderItem={renderStudent}
          keyExtractor={item => item._id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </>
  );
};

const getStyles = isDarkMode =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      marginTop: 20,
    },
    text: {
      fontSize: 18,
      color: isDarkMode ? '#fff' : 'black',
      textAlign: 'center',
      margin: 10,
    },
    defaultImage: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    warningContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      zIndex: 10,
    },
    row: {
      justifyContent: 'space-between',
    },
    studentSquare: {
      flex: 1,
      margin: 5,
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    studentName: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

export default Attendance;
