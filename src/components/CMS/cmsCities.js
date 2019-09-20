import React from 'react';
import {cameraModels} from '../CMS/cameraModels';

const cameraModel = cameraModels;

function CmsCities() {

    return (
        <div>
            {cameraModel.map(el => <li key={el.label}>{el.label}</li>)}
        </div>
    );
}

export default CmsCities;