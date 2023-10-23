import { useEffect, useState, useContext } from 'react';
import { doc, getDoc, db } from '../firebase';
import AuthCheck from './Auth.hook';
import { UserContext } from '../context/userProvider';

type User = {
    role: string;
}

const IsAdmin = () => {
   const {auth= null, isAdmin = false} = useContext(UserContext) || {};
    return [isAdmin, auth]

}

export default IsAdmin;