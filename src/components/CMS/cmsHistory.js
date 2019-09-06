import React, {useEffect, useState} from 'react';
import firebase from "firebase";
import { Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";

function CmsHistory() {

    function useCmsHistory() {
        const [cmsList, setCmsList] = useState([]);
        useEffect(() => {
            const unsub = firebase
                .firestore()
                .collection('cmsHistory')
                .onSnapshot((snapshot) => {
                    const newCms = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setCmsList(newCms);
                });
            return () => unsub();

        }, []);
        return cmsList
    }

    const CmsHistoryData = useCmsHistory();

    return (
        <div id="CmsHistoryData">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>cmsNumber</TableCell>
                        <TableCell align="right">dateAddCms</TableCell>
                        <TableCell align="right">orgAddress</TableCell>
                        <TableCell align="right">orgEmail</TableCell>
                        <TableCell align="right">orgILS</TableCell>
                        <TableCell align="right">orgTitle</TableCell>
                        <TableCell align="right">usersAdd</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {CmsHistoryData.map(cmsData => (
                        <TableRow key={cmsData.id}>
                            <TableCell component="th" scope="row">
                                {cmsData.cmsNumber}
                            </TableCell>
                            <TableCell align="right">{cmsData.dateAddCms}</TableCell>
                            <TableCell align="right">{cmsData.orgAddress}</TableCell>
                            <TableCell align="right">{cmsData.orgEmail}</TableCell>
                            <TableCell align="right">{cmsData.orgILS}</TableCell>
                            <TableCell align="right">{cmsData.orgTitle}</TableCell>
                            <TableCell align="right">{cmsData.usersAdd}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default CmsHistory;