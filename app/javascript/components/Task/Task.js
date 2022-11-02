import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardHeader, CardContent, Typography, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import useStyles from './useStyles';
import TaskPresenter from 'presenters/TaskPresenter';

function Task({ task, onClick }) {
  const styles = useStyles();

  const handleClickOnEdit = () => onClick(task);

  const action = (
    <IconButton onClick={handleClickOnEdit}>
      <EditIcon />
    </IconButton>
  );

  return (
    <Card className={styles.root}>
      <CardHeader title={TaskPresenter.name(task)} action={action} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {TaskPresenter.description(task)}
        </Typography>
      </CardContent>
    </Card>
  );
}

Task.propTypes = {
  task: TaskPresenter.shape().isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Task;
