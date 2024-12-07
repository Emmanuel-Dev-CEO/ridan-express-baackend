import React, { useEffect, useState, useRef } from 'react'
import { AiOutlineMessage, AiOutlinePlus } from 'react-icons/ai'
import { GrEmoji } from 'react-icons/gr'
import { IoSend } from 'react-icons/io5'
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'; import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import io from 'socket.io-client'
import { add_friend, send_message, updateMessage, messageClear } from '../../store/reducers/chatReducer'
import toast from 'react-hot-toast'

const socket = io('http://localhost:5000')

const Chat = () => {

    const scrollRef = useRef()

    const dispatch = useDispatch()
    const { sellerId } = useParams()
    const [text, setText] = useState('')
    const [receverMessage, setReceverMessage] = useState('')
    const [activeSeller, setActiveSeller] = useState([])
    const { userInfo } = useSelector(state => state.auth)
    const { fd_messages, currentFd, my_friends, successMessage } = useSelector(state => state.chat)

    useEffect(() => {
        socket.emit('add_user', userInfo.id, userInfo)
    }, [])

    useEffect(() => {
        dispatch(add_friend({
            sellerId: sellerId || "",
            userId: userInfo.id
        }))
    }, [sellerId])

    const send = () => {
        if (text) {
            dispatch(send_message({
                userId: userInfo.id,
                text,
                sellerId,
                name: userInfo.name
            }))
            setText('')
        }
    }

    useEffect(() => {
        socket.on('seller_message', msg => {
            setReceverMessage(msg)
        })
        socket.on('activeSeller', (sellers) => {
            setActiveSeller(sellers)
        })
    }, [])


    useEffect(() => {
        if (successMessage) {
            socket.emit('send_customer_message', fd_messages[fd_messages.length - 1])
            dispatch(messageClear())
        }
    }, [successMessage])

    useEffect(() => {
        console.log(receverMessage)
        if (receverMessage) {
            if (sellerId === receverMessage.senderId && userInfo.id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage))
            } else {
                toast.success(receverMessage.senderName + " " + "send a message")
                dispatch(messageClear())
            }
        }
    }, [receverMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [fd_messages])


    const [show, setShow] = useState(false)

    return (
        <div className="bg-white rounded-md shadow-md">
            <div className="flex relative bg-white">

                <div className={`w-[400px] md-lg:absolute bg-black text-white transition-transform duration-300 md-lg:h-full ${show ? 'left-0' : '-left-[400px]'} shadow-lg`}>
                    <div className="flex items-start justify-evenly text-white text-lg font-medium py-6 border-b border-gray-800 bg-gray-800">
                        <span className='mt-1'>Chats</span>

                        <div onClick={() => setShow(!show)} className=" items-center text-white cursor-pointer hidden md:block">
                            <CloseIcon />
                        </div>
                    </div>

                    <div className="flex flex-col h-[510px] bg-black md:w-[] overflow-y-auto">
                        {my_friends.map((f, i) => (
                            <Link
                                to={`/dashboard/chat/${f.fdId}`}
                                key={i}
                                className="flex items-center gap-3 px-4 py-3 transition-colors duration-200 border-b border-gray-800 hover:bg-gray-700"
                            >
                                <div >
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700 shadow">
                                        <img className="w-full h-full object-cover" src="http://localhost:3000/images/user.avif" alt="User avatar" />
                                    </div>
                                    {activeSeller.some(c => c.sellerId === f.fdId) && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-300">{f.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="w-full">
                    {currentFd ? (
                        <div className="w-full  h-full md:h-[100px] bg-black">
                            <div className="flex justify-between items-center bg-black p-4 text-white text-lg">

                                <div className="flex gap-2 items-center">
                                    <div onClick={() => setShow(!show)} className=" items-center text-white cursor-pointer hidden md:block">
                                        <KeyboardArrowLeftIcon />
                                    </div>
                                    <div className="w-12 h-12 rounded-full overflow-hidden relative">
                                        {activeSeller.some(c => c.sellerId === currentFd.fdId) && (
                                            <div className="w-3 h-3 bg-green-500 rounded-full absolute right-0 bottom-0 border-2 border-gray-800"></div>
                                        )}
                                        <img src="http://localhost:3000/images/user.avif" alt="" className="object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-200 font-semibold">{currentFd.name}</span>
                                        <span className="text-gray-400 text-xs">Seller</span>
                                    </div>
                                </div>

                            </div>

                            <div className="h-[470px] md:h-[500px]  w-full bg-gray-100 p-4 rounded-md overflow-y-auto flex flex-col gap-4">
                                {fd_messages.map((m, i) => (
                                    <div key={i} ref={scrollRef} className={`flex gap-2 items-center ${currentFd?.fdId !== m.receverId ? 'justify-start' : 'justify-end'}`}>
                                        {currentFd?.fdId !== m.receverId ? (
                                            <div key={i} className="flex items-start gap-2">
                                                <img className="w-10 h-10 rounded-full" src="http://localhost:3000/images/user.avif" alt="User avatar" />
                                                <div className="bg-gray-200 text-black p-3 rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-md max-w-[75%]">
                                                    <span>{m.message}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-blue-400 text-white p-3 rounded-tl-lg rounded-br-lg rounded-bl-lg shadow-md max-w-[75%] text-right">
                                                <span>{m.message}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center p-3 space-x-2">
                                <label htmlFor="file-upload" className="flex items-center justify-center w-10 h-10 border-2 border-blue-400 rounded-full cursor-pointer text-blue-400">
                                    <AiOutlinePlus />
                                </label>
                                <input id="file-upload" type="file" className="hidden" />

                                <div className="flex-grow relative">
                                    <input
                                        type="text"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Type a message..."
                                        className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-400"
                                    />
                                    <GrEmoji className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>

                                <div onClick={send} className="flex items-center justify-center w-10 h-10 bg-blue-400 text-white rounded-full cursor-pointer">
                                    <IoSend />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div onClick={() => setShow(true)} className="flex items-center justify-center bg-gray-500 text-white text-lg font-bold h-[400px] rounded-md cursor-pointer">
                            Select a seller to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}

export default Chat