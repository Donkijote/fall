const DEV_LAST_SCENE_STORAGE_KEY = "fall.dev.last-scene.v1";

// Dev-only helper for scene restore during HMR/full reload.
// Remove this module once a dedicated URL/router flow owns navigation state.
export const createDevLastScenePersistence = () => {
  const readInitialSceneId = (
    registeredSceneIds: ReadonlySet<string>,
    fallbackSceneId: string,
  ): string => {
    try {
      const storedSceneId = localStorage.getItem(DEV_LAST_SCENE_STORAGE_KEY);
      if (!storedSceneId) {
        return fallbackSceneId;
      }

      if (!registeredSceneIds.has(storedSceneId)) {
        localStorage.removeItem(DEV_LAST_SCENE_STORAGE_KEY);
        return fallbackSceneId;
      }

      return storedSceneId;
    } catch {
      return fallbackSceneId;
    }
  };

  const onSceneChange = (sceneId: string): void => {
    try {
      localStorage.setItem(DEV_LAST_SCENE_STORAGE_KEY, sceneId);
    } catch {
      // Ignore storage failures in restricted browser modes.
    }
  };

  return {
    readInitialSceneId,
    onSceneChange,
  };
};
