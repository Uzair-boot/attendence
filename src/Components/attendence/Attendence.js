/* eslint-disable react-hooks/exhaustive-deps */
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
  ActivityIndicator,
} from 'react-native';
import socket from '../../config/socket';
import {
  getallStudentsApi,
  markAttendanceApi,
} from '../../api/students/studentsApi';
import RNFS from 'react-native-fs';
import MyCamera from './Camera';
import Toast from 'react-native-toast-message';
const defaultImage = require('../../assets/default.jpeg');
const Attendance = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const styles = getStyles(isDarkMode);

  const [message, setMessage] = useState('');
  const [attendanceScreen, setAttendanceScreen] = useState(false);
  const [warning, setWarning] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(new Animated.Value(0));
  const [students, setStudents] = useState([]);
  const [loadingStudentId, setLoadingStudentId] = useState(null);

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const camera = useRef(null);

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

      if (warningAnimation) {
        warningAnimation.stop();
        warningAnimation = null;
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setWarning(true);
    });

    // Cleanup socket
    return () => {
      socket.off('connect');
      socket.off('connected');
      socket.off('start');
      socket.off('warn');
      socket.off('stop');
      socket.off('disconnect');
      if (warningAnimation) {
        warningAnimation.stop();
      }
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

  let warningAnimation = null;

  const triggerWarning = () => {
    warningAnimation = Animated.loop(
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
    );
    warningAnimation.start();
    setWarning(true);
  };

  const showToast = msg => {
    Toast.show({
      type: 'success',
      text1: 'Attended',
      text2: msg,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const takePhoto = async item => {
    setLoadingStudentId(item._id);
    try {
      if (!camera.current) {
        console.error('Camera reference not available.', camera);
        return;
      }

      const photo = await camera.current.takePhoto();

      if (photo) {
        const base64Image = await convertFileToBase64(photo.path);
        setCapturedPhoto(`file://${photo.path}`);
        await markAttendanceApi(item._id, base64Image);
        showToast(`Attendance marked successfully for student: ${item.name}`);
        console.log('Attendance marked successfully for student:', item.name);
      } else {
        console.error('Photo captured is undefined or empty.');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      showToast(`Error marking attendance for student: ${item.name}`);
    } finally {
      setLoadingStudentId(null);
    }
  };
  const convertFileToBase64 = async filePath => {
    try {
      const base64 = await RNFS.readFile(filePath, 'base64');
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting file to Base64:', error);
      throw error;
    }
  };

  const renderStudent = ({item}) => (
    <TouchableOpacity
      style={[
        styles.studentSquare,
        {backgroundColor: item.color},
        loadingStudentId === item._id && styles.loadingSquare,
      ]}
      onPress={() => takePhoto(item)}
      disabled={loadingStudentId === item._id}>
      {loadingStudentId === item._id ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={styles.studentName}>{item.name}</Text>
      )}
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

      <MyCamera
        capturedPhoto={capturedPhoto}
        setCapturedPhoto={setCapturedPhoto}
        camera={camera}
      />
    </>
  );
};

const getStyles = isDarkMode =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      backgroundColor: isDarkMode ? '#121212' : 'white',
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
    loadingSquare: {
      opacity: 0.5,
    },
  });

export default Attendance;
