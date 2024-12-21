import React, {useState} from 'react';
import {
  View,
  Button,
  PermissionsAndroid,
  Text,
  Alert,
  Platform,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import axiosInstance from '../../api/AxiosConfig';
import {useRoute} from '@react-navigation/native';
import { FlirCamera } from 'react-native-flir';

const FormScreen = ({navigation}) => {
  const route = useRoute();
  const {id, machine} = route?.params || {};
  console.log(id, machine, 'hjhw');

  const [photoUris, setPhotoUris] = useState([]);
  // const [machine, setMachine] = useState('');
  const [temperature, setTemperature] = useState('');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);



  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'We need access to your camera to take photos.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        setModalVisible(true);  // Proceed after permission
      } else {
        console.log('Camera permission denied');
        Alert.alert('Permission Denied', 'You need to grant camera permissions.');
      }
      
    } catch (err) {
      console.warn(err);
    }
  };

  const launchCameraFunction = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        saveToPhotos: true,
        selectionLimit: 0,
      },
      response => handleImagePickerResponse(response),
    );
  };

  const launchGalleryFunction = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0,
      },
      response => handleImagePickerResponse(response),
    );
  };

  const handleImagePickerResponse = response => {
    if (response.didCancel) {
      console.log('User canceled image picker');
    } else if (response.errorCode) {
      console.log('Image picker error: ', response.errorCode);
    } else {
      const selectedImages = response.assets;
      if (selectedImages.length > 1) {
        Alert.alert('Error', 'You can only select one image at a time.');
        return;
      }

      const newUri = selectedImages[0].uri;
      setPhotoUris([newUri]);
      setModalVisible(false);
    }
  };

  const launchFlirCameraFunction = async () => {
    try {
      const result = await FlirCamera.captureImage();
      if (result.success) {
        const thermalImageUri = result.imageUri;
        setPhotoUris([thermalImageUri]);
      } else {
        console.error('Error capturing image from FLIR camera');
        Alert.alert('Error', 'Failed to capture image from FLIR camera.');
      }
    } catch (error) {
      console.error('Error initializing FLIR camera:', error);
      Alert.alert('Error', 'Could not initialize FLIR camera.');
    }
  };
  

  
  const handleDeleteImage = index => {
    setPhotoUris(prevUris => prevUris.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (photoUris.length === 0) {
      Alert.alert('Error', 'Please upload at least one image.');
      return;
    }
  
    const formattedDate = date.toISOString().split('T')[0];
    const formData = new FormData();
    formData.append('machine', id);
    formData.append('date', formattedDate);
    formData.append('description', description);
    formData.append('temperature', temperature);
    photoUris.forEach((uri, index) => {
      const fileName = uri.split('/').pop();
      formData.append('image', {
        uri,
        type: 'image/jpeg',
        name: fileName,
      });
    });
  
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        'thermal-image/create-machine-image/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      navigation.navigate('MachineHome');
    } catch (error) {
      const errorMessage =
        error?.response?.status === 413
          ? 'The uploaded file is too large. Please reduce the file size and try again.'
          : error?.response?.data?.app_data?.message || 'An error occurred';
      Alert.alert('Submission Failed', errorMessage);
      console.error('Error submitting machine data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setOpenDatePicker(true)}>
          <Text style={{color: '#000'}}>{date.toLocaleDateString()}</Text>
          <Icon name="calendar" size={24} color="#c1c1c1" />
        </TouchableOpacity>

        <Text style={styles.label}>Temperature:</Text>
        <TextInput
          value={temperature}
          onChangeText={setTemperature}
          placeholder="Enter temperature"
          style={styles.input}
          keyboardType="number-pad"
          placeholderTextColor={'#000'}
        />
        <Text style={styles.label}>Description:</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter Description"
          style={[styles.input, styles.multilineInput]}
          placeholderTextColor={'#000'}
        />

        <DatePicker
          modal
          maximumDate={new Date()}
          open={openDatePicker}
          date={date}
          mode="date"
          onConfirm={selectedDate => {
            setOpenDatePicker(false);
            setDate(selectedDate);
          }}
          onCancel={() => {
            setOpenDatePicker(false);
          }}
        />

        <Text style={styles.label}>Upload Image</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={requestCameraPermission}>
          <Image
            source={require('../../assets/gallery.png')}
            style={{height: 40, width: 40}}
          />
        </TouchableOpacity>

        {photoUris.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            <Text style={styles.label}>Selected Image:</Text>
            <View style={styles.imageContainer}>
              <Image source={{uri: photoUris[0]}} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => handleDeleteImage(0)}>
                <Icon name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" /> // Show loading spinner
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
      <Modal
  animationType="slide"
  transparent={true}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Select Image</Text>
      <TouchableOpacity onPress={launchFlirCameraFunction}>
        <Text style={styles.modalOption}>FLIR Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={launchCameraFunction}>
        <Text style={styles.modalOption}>Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={launchGalleryFunction}>
        <Text style={styles.modalOption}>Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <Text style={styles.modalClose}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}>
        <View style={styles.successModalContainer}>
          <View style={styles.successModalContent}>
            <Icon name="checkcircle" size={48} color="#000" />
            <Text style={styles.successModalText}>Submission Successful!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 6,
    fontSize: 16,
    color: '#000',
    // backgroundColor: '#f7f6f2',
    // marginLeft: 20,
    paddingLeft: 20,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    marginTop: 10,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  imagePreviewContainer: {
    marginVertical: 20,
  },
  imageScrollView: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    width: '94%',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  uploadButton: {
    padding: 10,
    borderRadius: 6,
    height: 120,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(162, 162, 162, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalOption: {
    fontSize: 16,
    padding: 10,
    color: 'blue',
  },
  modalClose: {
    fontSize: 16,
    padding: 10,
    color: 'red',
  },
  dateBox: {
    width: '100%',
    height: 48,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    // backgroundColor: '#F5F7F5',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingLeft: 300,
    flexDirection: 'row',
    marginBottom: 20,
  },
  successModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successModalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  successModalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  successModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  multilineInput: {
    height: 85,
    textAlignVertical: 'top',
  },
});

export default FormScreen;
