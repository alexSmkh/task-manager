import React, { useEffect, useState } from 'react';
import KanbanBoard from '@asseinfo/react-kanban';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Task from 'components/Task';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import ColumnHeader from 'components/ColumnHeader';

import TaskPresenter from 'presenters/TaskPresenter';

import useTasks from 'hooks/store/useTasks';

import useStyles from './useStyles';

const MODES = {
  ADD: 'add',
  NONE: 'none',
};

function TaskBoard() {
  const { board, loadBoard, loadMore, createTask, updateTask, destroyTask, loadTask, dragTask } = useTasks();
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);
  const styles = useStyles();

  useEffect(() => {
    loadBoard();
  }, []);

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
  };

  const handleOpenEditPopup = (task) => {
    setOpenedTaskId(task.id);
    setMode(MODES.EDIT);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
    setOpenedTaskId(null);
  };

  const loadColumnMore = (state, page = 1, perPage = 10) => loadMore(state, page, perPage);

  const handleCardDragEnd = (task, source, destination) => {
    dragTask(task, source, destination).catch((error) => {
      // eslint-disable-next-line no-alert
      alert(`Move failed! ${error.message}`);
    });
  };

  const handleTaskCreate = (task) => {
    handleClose();
    return createTask(task);
  };

  const handleTaskUpdate = (task) => {
    handleClose();
    return updateTask(TaskPresenter.id(task), task);
  };

  const handleTaskDestroy = (task) => {
    handleClose();
    return destroyTask(task);
  };

  const handleTaskLoad = (taskId) => loadTask(taskId);

  return (
    <>
      <Fab onClick={handleOpenAddPopup} className={styles.addButton} color="primary" aria-label="add">
        <AddIcon />
      </Fab>

      <KanbanBoard
        disableColumnDrag
        onCardDragEnd={handleCardDragEnd}
        renderCard={(card) => <Task onClick={handleOpenEditPopup} task={card} />}
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
      >
        {board}
      </KanbanBoard>

      {mode === MODES.ADD && <AddPopup onCreateCard={handleTaskCreate} onClose={handleClose} />}
      {mode === MODES.EDIT && (
        <EditPopup
          onLoadCard={handleTaskLoad}
          onCardDestroy={handleTaskDestroy}
          onCardUpdate={handleTaskUpdate}
          onClose={handleClose}
          cardId={openedTaskId}
        />
      )}
    </>
  );
}

export default TaskBoard;
