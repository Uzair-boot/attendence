/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import Attendance from './src/Components/attendence/Attendence';
import MyCamera from './src/Components/attendence/Camera';
import Toast from 'react-native-toast-message';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <>
      <SafeAreaView style={backgroundStyle}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}>
          <Attendance />
          {/* <MyCamera /> */}
        </ScrollView>
      </SafeAreaView>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({});

export default App;
