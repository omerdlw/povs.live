import {
  increment,
  onValue,
  update,
  remove,
  push,
  ref,
  get,
  set,
} from "firebase/database";
import { db } from "./firebase";

const _mapServerData = (data) => {
  if (!data) return null;

  return {
    STREAMERS: data.STREAMERS || [],
    ANNOUNCEMENT: data.ANNOUNCEMENT,
    CONTACTS: data.CONTACTS || [],
    BACKGROUND: data.BACKGROUND,
    POLL: data.POLL || false,
    VIEW: data.VIEW || 0,
    LOGO: data.LOGO,
    CODE: data.CODE,
    NAME: data.NAME,
  };
};

export const apiService = {
  async getServerDetails(serverName) {
    if (!serverName) return null;
    try {
      const serverRef = ref(db, `${serverName}`);
      const snapshot = await get(serverRef);
      const data = snapshot.val();

      if (!data) {
        console.error(`No data found for key "${serverName}" in Firebase.`);
        return null;
      }

      return _mapServerData(data);
    } catch (error) {
      console.error(`Sunucu detayları alınırken hata (${serverName}):`, error);
      return null;
    }
  },

  async getServers() {
    try {
      const serversRef = ref(db);
      const snapshot = await get(serversRef);
      const data = snapshot.val();

      if (!data) return [];

      return Object.keys(data).map((key) => ({
        name: data[key].NAME || key,
        code: data[key].CODE || key,
        logo: data[key].LOGO,
      }));
    } catch (error) {
      console.error("Error fetching servers:", error);
      return [];
    }
  },

  async updateServerInfo(serverName, data) {
    try {
      const serverRef = ref(db, `${serverName}`);
      await update(serverRef, data);
      return true;
    } catch (error) {
      console.error("Error updating server info:", error);
      return false;
    }
  },

  watchServerChanges(serverName, onChange) {
    const serverRef = ref(db, `${serverName}`);

    const unsubscribe = onValue(
      serverRef,
      (snapshot) => {
        const data = snapshot.val();
        const mappedData = _mapServerData(data);
        if (mappedData) {
          onChange(mappedData);
        }
      },
      (error) => {
        console.error("Error watching server changes:", error);
      }
    );

    return unsubscribe;
  },

  async sendMessage(serverName, message) {
    try {
      const contactsRef = ref(db, `${serverName}/CONTACTS`);
      await push(contactsRef, {
        message,
        timestamp: Date.now(),
      });
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  },

  watchPoll(serverName, callback) {
    const pollRef = ref(db, `${serverName}/POLL`);
    const unsubscribe = onValue(
      pollRef,
      (snapshot) => {
        const pollData = snapshot.val();
        callback(pollData);
      },
      (error) => {
        console.error("Error watching poll:", error);
        callback(null);
      }
    );

    return unsubscribe;
  },

  async createPoll(serverName, pollData) {
    try {
      const pollRef = ref(db, `${serverName}/POLL`);
      await set(pollRef, {
        question: pollData.question,
        options: pollData.options,
        votes: {},
        created: Date.now(),
      });
      return true;
    } catch (error) {
      console.error("Error creating poll:", error);
      return false;
    }
  },

  async votePoll(serverName, userId, optionIndex) {
    try {
      const pollRef = ref(db, `${serverName}/POLL/VOTES/${userId}`);
      await set(pollRef, optionIndex);
      return true;
    } catch (error) {
      console.error("Error voting in poll:", error);
      return false;
    }
  },

  async deletePoll(serverName) {
    try {
      const pollRef = ref(db, `${serverName}/POLL`);
      await remove(pollRef);
      return true;
    } catch (error) {
      console.error("Error deleting poll:", error);
      return false;
    }
  },

  async incrementView(serverName) {
    try {
      const serverRef = ref(db, `${serverName}`);
      await update(serverRef, {
        VIEW: increment(1),
      });
    } catch (error) {
      console.error("Error incrementing view:", error);
    }
  },
};
