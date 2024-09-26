import React, { useEffect, useState } from 'react';
import Headers from '../components/Headers';
import Footer from '../components/Footer';
import FadeLoader from 'react-spinners/FadeLoader';
import { useNavigate, Link } from 'react-router-dom'; // Use Link for navigation
import { AiOutlineGoogle } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { auth } from '../firebaseConfig'; // Make sure firebaseConfig is correctly imported
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { customer_register, messageClear } from '../store/reducers/authReducer';
import axios from 'axios'; // Import axios for HTTP requests

const Register = () => {
  const navigate = useNavigate();
  const { loader, successMessage, errorMessage, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
  });

  // inputHandle function is now used
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const register = (e) => {
    e.preventDefault();
    dispatch(customer_register(state));
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      console.log("Google Sign-In successful", user);
  
      // Check if user exists in your database
      const response = await axios.post('/api/checkUser', { uid: user.uid });
      const existingUser = response.data;
      
      console.log("Existing user check:", existingUser);
  
      // If the user doesn't exist, register them in your database
      if (!existingUser) {
        await axios.post('/api/registerUser', {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        });
        console.log("User registered successfully");
      }
  
      navigate('/');
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Google Sign-In failed");
    }
  };
  
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (userInfo) {
      navigate('/');
    }
  }, [successMessage, errorMessage, userInfo, navigate, dispatch]);

  return (
    <div>
      {loader && (
        <div className="w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[999]">
          <FadeLoader />
        </div>
      )}
      <Headers />
      <div className="bg-slate-200 mt-4">
        <div className="w-full justify-center items-center p-10">
          <div className="grid grid-cols-2 w-[60%] mx-auto bg-white rounded-md">
            <div className="px-8 py-8">
              <h2 className="text-center w-full text-xl text-slate-600 font-bold">Register</h2>
              <div>
                <form onSubmit={register} className="text-slate-600">
                  <input
                    type="text"
                    name="name"
                    value={state.name}
                     className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md'
                    onChange={inputHandle} // Now inputHandle is used
                    placeholder="Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={state.email}
                     className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md'
                    onChange={inputHandle} // Now inputHandle is used
                    placeholder="Email"
                  />
                  <input
                    type="password"
                    name="password"
                    value={state.password}
                     className='w-full px-3 py-2 border border-slate-200 outline-none focus:border-indigo-500 rounded-md'
                    onChange={inputHandle} // Now inputHandle is used
                    placeholder="Password"
                  />
                  <button className="px-8 w-full py-2 bg-purple-500 shadow-lg hover:shadow-indigo-500/30 text-white rounded-md">
                    Register
                  </button>
                </form>
                <div className="flex justify-center items-center py-2">
                  <div className="h-[1px] bg-slate-300 w-[95%]"></div>
                  <span className="px-3 text-slate-600">or</span>
                  <div className="h-[1px] bg-slate-300 w-[95%]"></div>
                </div>
                <button
                  onClick={handleGoogleSignIn}
                  className="px-8 w-full py-2 bg-orange-500 shadow hover:shadow-orange-500/30 text-white rounded-md flex justify-center items-center gap-2 mb-3"
                >
                  <span>
                    <AiOutlineGoogle />
                  </span>
                  <span>Register with Google</span>
                </button>
                {/* Link to login page */}
                <p className="text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-500 hover:underline">
                    Log in here
                  </Link>
                </p>
              </div>
            </div>
            <div className="w-full h-full py-4 pr-4">
              <img
                className="w-full h-[95%]"
                src="http://localhost:3000/images/login.jpg"
                alt="Login"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
