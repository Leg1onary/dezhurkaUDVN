import React, {useState} from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NavBar from "../NavBar";

import { ReactDadata } from 'react-dadata';
const API_KEY_DADATA = '06bb5a438e1971e7f6c99d0e32cccc7b11c6da91';

const styles = theme => ({
    root: {
        width: '100%',
    },
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    actionsContainer: {
        marginBottom: theme.spacing(2),
    },
    resetContainer: {
        padding: theme.spacing(3),
    },
});

function getSteps() {
    return ['Причина проведения работ', 'Адрес установки камер', 'Завершение'];
}

function getStepContent(step) {
    switch (step) {

        case 0:
            return `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`;
        case 1:
            return (
                <ReactDadata token={API_KEY_DADATA} placeholder=""/>
            );
        case 2:
            return (`Данные успешно подготовлены для формирования заявки в CMS`);
        default:
            return 'Unknown step';
    }
}

function CmsBlock(props) {
    const { classes } = props;

    /* STEPS */
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    function handleNext() {setActiveStep(prevActiveStep => prevActiveStep + 1);}
    function handleBack() {setActiveStep(prevActiveStep => prevActiveStep - 1);}
    function handleReset() {setActiveStep(0);}

    return (
        <div id="CmsBlockCreate">
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                        <StepContent>
                            <Typography>{getStepContent(index)}</Typography>
                            <div className={classes.actionsContainer}>
                                <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={classes.button}
                                    >
                                        Назад
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}
                                    >
                                        {activeStep === steps.length - 1 ? 'Сформировать' : 'Далее'}
                                    </Button>
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                    <Typography>All steps completed - you&apos;re finished</Typography>
                    <Button onClick={handleReset} className={classes.button}>
                        Сбросить
                    </Button>
                </Paper>
            )}
        </div>
        </div>
    );
}

CmsBlock.propTypes = {
    classes: PropTypes.shape({
        resetContainer: PropTypes.string.isRequired,
        button: PropTypes.string.isRequired,
        actionsContainer: PropTypes.string.isRequired,
        root: PropTypes.string.isRequired,
    }).isRequired
};

export default withStyles(styles)(CmsBlock);