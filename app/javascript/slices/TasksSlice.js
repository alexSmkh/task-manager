import { propEq } from 'ramda';
import { useDispatch } from 'react-redux';
import { createSlice } from '@reduxjs/toolkit';
import { changeColumn } from '@asseinfo/react-kanban';

import TasksRepository from 'repositories/TasksRepository';

import { STATES } from 'presenters/TaskPresenter';

const initialState = {
  board: {
    columns: STATES.map((column) => ({
      id: column.key,
      title: column.value,
      cards: [],
      meta: {},
    })),
  },
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    loadColumnSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));

      state.board = changeColumn(state.board, column, {
        cards: items,
        meta,
      });

      return state;
    },
    loadColumnMoreSuccess(state, { payload }) {
      const { items, meta, columnId } = payload;
      const column = state.board.columns.find(propEq('id', columnId));

      state.board = changeColumn(state.board, column, {
        cards: [...column.cards, ...items],
        meta,
      });

      return state;
    },
  },
});

const { loadColumnSuccess, loadColumnMoreSuccess } = tasksSlice.actions;

export const useTasksActions = () => {
  const dispatch = useDispatch();

  const loadColumn = (state, reducer = loadColumnSuccess, page = 1, perPage = 10) => {
    TasksRepository.index({
      q: { stateEq: state, s: 'created_at DESC' },
      page,
      perPage,
    }).then(({ data }) => {
      dispatch(reducer({ ...data, columnId: state }));
    });
  };

  const loadBoard = () => STATES.map(({ key }) => loadColumn(key));

  const loadMore = (state, page, perPage) => loadColumn(state, loadColumnMoreSuccess, page, perPage);

  return {
    loadBoard,
    loadColumn,
    loadMore,
  };
};

export default tasksSlice.reducer;
