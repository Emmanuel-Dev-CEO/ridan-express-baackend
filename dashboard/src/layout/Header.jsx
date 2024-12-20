import React from 'react'
import { FaList } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import sellerImage from '../assets/seller.png'
import adminImage from '../assets/admin.jpg'
const Header = ({ showSidebar, setShowSidebar }) => {

    const { userInfo } = useSelector(state => state.auth)
    return (
        <div className='fixed top-0 left-0 w-full py-3 px-2 lg:px-7 z-40'>
            <div className='ml-0 lg:ml-[260px] h-[65px] flex justify-between rounded-xl items-center bg-[#283046] text-black px-5 transition-all'>
                <div onClick={() => setShowSidebar(!showSidebar)} className='w-[35px] flex lg:hidden h-[35px] rounded-sm bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 justify-center items-center cursor-pointer'>
                    <span><FaList /></span>
                </div>
                <div className='hidden text-black md:block'>
                    <input className='px-8 py-1 outline-none border bg-white rounded-full placeholder-bold placeholder-opacity-7 text-black overflow-hidden' type="text" name='search' placeholder='Search' />
                </div>
                <div className='flex justify-center items-center gap-8 relative'>
                    <div className='flex justify-center items-center'>
                        <div className='flex justify-center items-center gap-3'>
                            {/* <div className='flex justify-center gap-2 items-center text-center'>
                                <h2 className='text-sm bg-black text-white rounded-full w-full font-semibold'>{userInfo.name}</h2>
                                <span className='text-[14px] text-green-800 bg-green-400 rounded-full w-full font-normal'>{userInfo.role}</span>
                            </div> */}
                            <div className="flex align-center justify-center flex-row gap-2">
                                <div className='bg-black text-gray-200 text-sm px-3 py-1 font-semibold rounded-full'>{userInfo.name}</div>
                                <div className='bg-green-200 text-green-500 text-sm font-semibold px-3 py-1 rounded-full'>{userInfo.role}</div>
                            </div>
                            {
                                userInfo.role === 'admin' ? <img className='w-[45px] h-[45px] rounded-full overflow-hidden' src={userInfo.image ? userInfo.image : adminImage} alt="" /> : <img className='w-[45px] h-[45px] rounded-full overflow-hidden' src={userInfo.image ? userInfo.image : sellerImage} alt="" />
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Header