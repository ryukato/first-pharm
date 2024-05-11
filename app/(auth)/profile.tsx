import { useAuth, useSession, useUser } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { profileImageStore } from '~/store/ProfileImageStore';

const Profile: React.FC = () => {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const { session } = useSession();

  // states
  const [username, setUsername] = useState<string | null>(null);
  const [phonenumber, setPhonenumber] = useState<string | null>(null);
  const [secondaryEmailAddress, setSecondaryEmailAddress] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  useMemo(async () => {
    if (session?.user.username) {
      setUsername(session?.user.username);
    }
    if (session?.user.firstName && session.user.lastName) {
      setUsername(`${session?.user.lastName} ${session.user.firstName}`);
    }
    if (session?.user.primaryPhoneNumber) {
      setPhonenumber(session!.user.primaryPhoneNumber.phoneNumber);
    }

    const primaryEmailAddress = session?.user.primaryEmailAddress?.emailAddress;
    if (primaryEmailAddress) {
      setSecondaryEmailAddress(primaryEmailAddress);
      const profileImage = await profileImageStore.getProfileImage(primaryEmailAddress);
      if (profileImage) {
        setImage(profileImage.value);
      }
    }
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const imagePath = result.assets[0].uri;
      setImage(imagePath);
      console.log('picked image', imagePath);
      onProfileImageUpdatePress(imagePath);
    }
  };

  const onProfileImageUpdatePress = async (imagePath: string) => {
    console.log('do update profile image');
    if (!imagePath) {
      return;
    }
    try {
      await profileImageStore.saveProfileImage(user!.primaryEmailAddress!.emailAddress, {
        type: 'path',
        value: imagePath,
      });
    } catch (error: any) {
      console.error('Fail to update user, error', JSON.stringify(error));
    }
  };

  const onUpdateProfilePress = async () => {
    if (!username) {
      return;
    }
    try {
      await user?.update({
        username,
      });
      alert('Profile is updated');
    } catch (error: any) {
      console.error('Fail to update user, error', error);
    }
  };

  const onLogoutPress = async () => {
    if (!session?.status === 'active') {
      console.debug('user session is not active');
      return;
    }
    await signOut();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Ionicons name="person-circle-outline" size={150} style={styles.image} />
        )}
      </TouchableOpacity>
      <View style={{ padding: 10 }}>
        {username ? <Text style={styles.label}>email address</Text> : null}
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder="email address"
          value={secondaryEmailAddress}
          onChangeText={secondaryEmailAddress}
        />
      </View>
      <View style={styles.inputContainer}>
        {username ? <Text style={styles.label}>user name</Text> : null}
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder="user name"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        {phonenumber ? <Text style={styles.label}>phone number</Text> : null}
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder="phone number"
          value={phonenumber}
          keyboardType="phone-pad"
          onChangeText={setPhonenumber}
        />
      </View>
      <View style={{ marginTop: 50 }}>
        <Button title="Update profile" color="#6c47ff" onPress={onUpdateProfilePress} />
        <Button title="Logout" color="#6c47ff" onPress={onLogoutPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#DDE1E2',
    backgroundColor: '#fff',
    height: 50,
  },
  inputText: {
    marginVertical: 4,
    height: 50,
    backgroundColor: '#fff',
  },
  button: {
    margin: 8,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 75,
  },
  input: {
    paddingVertical: 3,
    width: '100%',
    fontSize: 16,
    height: 40,
  },
  label: {
    position: 'absolute',
    left: 0,
    top: -1,
    fontSize: 12,
    color: '#B1B8BC',
  },
});

export default Profile;
