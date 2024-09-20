import React, { useEffect, useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { doPasswordReset, logInWithEmailAndPassword, signInWithGoogle } from '../firebase/auth';
import { useAuth } from '../contexts/authContext';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../firebase/firebase';



const AdminLogin = () => {
    const navigate = useNavigate();

    const { userLoggedIn } = useAuth();
    const [user, loading, error] =useAuthState(auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await logInWithEmailAndPassword(email, password);
            } catch (error) {
                setIsSigningIn(false);
                setErrorMessage("Wrong email or password");
            }
            setIsSigningIn(false);
        }
    };

    useEffect(() => {
        if(loading) return;
        if (user) navigate('/');
    }, [user, loading]);

    if (userLoggedIn) {
        return <Navigate to={'/'} replace={true} />;
    };

    return (
      <div>
        <main className="bg-cream w-full h-screen flex self-center place-content-center place-items-center">
          <div className="bg-white  w-96 text-gray-600 space-y-5 p-4 shadow-xl border rounded-xl">
            <div className="text-center">
                <div className="mt-2">
                    <h3 className="text-gray-800 text-xl font-semibold sm:text-2xl">Admin Login</h3>
                </div>
            </div>
            <form onSubmit={onSubmit} className="space-y-5">
                <div>
                    <label className="text-sm text-gray-600 font-bold">Email</label>
                    <input
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600 font-bold">Password</label>
                    <input
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg transition duration-300"
                    />
                </div>
                {errorMessage && <span className='text-red-600 font-bold'>{errorMessage}</span>}
                <button
                    type="submit"
                    disabled={isSigningIn}
                    className={`w-full px-4 py-2 text-white font-medium rounded-lg ${isSigningIn ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl transition duration-300'}`}
                >
                    {isSigningIn ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
          </div>
        </main>
      </div>
    );
    
}

export default AdminLogin