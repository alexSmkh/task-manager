import React, { useState, useEffect } from 'react';
import KanbanBoard from '@asseinfo/react-kanban';
import { propOr } from 'ramda';

import Task from 'components/Task';
import ColumnHeader from 'components/ColumnHeader';
import TaskRepository from 'repositories/TaskRepository';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

const initialBoard = {
  columns: STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {},
  })),
};

function TaskBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState({});

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

  return (
    <KanbanBoard renderCard={renderCard} renderColumnHeader={renderColumnHeader} disableColumnDrag>
      {board}
    </KanbanBoard>
  );
}

export default TaskBoard;
