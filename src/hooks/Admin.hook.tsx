import { useContext } from 'react';
import { UserContext } from '../context/userProvider';

const IsAdmin = () => {
    const { auth = null, isAdmin = false } = useContext(UserContext) || {};
    return [isAdmin, auth]
}

export default IsAdmin;