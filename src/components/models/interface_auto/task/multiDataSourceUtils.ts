export const getDsTypeName = (dsType: string) => {
  switch (dsType) {
    case '1':
      return '场景';
    case '2':
      return '基础数据';
    case '3':
      return '自定义数据';
    case '4':
      return '基于事件生成';
    default:
      return '未知数据源类型';
  }
};

export const getDependType = (dsType: string) => {
  switch (dsType) {
    case '1':
      return 'scene';
    case '2':
      return 'cache';
    case '3':
      return 'custom';
    case '4':
      return 'event';
    default:
      return 'unknown';
  }
};

export const getActionMap = (sceneList: SceneInfo[], currentActionId: string) => {
  const actionMap: any = {};
  sceneList.forEach((scene: any) => {
    scene.actionList.forEach((action: any) => {
      if (action.actionId === currentActionId) {
        const actionIdx = scene.actionList.findIndex((action: any) => action.actionId === currentActionId);
        actionMap[scene.sceneId] = scene.actionList.slice(0, actionIdx).map((action: any) => ({
          actionId: action.actionId,
          actionName: action.actionName
        }));
        return;
      }
    });
    if (!actionMap[scene.sceneId]) {
      actionMap[scene.sceneId] = scene.actionList.map((action: any) => ({
        actionId: action.actionId,
        actionName: action.actionName
      }));
    }
  });
  return actionMap;
};
