import React from 'react';
import useFirebase from "../../../Firebase/useFirebase";
import NavBar from "../../NavBar";


function UserProfile() {
    const firebase = useFirebase();
    const user = firebase.getCurrentUser();
    return (
        <div id="UserProfile">
            <NavBar/>
            This place for user profile
            <div>
                <ul>
                    <li>
                        {
                            user.photoURL ?
                            <img src={user.photoURL} style={{maxWidth: '150px'}} alt='PhotoProfile'/> : 'no photo'
                        }
                    </li>
                    <li>
                        UserName: {user.displayName}
                    </li>
                    <li>
                        Email: {user.email}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default UserProfile