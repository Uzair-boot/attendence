/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
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
import socket from '../../config/socket';
import {
  getallStudentsApi,
  markAttendanceApi,
} from '../../api/students/studentsApi';
import {launchCamera} from 'react-native-image-picker';

const defaultImage = require('../../assets/default.jpeg');

const Attendance = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const styles = getStyles(isDarkMode);

  const [message, setMessage] = useState('');
  const [attendanceScreen, setAttendanceScreen] = useState(false);
  const [warning, setWarning] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(new Animated.Value(0));
  const [students, setStudents] = useState([]);

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
      if (students.length === 0) {
        fetchStudents();
      } else {
        return;
      }
    });

    socket.on('warn', () => {
      triggerWarning();
    });

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
    try {
      // Launch camera
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        includeBase64: true,
      });

      if (result.didCancel) {
        console.log('User canceled image capture');
        return;
      }

      if (result.errorCode) {
        console.error('Camera error:', result.errorMessage);
        return;
      }

      const base64Image = result.assets[0].base64;
      const imageData = `data:${result.assets[0].type};base64,${base64Image}`;

      // Make API call to send image and student ID
      await markAttendanceApi(item._id, imageData);
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

  return (
    <>
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
    studentsContainer: {
      flex: 1,
      padding: 10,
      backgroundColor: 'white',
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

/** code with new library */

// import React, {useState, useEffect, useRef} from 'react';
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
// import CameraKitCameraScreen from 'react-native-camera-kit';


// const defaultImage = require('../../assets/default.jpeg');

// const Attendance = () => {
//   const isDarkMode = useColorScheme() === 'dark';
//   const styles = getStyles(isDarkMode);
//   const cameraRef = useRef(null);

//   const [message, setMessage] = useState('');
//   const [attendanceScreen, setAttendanceScreen] = useState(false);
//   const [warning, setWarning] = useState(false);
//   const [backgroundColor, setBackgroundColor] = useState(new Animated.Value(0));
//   const [students, setStudents] = useState([]);
//   const [isCameraReady, setIsCameraReady] = useState(false);

//   console.log(isCameraReady, 'isCameraReady');

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
//       // Only trigger the camera if it's ready
//       if (isCameraReady && cameraRef.current) {
//         const options = {quality: 0.5, base64: true};
//         const data = await cameraRef.current.capture({...options});

//         if (data?.base64) {
//           const base64Image = data.base64;
//           const imageData = `data:image/jpeg;base64,${base64Image}`;

//           // Make API call to send image and student ID
//           await markAttendanceApi(item._id, imageData);
//           console.log('Attendance marked successfully for student:', item.name);
//         }
//       }
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
//         <>
//           <FlatList
//             data={students}
//             renderItem={renderStudent}
//             keyExtractor={item => item._id}
//             numColumns={3}
//             columnWrapperStyle={styles.row}
//             keyboardShouldPersistTaps="handled"
//           />

//           {/* Hidden Camera */}
//           <CameraKitCameraScreen
//             ref={cameraRef}
//             style={styles.hiddenCamera}
//             cameraOptions={{
//               flashMode: 'off',
//               focusMode: 'on',
//               zoomMode: 'off',
//             }}
//             onCameraReady={() => setIsCameraReady(true)}
//             captureMode="photo"
//             captureAudio={false}
//             onCapture={data => console.log('Captured Image:', data)}
//             onError={error => console.log('Camera Error:', error)}
//           />
//         </>
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
//     // Hidden Camera Style
//     hiddenCamera: {
//       position: 'absolute',
//       top: -9999,
//       left: -9999,
//       width: 1,
//       height: 1,
//     },
//   });

// export default Attendance;
