import React, { useState, useEffect } from 'react';
import KanbanBoard from '@asseinfo/react-kanban';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { propOr } from 'ramda';

import Task from 'components/Task';
import ColumnHeader from 'components/ColumnHeader';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import TasksRepository from 'repositories/TasksRepository';
import TaskForm from 'forms/TaskForm';
import useStyles from './useStyles';
import TaskPresenter from 'presenters/TaskPresenter';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

const MODES = {
  ADD: 'add',
  NONE: 'none',
  EDIT: 'edit',
};

const initialBoard = {
  columns: STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {},
  })),
};

function TaskBoard() {
  const styles = useStyles();
  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState({});
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenTaskId] = useState(null);

  const loadColumn = (state, page, perPage) =>
    TasksRepository.index({ q: { stateEq: state, s: 'created_at DESC' }, page, perPage });

  const loadColumnMore = (state, page, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: { cards: [...prevState[state].cards, ...data.items], meta: data.meta },
      }));
    });
  };

  const loadColumnInitial = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: { cards: data.items, meta: data.meta },
      }));
    });
  };

  const generateBoard = () => {
    setBoard({
      columns: STATES.map(({ key, value }) => ({
        id: key,
        title: value,
        cards: propOr({}, 'cards', boardCards[key]),
        meta: propOr({}, 'meta', boardCards[key]),
      })),
    });
  };

  const loadBoard = () => STATES.forEach(({ key }) => loadColumnInitial(key));

  useEffect(() => loadBoard(), []);

  useEffect(() => generateBoard(), [boardCards]);

  const handleCardDragEnd = (task, source, destination) => {
    const transition = TaskPresenter.transitions(task).find(({ to }) => destination.toColumnId === to);

    if (!transition) return null;

    return TasksRepository.update(task.id, { stateEvent: transition.event })
      .then(() => {
        loadColumnInitial(destination.toColumnId);
        loadColumnInitial(source.fromColumnId);
      })
      .catch((error) => {
        // eslint-disable-next-line no-alert
        alert(`Move failed! ${error.message}`);
      });
  };

  const handleOpenAddPopup = () => setMode(MODES.ADD);

  const handleOpenEditPopup = (task) => {
    setOpenTaskId(TaskPresenter.id(task));
    setMode(MODES.EDIT);
  };

  const handleCloseAddPopup = () => setMode(MODES.NONE);

  const handleCloseEditPopup = () => {
    setMode(MODES.NONE);
    setOpenTaskId(null);
  };

  const handleTaskCreate = (params) => {
    const attrs = TaskForm.attributesToSubmit(params);

    return TasksRepository.create(attrs).then(({ data: { task } }) => {
      loadColumnInitial(TaskPresenter.state(task));
      handleCloseAddPopup();
    });
  };

  const loadTask = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleTaskUpdate = (task) => {
    const attrs = TaskForm.attributesToSubmit(task);

    return TasksRepository.update(TaskPresenter.id(task), attrs).then(() => {
      loadColumnInitial(TaskPresenter.state(task));
      handleCloseAddPopup();
    });
  };

  const handleTaskDestroy = (task) =>
    TasksRepository.destroy(TaskPresenter.id(task)).then(() => {
      loadColumnInitial(TaskPresenter.state(task));
      handleCloseEditPopup();
    });

  const renderCard = (card) => <Task onClick={handleOpenEditPopup} task={card} />;

  const renderColumnHeader = (column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />;

  return (
    <>
      <KanbanBoard
        renderCard={renderCard}
        renderColumnHeader={renderColumnHeader}
        onCardDragEnd={handleCardDragEnd}
        disableColumnDrag
      >
        {board}
      </KanbanBoard>
      <Fab className={styles.addButton} onClick={handleOpenAddPopup} color="primary" aria-label="add">
        <AddIcon />
      </Fab>
      {mode === MODES.ADD && <AddPopup onCreateCard={handleTaskCreate} onClose={handleCloseAddPopup} />}
      {mode === MODES.EDIT && (
        <EditPopup
          onLoadCard={loadTask}
          onCardDestroy={handleTaskDestroy}
          onCardUpdate={handleTaskUpdate}
          onClose={handleCloseEditPopup}
          cardId={openedTaskId}
        />
      )}
    </>
  );
}

export default TaskBoard;
