import React from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

import * as ErrorImg from '../../images/ErrorImage.png';
import Button from "@material-ui/core/Button";
import * as ROUTES from '../../constants/routes';

const styles = ({
    root: {
        textAlign: 'center',
        height: '100%'
    },
    image: {
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maxWidth: '100%',
        maxHeight: '100%'
    },
});

function NotFoundPage(props) {
    const { classes } = props;
  return (
    <div className={classes.root} id="notFoundPage">
        <img className={classes.image} src={ErrorImg} alt="ErrorImage"/>
        <div>
            <Button variant="contained"
                    color="secondary"
                    style={{ margin: 8 }}
                    href={ROUTES.HOME}
            >
                Вернуться на главную
            </Button>
        </div>
    </div>
  );
}

NotFoundPage.propTypes = {
    classes: PropTypes.shape({
        root: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired
    }).isRequired
};

export default withStyles(styles)(NotFoundPage);
