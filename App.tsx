import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import AppStack from './src/route/AppStack';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}> 
        <AppStack />
    </QueryClientProvider>
  );
};

export default App;



// // import React, { useState } from 'react';
// // import { Dimensions, View, Button, SafeAreaView } from 'react-native';
// // import { useFlir, FlirCameraView } from 'react-native-flir';
// // const useStream = () => {
// //   const [streaming, setStreaming] = useState(false);

// //   return {
// //     active: streaming,
// //     start: () => setStreaming(true),
// //     stop: () => setStreaming(false),
// //   };
// // };

// // const useThermal = () => {
// //   const [thermal, setThermal] = useState(false);

// //   return {
// //     active: thermal,
// //     enable: () => setThermal(true),
// //     disable: () => setThermal(false),
// //   };
// // };

// // const { width, height } = Dimensions.get('window');

// // const App = () => {
// //   const {
// //     scanning,
// //     connected,
// //     streaming,
// //     device,
// //     start,
// //     stop,
// //     connect,
// //     disconnect,
// //   } = useFlir();
// //   const stream = useStream();
// //   const thermal = useThermal();

// //   return (
// //     <SafeAreaView style={{ flex: 1 }}>
// //       {!streaming && !connected && !scanning && (
// //         <Button title="Scan For Devices" onPress={start} color={'green'} />
// //       )}
// //       {!streaming && !connected && scanning && (
// //         <Button
// //           title="Stop Scanning For Devices"
// //           onPress={stop}
// //           color={'red'}
// //         />
// //       )}
// //       {!streaming && !connected && scanning && device && (
// //         <Button title={`Connect ${device}`} onPress={connect} color={'green'} />
// //       )}
// //       {!streaming && connected && (
// //         <Button
// //           title={`Disconnect ${device}`}
// //           onPress={disconnect}
// //           color={'red'}
// //         />
// //       )}
// //       {!streaming && connected && (
// //         <Button
// //           title="Start Streaming"
// //           onPress={stream.start}
// //           color={'green'}
// //         />
// //       )}
// //       {streaming && connected && (
// //         <Button title="Stop Streaming" onPress={stream.stop} color={'red'} />
// //       )}
// //       {streaming && connected && (
// //         <Button
// //           title={thermal.active ? 'Disable Thermal' : 'Enable Thermal'}
// //           onPress={thermal.active ? thermal.disable : thermal.enable}
// //           color={thermal.active ? 'red' : 'green'}
// //         />
// //       )}
// //       <View style={{ opacity: streaming ? 1 : 0 }}>
// //         <FlirCameraView
// //           stream={stream.active}
// //           thermal={thermal.active}
// //           width={width}
// //           height={height / 1.5}
// //         />
// //       </View>
// //     </SafeAreaView>
// //   );
// // };

// // export default App



// import React, { useState, useEffect } from 'react';
// import { Dimensions, View, Button, SafeAreaView, Text } from 'react-native';
// import { FlirCameraView } from 'react-native-flir';

// const { width, height } = Dimensions.get('window');

// const App = () => {
//   const [streaming, setStreaming] = useState(false);
//   const [connected, setConnected] = useState(false);

//   const handleConnect = () => {
//     // Here, you should check if a thermal camera device is available
//     // and set 'connected' to true based on that.
//     setConnected(true);
//   };

//   const handleDisconnect = () => {
//     setConnected(false);
//   };

//   const handleStartStreaming = () => {
//     setStreaming(true);
//   };

//   const handleStopStreaming = () => {
//     setStreaming(false);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       {!streaming && !connected && (
//         <Button title="Connect Device" onPress={handleConnect} color={'green'} />
//       )}
//       {connected && !streaming && (
//         <Button title="Start Streaming" onPress={handleStartStreaming} color={'green'} />
//       )}
//       {streaming && (
//         <Button title="Stop Streaming" onPress={handleStopStreaming} color={'red'} />
//       )}

//       {streaming && connected ? (
//         <FlirCameraView
//           stream={streaming}
//           width={width}
//           height={height / 1.5}
//           thermal={true}
//         />
//       ) : (
//         <Text style={{ textAlign: 'center', marginTop: 20 }}>
//           Please connect the thermal camera and start streaming.
//         </Text>
//       )}
//     </SafeAreaView>
//   );
// };

// export default App;
