import { useAuth, useSession, useUser } from '@clerk/clerk-expo';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const Profile: React.FC = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { session, isSignedIn } = useSession();

  // states
  const [username, setUsername] = useState<string | null>(null);
  const [phonenumber, setPhonenumber] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  useMemo(() => {
    if (session?.user.username) {
      setUsername(session?.user.username);
    }
    if (session?.user.primaryPhoneNumber) {
      setPhonenumber(session!.user.primaryPhoneNumber.phoneNumber);
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
      setImage(result.assets[0].uri);
      const base64Image = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: 'base64',
      });
      console.log(base64Image);
      onProfileImageUpdatePress(base64Image);
    }
  };

  // TODO fix this because of error invalid base64 image
  const onProfileImageUpdatePress = async (base64Image: string | null) => {
    if (!image) {
      return;
    }
    try {
      await user?.setProfileImage({
        file: base64Image,
      });
      alert('Profile image Updated!');
    } catch (error) {
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
      alert('Updated!');
    } catch (error: any) {
      console.error('Fail to update user, error', error);
    }
  };

  const onLogoutPress = async () => {
    if (!session?.user.username) {
      return;
    }
    await signOut();
  };

  return (
    <View>
      <Text>This is home</Text>
      <Text>isSignedIn: {isSignedIn}</Text>
      <Text>Session id: {session?.id}</Text>
      <Text>Session status: {session?.status}</Text>
      <Text>Userid: {session?.user.id}</Text>
      <Text>User email status: {user?.primaryEmailAddress?.verification.status}</Text>

      <Text>Primary email address: {user?.primaryEmailAddress?.emailAddress}</Text>
      <View>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <TextInput
          style={styles.inputText}
          autoCapitalize="none"
          placeholder="username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.inputText}
          autoCapitalize="none"
          placeholder="phone number"
          value={phonenumber}
          onChangeText={setPhonenumber}
        />
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        <Button title="Update profile" color="#6c47ff" onPress={onUpdateProfilePress} />
        <Button title="Logout" color="#6c47ff" onPress={onLogoutPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#6c47ff',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    margin: 8,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
});

export default Profile;
