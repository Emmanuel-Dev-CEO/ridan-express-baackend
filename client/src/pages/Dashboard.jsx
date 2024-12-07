import React, { useState } from 'react'
import Headers from '../components/Headers'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { FaList } from 'react-icons/fa'
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ForumIcon from '@mui/icons-material/Forum';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';
import api from '../api/api'
import { useDispatch } from 'react-redux'
import { user_reset } from '../store/reducers/authReducer'
import { reset_count } from '../store/reducers/cardReducer'

const Dashboard = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [filterShow, setFilterShow] = useState(false)

    const logout = async () => {
        try {
            const { data } = await api.get('/customer/logout')
            localStorage.removeItem('customerToken')
            dispatch(user_reset())
            dispatch(reset_count())
            navigate('/login')
        } catch (error) {
            console.log(error.response.data)
        }
    }
    return (
        <div>
            <div className='md:hidden'><Headers /></div>
            <div className='bg-slate-200 h-auto'>
                <div className='w-[100%] mx-auto  md-lg:block hidden'>
                    <div>
                        <button onClick={() => setFilterShow(!filterShow)} className='text-center py-1 px-1 rounded m-1 bg-orange-400 text-white'>
                            <MenuIcon />
                        </button>
                    </div>
                </div>
                <div className='h-[100%] mx-auto'>
                    <div className='flex md-lg:w-[100%] mx-auto relative'>
                        <div className={`w-[300px] h-[625px] md-lg:absolute rounded-lg bg-black text-white border-r border-gray-700 z-50 transition duration-500 ease-in-out  ${filterShow ? 'left-0' : '-left-[350px]'} shadow-lg`}>
                            <ul className="space-y-6 p-4 flex bg-black flex-col justify-between ">
                                <div>
                                    <li className="flex items-center gap-4 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition duration-300">
                                        <HomeIcon />
                                        <Link to="/" className="text-xs font-semibold">Home</Link>
                                    </li>
                                    <li className="flex items-center gap-4 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition duration-300">
                                        <DashboardIcon />
                                        <Link to="/dashboard" className="text-xs font-semibold ">Dashboard</Link>
                                    </li>
                                    <li className="flex items-center gap-4 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition duration-300">
                                        <ShoppingCartIcon />
                                        <Link to="/dashboard/my-orders" className="text-xs font-semibold ">Orders</Link>
                                    </li>
                                    <li className="flex items-center gap-4 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition duration-300">
                                        <FavoriteBorderIcon />
                                        <Link to="/dashboard/my-wishlist" className="text-xs font-semibold ">Wishlist</Link>
                                    </li>
                                    <li className="flex items-center gap-4 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition duration-300">
                                        <ForumIcon />
                                        <Link to="/dashboard/chat" className="text-xs font-semibold ">Chat</Link>
                                    </li>
                                    <li className="flex items-center gap-4 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition duration-300">
                                        <LockResetIcon />
                                        <Link to="/dashboard/change-password" className="text-xs font-semibold ">Change Password</Link>
                                    </li>
                                </div>
                                <div className='border-t border-gray-700'>
                                    <li
                                        onClick={logout}
                                        className="flex items-center gap-4 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition duration-300 cursor-pointer"
                                    >
                                        <LogoutIcon />
                                        <span className="text-xs font-semibold">Logout</span>
                                    </li>
                                </div>
                            </ul>
                        </div>

                        <div className='w-[calc(100%-270px)] h-auto md-lg:w-full'>
                            <div className='md-lg:mx-0'>
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard