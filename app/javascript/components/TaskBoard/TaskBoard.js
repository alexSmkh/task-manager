import React, { useState, useEffect } from 'react';
import KanbanBoard from '@asseinfo/react-kanban';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { propOr } from 'ramda';

import Task from 'components/Task';
import ColumnHeader from 'components/ColumnHeader';
import AddPopup from 'components/AddPopup';
import TaskRepository from 'repositories/TaskRepository';
import TaskForm from 'forms/TaskForm';
import useStyles from './useStyles';

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

  const loadColumn = (state, page, perPage) => TaskRepository.index({ q: { stateEq: state }, page, perPage });

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

  const renderCard = (card) => <Task task={card} />;

  const renderColumnHeader = (column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />;

  const handleCardDragEnd = (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);

    if (!transition) return null;

    return TaskRepository.update(task.id, { stateEvent: transition.event })
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

  const handleCloseAddPopup = () => setMode(MODES.NONE);

  const handleTaskCreate = (params) => {
    const attrs = TaskForm.attributesToSubmit(params);

    return TaskRepository.create(attrs).then(({ data: { task } }) => {
      const page = 1;
      const perPage = 10;
      loadColumn(task.state, page, perPage);
      handleCloseAddPopup();
    });
  };

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
    </>
  );
}

export default TaskBoard;
