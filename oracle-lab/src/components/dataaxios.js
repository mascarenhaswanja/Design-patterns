import React, { useState, useEffect } from 'react';
import axios from "axios";

const DataAxios =  () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/users')
        .then(res => {
            setUsers(res.data);
        });
    });
    
    return (
        <div>
            <h2>Users from Axios</h2>
            { users.map(user => (
                <p key={user.id}>{user.name}</p>
            ))}
        </div>
    );
};

export default DataAxios;