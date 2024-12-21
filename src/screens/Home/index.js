import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import axios from 'axios';
import Add from 'react-native-vector-icons/AntDesign';
import CloseIcon from 'react-native-vector-icons/Ionicons';
import Card from './components/Card';
import {useNavigation, useRoute} from '@react-navigation/native';
import axiosInstance from '../../api/AxiosConfig';

const HomeScreen = () => {
  const route = useRoute();
  const {id, machine} = route.params || {};
  console.log(id, machine, 'idddddd');

  const navigation = useNavigation();
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (route?.params?.newData) {
      setImageList(prevState => [route.params.newData, ...prevState]);
    }
    fetchData();
  }, [route.params?.newData]);

  // Setting custom header with the machine name
  useEffect(() => {
    if (machine) {
      navigation.setOptions({
        headerTitle: machine, // Set the machine name as the title
      });
    }
  }, [machine, navigation]);

  const fetchData = async (page = 1) => {
    if (!id) {
      console.error("Cannot fetch data: 'id' is missing.");
      return;
    }
    setLoading(page === 1);
    try {
      const response = await axiosInstance.get(
        `thermal-image/machine-images/${id}?page=${page}`,
      );
      console.log(response.data?.data, 'resp');
      if (page === 1) {
        setImageList(response?.data?.data || []);
      } else {
        setImageList(prevState => [
          ...prevState,
          ...(response?.data?.data || []),
        ]);
      }

      setPagination(response?.data?.pagination);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (pagination?.has_next_page && !isFetchingMore) {
      setIsFetchingMore(true);
      const nextPage = pagination?.next_page_number;
      fetchData(nextPage);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(1);
  };

  const renderItem = ({item}) => {
    const imageUrl = item?.image;
    return (
      <View style={styles.imageItem}>
        <Card
          machine={item?.machine}
          temperature={item?.temperature}
          date={item?.date}
          image={imageUrl}
          onPress={() => handleCardPress(imageUrl)}
        />
      </View>
    );
  };

  const handleCardPress = imageUrl => {
    setSelectedImage(imageUrl);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  const handleAddPress = () => {
    navigation.navigate('FormScreen', {id: id, machine: machine});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="#000"
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator color={'#000'} />
        ) : imageList.length === 0 ? (
          <Text style={styles.noDataText}>No data found</Text>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={imageList}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingMore ? (
                <ActivityIndicator color="#000" size={'large'} />
              ) : null
            }
          />
        )}
        <TouchableOpacity style={styles.fab} onPress={handleAddPress}>
          <Add name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseModal}>
            <CloseIcon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{uri: selectedImage}}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  imageItem: {
    marginBottom: 5,
    marginTop: 15
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#000',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  modalImage: {
    width: '90%',
    height: '80%',
  },
  noDataText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 30
  },
});

export default HomeScreen;
