import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Layout from '../components/Layout';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  return (
    <Layout>
      <View style={styles.content}>
        <Text style={styles.title}>Профиль</Text>
        <View style={styles.profileInfo}>
          <Text style={styles.label}>Имя:</Text>
          <Text style={styles.value}>Пользователь</Text>
          
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>user@example.com</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  profileInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 