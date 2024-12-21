import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import FormScreen from '../screens/Form/FomeScreen';
import DetailsScreen from '../screens/DetailsScreen/DetailsScreen';
import MachineHome from '../screens/MachineHome/MachineHome';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MachineHome">
        <Stack.Screen
          name="MachineHome"
          component={MachineHome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            title: "Machine List",
          }}
        />
        {/* <Stack.Screen name="FormScreen" component={FormScreen} /> */}
        <Stack.Screen name="FormScreen" component={FormScreen} 
        options={{
            title: "Form",
          }}/>
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
