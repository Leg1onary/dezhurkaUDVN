import React from 'react';
import PropTypes from "prop-types";
/*Material UI*/
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from "@material-ui/core/styles/withStyles";
/*KLADR*/
import { ReactDadata } from 'react-dadata';
import {useFirebase} from "../../Firebase";
import TextField from "@material-ui/core/TextField";

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
    active: {
        backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
    completed: {
        backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
        },
});

let CMS_DATA = {
    description: '',
    address: '',
    internet: '',
    cameras: [{
        sn: '',
        model: ''
    }],
    orgInfo: {
        Name: '',
        ILS: '',
        Email: '',
    },
    contacts: [{
        fio: '',
        telephone: ''
    }]
};

function getSteps() {
    return ['Описание проблемы', 'Данные организации', 'Информация по камере(-ам)', 'Интернет', 'Адрес установки камер(-ы)', 'Контактные данные', 'Формирование заявки'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return (
                <div id="Description">
                    <Button onClick={() => console.log(CMS_DATA)}>Click</Button>
                    <TextField
                        id="outlined-full-width"
                        label="Краткое описание проблемы..."
                        style={{ margin: 8 }}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        multiline
                        onChange={event => CMS_DATA.description = event.target.value}
                    />
                </div>
            );
        case 1:
            return (
                <div id="OrganizationInfo">
                    <TextField
                        id="outlined-full-width"
                        label="Название организации"
                        style={{ margin: 8 }}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        multiline
                        onChange={e => CMS_DATA.orgInfo.Name = e.currentTarget.value}
                    />
                    <TextField
                        id="outlined-full-width"
                        label="email"
                        style={{ margin: 8 }}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        multiline
                        onChange={e => CMS_DATA.orgInfo.Email = e.target.value}
                    />
                    <TextField
                        id="outlined-full-width"
                        label="ИЛС"
                        style={{ margin: 8 }}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        multiline
                        onChange={e => CMS_DATA.orgInfo.ILS = e.target.value}
                    />
                </div>
            );
        case 2:
            return (
                <div id="CamerasInfo">
                    <h3>Информация по камере(-ам)</h3>
                </div>
            );
        case 3:
            return (
                <div id="Internet">
                    <h3>Интернет Ростелеком?</h3>
                </div>
            );
        case 4:
            return (
                <div id="Address">
                    <h3> Адрес установки камер </h3>
                    <ReactDadata token={API_KEY_DADATA} onChange={event => CMS_DATA.address = event.value}/>
                </div>
            );
        case 5:
            return (
                <div id="Contacts">
                    <h3>Контактные данные</h3>
                </div>
            );
        case 6:
            return (
                <div id="CompleteActions">
                    <h3>Данные для заявки успешно сохранены</h3>
                </div>
            );
        default:
            return 'Неизвестный шаг';
    }
}

function CmsBlock(props) {
    const { classes } = props;
    const useFB = useFirebase();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    function handleNext() {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
    }

    function handleBack() {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    function handleReset() {
        setActiveStep(0);
    }

    async function addToCmsHistory(data) {
        try {
            await useFB.doAddCmsHistory(data);
            setActiveStep(prevActiveStep => prevActiveStep + 1);
        } catch(error) {
            // eslint-disable-next-line no-console
            console.log(error)
        }
    }

    return (
        <div id="CreateCMS">
        <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label, index) => (
                    <Step key={label}>
                        <StepLabel >{label}</StepLabel>
                        <StepContent>
                            <Typography component={'span'} variant={'body2'}>{getStepContent(index)}</Typography>
                            <div className={classes.actionsContainer}>
                                <div>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        className={classes.button}
                                    >
                                        Назад
                                    </Button>
                                    {activeStep === steps.length - 1 ?
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => addToCmsHistory(CMS_DATA)}
                                            className={classes.button}
                                        >
                                            Сформировать
                                        </Button> :
                                        <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleNext}
                                        className={classes.button}
                                        >
                                            Далее
                                        </Button>
                                    }
                                </div>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
            {activeStep === steps.length && (
                <Paper square elevation={0} className={classes.resetContainer}>
                    <Typography>Здесь будет выводиться информация для заявки</Typography>
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
    }).isRequired,

};

export default withStyles(styles)(CmsBlock);