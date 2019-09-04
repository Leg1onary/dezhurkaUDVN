import React from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

import { ReactDadata } from 'react-dadata';
import TextField from "@material-ui/core/TextField";
import StepButton from "@material-ui/core/StepButton";
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
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
});

function getSteps() {
    return ['Причина проведения работ', 'Адрес установки камер', 'Завершение'];
}

let CMS_DATA = {
    description: '',
    address: '',
    internet: '',
    cameras: {
        sn: '',
        model: ''
    },
    orgName: '',
    orgILS: '',
    orgEmail: '',
    contacts: {
        fio: '',
        telephone: ''
    }

}

function getStepContent(step) {
    switch (step) {

        case 0:
            return (
                <TextField
                    id="outlined-full-width"
                    style={{ margin: 8 }}
                    placeholder="Краткое описание проблемы..."
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={event => CMS_DATA.description = event.currentTarget.value}
                />
            );
        case 1:
            return (
                <ReactDadata token={API_KEY_DADATA} onChange={event => CMS_DATA.address = event.value}/>
            );
        case 2:
            return (
                `Данные для CMS успешно сформированы.`
            );
        default:
            return 'Unknown step';
    }
}

function CmsBlock(props) {

    const { classes } = props;

    /* STEPS */
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState({});
    const steps = getSteps();

    function totalSteps() {
        return steps.length;
    }

    function completedSteps() {
        return Object.keys(completed).length;
    }

    function isLastStep() {
        return activeStep === totalSteps() - 1;
    }

    function allStepsCompleted() {
        return completedSteps() === totalSteps();
    }

    function handleNext() {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                  // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    }

    function handleBack() {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    const handleStep = step => () => {
        setActiveStep(step);
    };

    function handleComplete() {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    }

    function handleReset() {
        setActiveStep(0);
        setCompleted({});
    }

    return (
        <div id="CmsBlockCreate">
            <div className={classes.root}>
                <Stepper nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepButton onClick={handleStep(index)} completed={completed[index]}>
                                {label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                <div>
                    {allStepsCompleted() ? (
                        <div>
                            <Typography className={classes.instructions}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Button onClick={handleReset}>Reset</Button>
                        </div>
                    ) : (
                        <div>
                            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                            <div>
                                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className={classes.button}
                                >
                                    Next
                                </Button>
                                {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                    <Typography variant="caption">
                                        Step {activeStep + 1} already completed
                                    </Typography>
                                ) : (
                                    <Button variant="contained" color="primary" onClick={handleComplete}>
                                        {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
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
        instructions: PropTypes.string.isRequired
    }).isRequired
};

export default withStyles(styles)(CmsBlock);