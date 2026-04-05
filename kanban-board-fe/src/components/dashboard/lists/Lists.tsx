import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { projectListMove, projectTaskMove } from '../../../redux/actions/projectActions';
import './draggingStyles.css';
import AddInput from '../shared/AddInput';
import ListItem from './ListItem';

const Lists = () => {
  const lists = useAppSelector((state) => state.projectGetData.lists);
  const dispatch = useAppDispatch();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === 'LIST') {
      if (source.index !== destination.index) {
        dispatch(projectListMove(source.index, destination.index));
      }
    } else if (type === 'TASK') {
      const sourceListIdx = parseInt(source.droppableId, 10);
      const destListIdx = parseInt(destination.droppableId, 10);
      if (!lists || isNaN(sourceListIdx) || isNaN(destListIdx)) return;
      const task = lists.lists[sourceListIdx].tasks[source.index];

      if (sourceListIdx === destListIdx) {
        if (source.index !== destination.index) {
          dispatch(
            projectTaskMove(
              { removedIndex: source.index, addedIndex: destination.index },
              sourceListIdx,
              lists.projectId,
              task,
            ),
          );
        }
      } else {
        // Cross-list move: call twice to satisfy projectTaskMove's two-phase design
        dispatch(
          projectTaskMove(
            { removedIndex: source.index, addedIndex: null },
            sourceListIdx,
            lists.projectId,
            task,
          ),
        );
        dispatch(
          projectTaskMove(
            { removedIndex: null, addedIndex: destination.index },
            destListIdx,
            lists.projectId,
            task,
          ),
        );
      }
    }
  };

  return (
    <div
      id='board-container'
      style={{
        maxWidth: '100%',
        display: 'flex',
        marginTop: '2vh',
        overflowX: 'auto',
        padding: '0 4px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='board' direction='horizontal' type='LIST'>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ display: 'flex', alignItems: 'flex-start' }}
              >
                {lists &&
                  lists.lists.length > 0 &&
                  lists.lists.map((list, index) => (
                    <ListItem
                      key={list._id}
                      list={list}
                      index={index}
                      projectId={lists.projectId}
                    />
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <AddInput placeholder='Add new list' />
      </div>
    </div>
  );
};

export default Lists;
