import type { ListItem } from '../types/models';

export const getTaskIndexes = (
  lists: ListItem[],
  taskIndex: number,
  listIndex: number,
  taskId: string,
  callback: (listIndex: number, taskIndex: number) => void
): void => {
  if (
    lists[listIndex] &&
    lists[listIndex].tasks[taskIndex] &&
    lists[listIndex].tasks[taskIndex]._id === taskId
  ) {
    callback(listIndex, taskIndex);
  } else {
    // very rare case in which task or list index would change between updating labels
    let foundTaskIndex = -1;
    const foundListIndex = lists.findIndex((list) => {
      const innerTaskIndex = list.tasks.findIndex(
        (task) => task._id === taskId
      );
      if (innerTaskIndex > -1) {
        foundTaskIndex = innerTaskIndex;
        return true;
      }
      return false;
    });
    if (foundListIndex > -1 && foundTaskIndex > -1) {
      callback(foundListIndex, foundTaskIndex);
    }
  }
};
