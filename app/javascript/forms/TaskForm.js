import { pick, propOr } from 'ramda';
import TaskPresenter from 'presenters/TaskPresenter';

export default {
  defaultAttributes(attrs) {
    return {
      name: '',
      description: '',
      ...attrs,
    };
  },
  attributesToSubmit(task) {
    const permittedKeys = ['id', 'name', 'description'];

    return {
      ...pick(permittedKeys, task),
      assigneeId: propOr(null, 'id', TaskPresenter.assignee(task)),
      authorId: propOr(null, 'id', TaskPresenter.author(task)),
    };
  },
};
