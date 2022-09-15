import PropTypes from 'prop-types';
import PropTypesPresenter from 'utils/PropTypesPresenter';
import UserPresenter from './UserPresenter';

export default new PropTypesPresenter(
  {
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    state: PropTypes.string,
    assignee: UserPresenter.shape(),
    author: UserPresenter.shape(),
    transitions: PropTypes.arrayOf(
      PropTypes.shape({
        event: PropTypes.string,
        from: PropTypes.string,
        to: PropTypes.string,
      }),
    ),
  },
  {},
);
