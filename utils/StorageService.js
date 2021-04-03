

export default function StorageService() {
    async function getItem (key) {
        let item = await AsyncStorage.getItem(key);
        //You'd want to error check for failed JSON parsing...
        return JSON.parse(item);
    }
    async function setItem (key, value) {
        return await AsyncStorage.setItem(key, JSON.stringify(value));
    }
    async function removeItem (key) {
        return await AsyncStorage.removeItem(key);
    }
};