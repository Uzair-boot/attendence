/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import MyCamera from './Camera';
import Toast from 'react-native-toast-message';
import {convertFileToBase64, getBase64ImageSize} from '../utils/utils';

const defaultImage = require('../../assets/default.jpeg');

const Attendance = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const styles = getStyles(isDarkMode);

  // const [message, setMessage] = useState('');
  const [attendanceScreen, setAttendanceScreen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudentId, setLoadingStudentId] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [markedStudents, setMarkedStudents] = useState(new Set());
  const warningIntervalRef = useRef(null);

  const camera = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connecting to WebSocket');
      // setMessage('Successfully connected');
    });

    socket.on('connected', () => {
      console.log('Successfully connected');
      // setMessage('Successfully connected');
    });

    socket.on('start', async () => {
      setAttendanceScreen(true);
      // setMessage('Attendance Sheet');
      await fetchStudents();
    });

    socket.on('warn', async () => {
      if (!attendanceScreen) {
        setAttendanceScreen(true);
        await fetchStudents();
      }
      triggerWarning();
    });

    socket.on('stop', () => {
      stopWarning();
      setAttendanceScreen(false);
      // setMessage('');
      setStudents([]);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      stopWarning();
    });

    // Cleanup
    return () => {
      socket.off('connect');
      socket.off('connected');
      socket.off('start');
      socket.off('warn');
      socket.off('stop');
      socket.off('disconnect');
      stopWarning();
    };
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getallStudentsApi();
      if (response?.students) {
        setStudents(response.students);
      } else {
        console.error('Failed to fetch students:', response);
      }
    } catch (error) {
      console.error('Error fetching students:', error.message);
    }
  };

  const triggerWarning = () => {
    // Start blinking the background color
    if (warningIntervalRef.current) {
      clearInterval(warningIntervalRef.current);
    }

    warningIntervalRef.current = setInterval(() => {
      setBackgroundColor(prevColor =>
        prevColor === 'white' ? 'yellow' : 'white',
      );
    }, 1000);
  };

  const stopWarning = () => {
    // Stop blinking and reset the background color
    if (warningIntervalRef.current) {
      clearInterval(warningIntervalRef.current);
      warningIntervalRef.current = null;
    }
    setBackgroundColor('white');
  };

  const showToast = (msg, type) => {
    Toast.show({
      type: type,
      text1: 'Attendance',
      text2: msg,
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const takePhoto = async item => {
    // Check if attendance already marked
    if (markedStudents.has(item._id)) {
      showToast(`Attendance already marked for student: ${item.name}`, 'error');
      return;
    }

    setLoadingStudentId(item._id);
    try {
      if (!camera.current) {
        console.error('Camera reference not available.', camera);
        return;
      }

      const photo = await camera.current.takePhoto();
      if (photo) {
        const base64Image = await convertFileToBase64(photo.path, 600);
        const size = getBase64ImageSize(base64Image);
        console.log('Photo size:', size);
        await markAttendanceApi(item._id, base64Image);

        // Update marked students state
        setMarkedStudents(prevMarked => new Set([...prevMarked, item._id]));

        showToast(
          `Attendance marked successfully for student: ${item.name}`,
          'success',
        );
      } else {
        console.error('Photo captured is undefined or empty.');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      showToast(`Error marking attendance for student: ${item.name}`, 'error');
    } finally {
      setLoadingStudentId(null);
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
    <View style={styles.root}>
      <View style={[styles.warningContainer, {backgroundColor}]} />

      <View style={styles.mainContent}>
        {!attendanceScreen && !students.length && (
          <Image source={defaultImage} style={styles.defaultImage} />
        )}

        {attendanceScreen && (
          <>
            <Text style={styles.text}>Attendance Sheet</Text>
            <FlatList
              data={students}
              renderItem={renderStudent}
              keyExtractor={item => item._id}
              numColumns={3}
              columnWrapperStyle={styles.row}
              keyboardShouldPersistTaps="handled"
            />
          </>
        )}
      </View>

      <MyCamera capturedPhoto={null} setCapturedPhoto={null} camera={camera} />
    </View>
  );
};

const getStyles = isDarkMode =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    warningContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
    },
    mainContent: {
      flex: 1,
      zIndex: 1,
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
      marginTop: 100,
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
