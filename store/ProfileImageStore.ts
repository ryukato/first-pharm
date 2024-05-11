import AsyncStorage from '@react-native-async-storage/async-storage';

export type ProfileImage = {
  type: 'path' | 'base64';
  value: string;
};

class ProfileImageStore {
  async saveProfileImage(key: string, image: ProfileImage) {
    const jsonValue = JSON.stringify(image);
    await AsyncStorage.setItem(key, jsonValue);
  }

  async getProfileImage(key: string): Promise<ProfileImage | null> {
    const jsonValue = await AsyncStorage.getItem(key);
    if (!jsonValue) {
      return Promise.resolve(null);
    } else {
      return Promise.resolve(JSON.parse(jsonValue));
    }
  }
}

export const profileImageStore = new ProfileImageStore();
