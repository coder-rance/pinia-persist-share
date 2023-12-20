// update local storage
const updateStorage = (storeKey, storage, store) => {
  storage.setItem(storeKey, JSON.stringify(store.$state));
};

export default ({ options, store }) => {
  const enabled = !!(options.persistShare && options.persistShare.enabled);

  if (!enabled) return;

  const storeKey = `@pinia-persist-share#${store.$id}`;
  const storage = localStorage;
  const storageResult = storage.getItem(storeKey);

  // update pinia from local storage
  store.$patch(JSON.parse(storageResult));

  let externalUpdate = false; // flag; aviod update forever
  const channelId = `@pinia-persist-share-channel#${store.$id}`;
  let channel = new BroadcastChannel(channelId);

  channel.onmessage = ({ data }) => {
    externalUpdate = true;
    store.$patch(data);
  };

  // clear event & destroy channel
  const onBeforeunload = () => {
    channel && (channel.onmessage = null, channel, channel.close());
    channel = null;
    window.removeEventListener('beforeunload', onBeforeunload);
  };

  window.addEventListener('beforeunload', onBeforeunload);

  // watch change of this store
  store.$subscribe(() => {
    updateStorage(storeKey, storage, store);

    if (!externalUpdate) {
      const cloneState = JSON.parse(JSON.stringify(store.$state))
      channel.postMessage(cloneState);
    }

    externalUpdate = false;
  });
}