import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const Header = ({title}) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <LinearGradient
          colors={['#003', '#000']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.gradient}> */}
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.leftContainer}>
            <Icon name="arrowleft" size={24} color="#fff" />
            <Text style={styles.headerText}>{title}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* </LinearGradient> */}
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {},
  gradient: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
