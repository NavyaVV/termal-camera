import AsyncStorage from '@react-native-async-storage/async-storage';

export const validateForm = (formData, validationSchema) => {
  const errors = {};

  for (const field in validationSchema) {
    const {label, required, validator} = validationSchema[field];
    const value = formData[field];

    if (required && !value.toString().trim()) {
      errors[field] = `${label} is required`;
    } else if (validator && !validator(value)) {
      errors[field] = `${label} is invalid`;
    }
  }

  return errors;
};

export const saveItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log('Item saved successfully!');
  } catch (error) {
    console.error('Error saving item:', error);
  }
};

export const getItem = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error retrieving value:', error);
    return false;
  }
};

export const formatDateString = dateString => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('default', {month: 'long'});
  const year = date.getFullYear();

  return `${day}, ${month} ${year}`;
};


export function formatDate(date) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const [{ value: year },,{ value: month },,{ value: day }] = formatter.formatToParts(date);
  
  return `${year}-${month}-${day}`;
}