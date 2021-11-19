/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import jwt_decode from 'jwt-decode';
import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, DataTable} from 'react-native-paper';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import QRCodeScanner from 'react-native-qrcode-scanner';

const Login = ({navigation}) => {
  const [roll, setRoll] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('jwt', (error, result) => {
      if (result && result.startsWith('Bearer')) navigation.navigate('Home');
    });
  }, []);
  return (
    <SafeAreaView style={styles.loginContainer}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Roll no"
          onChangeText={roll => setRoll(roll)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={password => setPassword(password)}
        />
      </View>
      <Button
        style={styles.loginButton}
        mode="contained"
        labelStyle={styles.loginButtonLabel}
        onPress={() => {
          if (roll.length === 0 || password.length === 0) {
            ToastAndroid.show(
              'Roll no, password cannot be empty.',
              ToastAndroid.SHORT,
            );
            return;
          }
          fetch(`${process.env.PROJECT_BACKEND}/student/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({student: {roll: roll, password: password}}),
          })
            .then(res => res.json())
            .then(jwt => AsyncStorage.setItem('jwt', jwt.jwt))
            .then(() => navigation.navigate('Home'))
            .catch(error => {
              ToastAndroid.show(error.message, ToastAndroid.LONG);
            });
        }}>
        Login
      </Button>
    </SafeAreaView>
  );
};

const QRScanner = ({navigation}) => (
  <SafeAreaView style={styles.qrscanner}>
    <QRCodeScanner
      onRead={e => {
        if (e.data.startsWith('attendance ')) {
          AsyncStorage.getItem('jwt', (error, result) =>
            fetch(`${process.env.PROJECT_BACKEND}/attendance`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: result,
              },
              body: JSON.stringify({
                attendance: {
                  lecture: e.data.substring(11),
                },
              }),
            })
              .then(
                res =>
                  res.status === 201 &&
                  ToastAndroid.show('Attendance marked', ToastAndroid.SHORT),
              )
              .then(() => navigation.navigate('Home')),
          );
        } else {
          ToastAndroid.show('Invalid QR', ToastAndroid.SHORT);
          navigation.navigate('Home');
        }
      }}
    />
  </SafeAreaView>
);

const Home = ({navigation}) => {
  const [status, setStatus] = useState([]);
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  disableBackButton = () => {
    BackHandler.exitApp();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', disableBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', disableBackButton);
    };
  }, []);

  AsyncStorage.getItem('jwt', (error, result) =>
    setName(jwt_decode(result.substring(7)).name),
  );
  AsyncStorage.getItem('jwt', (error, result) =>
    setRoll(jwt_decode(result.substring(7)).roll),
  );
  useEffect(() => {
    return navigation.addListener('focus', () => {
      AsyncStorage.getItem('jwt', (error, result) =>
        fetch(`${process.env.PROJECT_BACKEND}/student/status`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: result,
          },
        })
          .then(res => res.json())
          .then(r => setStatus(r))
          .catch(error => console.log('ERROR ' + error)),
      );
    });
  }, [navigation]);
  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.headline}>
        {name} ({roll})
      </Text>
      <View style={styles.container}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Subject</DataTable.Title>
            <DataTable.Title>Attendance</DataTable.Title>
            <DataTable.Title>Percent</DataTable.Title>
          </DataTable.Header>

          {status.map((sub, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{sub.subject}</DataTable.Cell>
              <DataTable.Cell>
                {sub.attended}/{sub.total}
              </DataTable.Cell>
              <DataTable.Cell>{sub.percentage}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
      <Button
        style={styles.attendanceButton}
        mode="contained"
        labelStyle={styles.attendanceButtonLabel}
        onPress={() => {
          navigation.navigate('QRScanner');
        }}>
        +
      </Button>
      <Button
        style={styles.logoutButton}
        mode="contained"
        color="cyan"
        onPress={() => {
          AsyncStorage.removeItem('jwt');
          navigation.navigate('Login');
        }}>
        Logout
      </Button>
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{header: () => null}}
        />
        <Stack.Screen name="QRScanner" component={QRScanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  container: {
    marginTop: 50,
    marginHorizontal: 30,
  },
  header: {fontSize: 28, padding: 10},
  attendanceButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 20,
  },
  attendanceButtonLabel: {
    fontSize: 40,
  },
  logoutButton: {
    borderRadius: 33,
    position: 'absolute',
    left: 0,
    bottom: 0,
    margin: 20,
  },
  loginButton: {
    marginHorizontal: 100,
  },
  loginButtonLabel: {
    fontSize: 18,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  qrscanner: {
    marginTop: 100,
  },
  loginContainer: {marginTop: 100},
  inputView: {
    marginHorizontal: 20,
    height: 45,
    marginBottom: 20,
  },

  TextInput: {
    backgroundColor: 'white',
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  headline: {
    textAlign: 'center',
    color: 'black',
    marginTop: 20,
    fontSize: 20,
  },
});
