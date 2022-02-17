import { createContext } from 'react';
import { UserResponse as User } from '../typings';

interface AuthContext {
    userData: User | undefined;
    setUserData: React.Dispatch<React.SetStateAction<User | undefined>>;
    authenticated: boolean;
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContext>({
    userData: undefined,
    setUserData: (user: unknown) => {
        console.warn('Trying to set to ', user);
    },

    authenticated: false,
    setAuthenticated: (auth: unknown) => {
        console.warn('Trying to set to ', auth);
    },
});

export default AuthContext;
