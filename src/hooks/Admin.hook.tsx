import { useContext } from 'react';
import { UserContext } from '../context/userProvider';

const IsAdmin = () => {
    const { auth = null, isAdmin = false, user } = useContext(UserContext) || {};
    return [isAdmin, auth, user]
}

export default IsAdmin;