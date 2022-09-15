import { useSelector } from 'react-redux';

import { useTasksActions } from 'slices/TasksSlice';

import TaskPresenter, { STATES } from 'presenters/TaskPresenter';
import TasksRepository from 'repositories/TasksRepository';
import TaskForm from 'forms/TaskForm';

const useTasks = () => {
  const board = useSelector((state) => state.TasksSlice.board);
  const { loadColumn, loadMore } = useTasksActions();

  const loadBoard = () => Promise.all(STATES.map(({ key }) => loadColumn(key)));

  const createTask = (attrs) => {
    const permittedAttrs = TaskForm.attributesToSubmit(attrs);
    return TasksRepository.create(permittedAttrs).then(({ data: { task } }) => {
      loadColumn(TaskPresenter.state(task));
    });
  };

  const updateTask = (taskId, attrs) => {
    const permittedAttrs = TaskForm.attributesToSubmit(attrs);
    return TasksRepository.update(taskId, permittedAttrs).then(({ data: { task } }) => {
      loadColumn(TaskPresenter.state(task));
    });
  };

  const destroyTask = (task) =>
    TasksRepository.destroy(TaskPresenter.id(task)).then(() => {
      loadColumn(TaskPresenter.state(task));
    });

  const loadTask = (id) => TasksRepository.show(id).then(({ data: { task } }) => task);

  const dragTask = (task, source, destination) => {
    const transition = TaskPresenter.transitions.find(({ to }) => destination.toColumnId === to);

    if (!transition) return null;

    return TasksRepository.update(TaskPresenter.id(task), { stateEvent: transition.event }).then(() => {
      loadColumn(destination.toColumnId);
      loadColumn(source.fromColumnId);
    });
  };

  return {
    board,
    loadBoard,
    loadMore,
    loadTask,
    createTask,
    updateTask,
    destroyTask,
    dragTask,
  };
};

export default useTasks;
