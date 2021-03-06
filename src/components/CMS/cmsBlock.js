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
import LinearProgress from "@material-ui/core/LinearProgress";

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
    cameras: [],
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
let cameraInfo = '';
let modelInfo = '';


function getSteps() {
    return ['Описание проблемы', 'Данные организации', 'Информация по камере(-ам)', 'Интернет', 'Адрес установки камер(-ы)', 'Контактные данные', 'Формирование заявки'];
}

function CmsBlock(props) {
    const { classes } = props;
    const useFB = useFirebase();
    const [activeStep, setActiveStep] = React.useState(0);
    const [completeProgress, setCompleteProgress] = React.useState(0);
    const [cmsData, setCmsData] = React.useState({
        description: '',
        address: '',
        internet: '',
        cameras: [],
        orgInfoName: '',
        orgInfoILS: '',
        orgInfoEmail: '',
        contacts: [{
            fio: '',
            telephone: ''
        }]
    });

    function pushToCmsData(dataInfo) {
        cmsData.contacts.push(dataInfo);
        setContactsData({
            fio: '',
            telephone: ''
        });
        console.log(cmsData)
    }
        const handleChange = data => event => {
        setCmsData({ ...cmsData, [data]: event.target.value });
    };

    const [contactsData, setContactsData] = React.useState({});
    const handleChangeContacts = data => event => {
        setContactsData({ ...contactsData, [data]: event.target.value });
    };
    const steps = getSteps();
    function getStepContent(step) {

        function addCameraInfo(camera, model) {
            CMS_DATA.cameras.push({camera, model})
        }

        switch (step) {
            case 0:
                return (
                    <div id="Description">
                        {/* eslint-disable-next-line no-console */}
                        <Button onClick={() => pushToCmsData(contactsData)}>Click</Button>
                        <TextField
                            id="outlined-full-width"
                            label="Краткое описание проблемы"
                            style={{ margin: 8 }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            multiline
                            value={cmsData.description}
                            onChange={handleChange('description')}
                        />
                        <TextField
                            id="outlined-full-width"
                            label="ФИО"
                            style={{ margin: 8 }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            multiline
                            value={contactsData.fio}
                            onChange={handleChangeContacts('fio')}
                        />
                        <TextField
                            id="outlined-full-width"
                            label="Телефон"
                            style={{ margin: 8 }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            multiline
                            value={contactsData.telephone}
                            onChange={handleChangeContacts('telephone')}
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
                            value={cmsData.orgInfoName}
                            onChange={handleChange('orgInfoName')}
                        />
                        <TextField
                            id="outlined-full-width"
                            label="email"
                            style={{ margin: 8 }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            multiline
                            value={cmsData.orgInfoEmail}
                            onChange={handleChange('orgInfoEmail')}
                        />
                        <TextField
                            id="outlined-full-width"
                            label="ИЛС"
                            style={{ margin: 8 }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            multiline
                            value={cmsData.orgInfoILS}
                            onChange={handleChange('orgInfoILS')}
                        />
                    </div>
                );
            case 2:
                return (
                    <div id="CamerasInfo">
                        <h3>Информация по камере(-ам)</h3>
                        <TextField
                            label="S/N камеры"
                            style={{ margin: 8 }}
                            margin="normal"
                            variant="outlined"
                            onChange={event => cameraInfo = event.target.value}
                        />
                        <TextField
                            label="Модель"
                            style={{ margin: 8 }}
                            margin="normal"
                            variant="outlined"
                            onChange={event => modelInfo = event.target.value}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            style={{ margin: 8 }}
                            onClick={() => addCameraInfo(cameraInfo, modelInfo)}
                        >
                            Еще камера
                        </Button>
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
    function handleNext() {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        setCompleteProgress(prevCompleteProgress => prevCompleteProgress + 14.3);
    }
    function handleBack() {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
        setCompleteProgress(prevCompleteProgress => prevCompleteProgress - 14.3);
    }
    function handleReset() {
        setActiveStep(0);
        setCompleteProgress(0);
    }
    async function addToCmsHistory(data) {
        try {
            await useFB.doAddCmsHistory(data);
            setActiveStep(prevActiveStep => prevActiveStep + 1);
            setCompleteProgress(prevCompleteProgress => prevCompleteProgress + 14.3);
        } catch(error) {
            // eslint-disable-next-line no-console
            console.log(error)
        }
    }

    return (
        <div id="CreateCMS">
            <LinearProgress variant="determinate" value={completeProgress}/>
            <div className={classes.root}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel >{label}</StepLabel>
                            <StepContent>
                                <Typography component={'span'} variant={'body2'}>
                                    {getStepContent(index)}
                                </Typography>
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