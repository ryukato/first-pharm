import { useSession, useUser } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from '@rneui/base';
import * as ImagePicker from 'expo-image-picker';
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';

import { profileImageStore } from '~/store/ProfileImageStore';
import { isIPhoneX } from '~/utils/device';

const Profile: React.FC = () => {
  const { user } = useUser();
  const { session } = useSession();

  // states
  const [username, setUsername] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  // const [phonenumber, setPhonenumber] = useState<string | null>(null);
  const [secondaryEmailAddress, setSecondaryEmailAddress] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useMemo(async () => {
    if (session?.user.username) {
      setUsername(session?.user.username);
    }
    if (session?.user.firstName && session.user.lastName) {
      setLastName(session?.user.lastName);
      setFirstName(session?.user.firstName);
    }
    // if (session?.user.primaryPhoneNumber) {
    //   setPhonenumber(session!.user.primaryPhoneNumber.phoneNumber);
    // }

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
    if (!username || !firstName || !lastName) {
      return;
    }
    try {
      setIsUpdating(true);
      await user?.update({
        username,
        firstName,
        lastName,
      });
      alert('Profile is updated');
    } catch (error: any) {
      console.error('Fail to update user, error', JSON.stringify(error));
    } finally {
      setIsUpdating(false);
    }
  };

  // const onLogoutPress = async () => {
  //   if (!session?.status === 'active') {
  //     console.debug('user session is not active');
  //     return;
  //   }
  //   await signOut();
  // };

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAwareScrollView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
          <View>
            <TouchableOpacity onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <Ionicons name="person-circle-outline" size={150} style={styles.image} />
              )}
            </TouchableOpacity>
            <View style={{ padding: 10, alignSelf: 'center' }}>
              <TextInput
                readOnly
                value={secondaryEmailAddress}
                style={styles.input}
                autoCapitalize="none"
                placeholder="email address"
              />
            </View>
            <View style={styles.inputContainer}>
              {username ? <Text style={styles.label}>User name</Text> : null}
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder="user name"
                value={username}
                autoCompleteType="name"
                disabled={isUpdating}
                onChangeText={setUsername}
              />
            </View>
            <View style={styles.inputContainer}>
              {lastName ? <Text style={styles.label}>Last name</Text> : null}
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder="last name"
                value={lastName}
                autoCompleteType="name"
                disabled={isUpdating}
                onChangeText={setLastName}
              />
            </View>
            <View style={styles.inputContainer}>
              {firstName ? <Text style={styles.label}>First name</Text> : null}
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder="Fist name"
                value={firstName}
                autoCompleteType="name"
                disabled={isUpdating}
                onChangeText={setFirstName}
              />
            </View>
            {/* <View style={styles.inputContainer}> */}
            {/*   {phonenumber ? <Text style={styles.label}>phone number</Text> : null} */}
            {/*   <TextInput */}
            {/*     style={styles.input} */}
            {/*     autoCapitalize="none" */}
            {/*     placeholder="phone number" */}
            {/*     value={phonenumber} */}
            {/*     autoCompleteType="phonenumber" */}
            {/*     disabled={isUpdating} */}
            {/*     keyboardType="phone-pad" */}
            {/*     onChangeText={setPhonenumber} */}
            {/*   /> */}
            {/* </View> */}
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View style={styles.buttonContainer}>
        <Button
          onPress={onUpdateProfilePress}
          loading={isUpdating}
          title="Save"
          icon={{
            name: 'save',
            type: 'ionicons',
            size: 25,
            color: 'white',
          }}
          iconContainerStyle={{ marginRight: 10 }}
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            backgroundColor: 'rgba(90, 154, 230, 1)',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 30,
          }}
          containerStyle={{
            width: '100%',
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
  buttonContainer: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    bottom: 50,
    backgroundColor: 'white',
    paddingVertical: 8,
    marginBottom: isIPhoneX() ? 16 : 0,
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
