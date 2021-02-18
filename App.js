import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as firebase from "firebase";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEI8ZWvNvZRS6946s4QFXKsG4cXCs70yk",
  authDomain: "instagram-dev-be562.firebaseapp.com",
  projectId: "instagram-dev-be562",
  storageBucket: "instagram-dev-be562.appspot.com",
  messagingSenderId: "1050074457049",
  appId: "1:1050074457049:web:7dd2e73539aada93032fc8",
  measurementId: "G-3KVM2BH1T7",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }

  render() {
    const { loggedIn, loaded } = this.state;

    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Loading</Text>
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text>User is logged in</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default App;
