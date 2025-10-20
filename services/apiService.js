import { ref, get, set, onValue, off } from "firebase/database";
import { db } from "@/firebase";

let activeSubscriptions = {};

export const apiService = {
  async getServerDetails(serverName) {
    if (!serverName) return null;
    try {
      const serverRef = ref(db, `${serverName}`);
      const snapshot = await get(serverRef);
      const data = snapshot.val();

      if (!data) {
        console.error(
          `Firebase'de "${serverName}" anahtarı için veri bulunamadı.`
        );
        return null;
      }

      return {
        STREAMERS: data.STREAMERS || { twitch: [], kick: [] },
        SPONSORED_STREAMER: data.SPONSORED_STREAMER || "",
        BACKGROUND: data.BACKGROUND,
        NAME: data.NAME || serverName,
        LOGO: data.LOGO,
        CODE: data.CODE,
      };
    } catch (error) {
      console.error(`Sunucu detayları alınırken hata (${serverName}):`, error);
      return null;
    }
  },

  async getServerInfo(serverName) {
    try {
      if (activeSubscriptions[serverName]) {
        off(activeSubscriptions[serverName]);
        delete activeSubscriptions[serverName];
      }

      const serverRef = ref(db, `${serverName}`);
      const snapshot = await get(serverRef);
      const data = snapshot.val();

      if (!data) return null;

      activeSubscriptions[serverName] = serverRef;

      return {
        STREAMERS: data.STREAMERS || { twitch: [], kick: [] },
        SPONSORED_STREAMER: data.SPONSORED_STREAMER || "",
        BACKGROUND: data.BACKGROUND,
        NAME: data.NAME,
        LOGO: data.LOGO,
        CODE: data.CODE,
        ANNOUNCEMENT: data.ANNOUNCEMENT,
        CONTACTS: data.CONTACTS || [],
        VIEW: data.VIEW || 0,
        POLL: data.POLL || false,
      };
    } catch (error) {
      console.error("Error fetching server info:", error);
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

  cleanup(serverName) {
    if (activeSubscriptions[serverName]) {
      off(activeSubscriptions[serverName]);
      delete activeSubscriptions[serverName];
    }
  },

  async updateServerInfo(serverName, data) {
    try {
      const serverRef = ref(db, `${serverName}`);
      await set(serverRef, data);
      return true;
    } catch (error) {
      console.error("Error updating server info:", error);
      return false;
    }
  },

  subscribeToServer(serverName, callback) {
    const serverRef = ref(db, `${serverName}`);
    const unsubscribe = onValue(serverRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback({
          STREAMERS: data.STREAMERS || { twitch: [], kick: [] },
          SPONSORED_STREAMER: data.SPONSORED_STREAMER || "",
          ANNOUNCEMENT: data.ANNOUNCEMENT,
          CONTACTS: data.CONTACTS || [],
          BACKGROUND: data.BACKGROUND,
          POLL: data.POLL || false,
          VIEW: data.VIEW || 0,
          LOGO: data.LOGO,
          CODE: data.CODE,
          NAME: data.NAME,
        });
      }
    });

    return unsubscribe;
  },

  watchServerChanges(serverName, onChange) {
    const serverRef = ref(db, `${serverName}`);

    const unsubscribe = onValue(
      serverRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        onChange({
          STREAMERS: data.STREAMERS || { twitch: [], kick: [] },
          SPONSORED_STREAMER: data.SPONSORED_STREAMER || "",
          ANNOUNCEMENT: data.ANNOUNCEMENT,
          CONTACTS: data.CONTACTS || [],
          BACKGROUND: data.BACKGROUND,
          POLL: data.POLL || false,
          VIEW: data.VIEW || 0,
          LOGO: data.LOGO,
          CODE: data.CODE,
          NAME: data.NAME,
        });
      },
      (error) => {
        console.error("Error watching server changes:", error);
      }
    );

    return () => {
      off(serverRef);
      unsubscribe();
    };
  },

  async sendMessage(serverName, message) {
    try {
      const contactsRef = ref(db, `${serverName}/CONTACTS`);
      const snapshot = await get(contactsRef);
      const contacts = snapshot.val() || {};

      const nextIndex = Object.keys(contacts).length;

      await set(ref(db, `${serverName}/CONTACTS/${nextIndex}`), {
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

    return () => {
      off(pollRef);
      unsubscribe();
    };
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
      const pollRef = ref(db, `${serverName}/POLL/votes/${userId}`);
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
      await set(pollRef, null);
      return true;
    } catch (error) {
      console.error("Error deleting poll:", error);
      return false;
    }
  },
};
