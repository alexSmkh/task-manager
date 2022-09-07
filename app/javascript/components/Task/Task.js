import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardHeader, CardContent, Typography } from '@material-ui/core';

import useStyles from './useStyles';

function Task({ task }) {
  const styles = useStyles();

  return (
    <Card className={styles.root}>
      <CardHeader title={task.name} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

Task.propTypes = {
  task: PropTypes.shape().isRequired,
};

export default Task;
