import React, { forwardRef, useEffect, useState } from 'react'
import { BsCurrencyDollar } from 'react-icons/bs'
import toast from 'react-hot-toast'
import moment from 'moment'
import { FixedSizeList as List } from 'react-window'
import { useSelector, useDispatch } from 'react-redux'
import { get_seller_payemt_details, send_withdrowal_request, messageClear } from '../../store/Reducers/PaymentReducer'

function handleOnWheel({ deltaY }) {
    console.log('handleOnWheel', deltaY)
}

const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} onWheel={handleOnWheel} {...props} />
))

const Payments = () => {

    const [amount, setAmount] = useState(0)
    const dispatch = useDispatch()
    const { userInfo } = useSelector(state => state.auth)
    const { 
        successMessage,
        errorMessage,
        loader,
        pendingWithdrows = [],  // Default to empty array
        successWithdrows = [],  // Default to empty array
        totalAmount,
        withdrowAmount,
        pendingAmount,
        availableAmount 
    } = useSelector(state => state.payment)

    const Row = ({ index, style }) => {
        return (
            <div style={style} className='flex text-sm'>
                <div className='w-[25%] p-2 whitespace-nowrap'>{index + 1}</div>
                <div className='w-[25%] p-2 whitespace-nowrap'>${pendingWithdrows[index]?.amount}</div>
                <div className='w-[25%] p-2 whitespace-nowrap'>
                    <span className='py-[1px] px-[5px] bg-slate-700 text-blue-500 rounded-md text-xs'>{pendingWithdrows[index]?.status}</span>
                </div>
                <div className='w-[25%] p-2 whitespace-nowrap'>{moment(pendingWithdrows[index]?.createdAt).format('LL')}</div>
            </div>
        )
    }

    const Rows = ({ index, style }) => {
        return (
            <div style={style} className='flex text-sm'>
                <div className='w-[25%] p-2 whitespace-nowrap'>{index + 1}</div>
                <div className='w-[25%] p-2 whitespace-nowrap'>${successWithdrows[index]?.amount}</div>
                <div className='w-[25%] p-2 whitespace-nowrap'>
                    <span className='py-[1px] px-[5px] bg-slate-700 text-blue-500 rounded-md text-xs'>{successWithdrows[index]?.status}</span>
                </div>
                <div className='w-[25%] p-2 whitespace-nowrap'>{moment(successWithdrows[index]?.createdAt).format('LL')}</div>
            </div>
        )
    }

    useEffect(() => {
        dispatch(get_seller_payemt_details(userInfo._id))
    }, [dispatch, userInfo._id])

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear())
        }
        if (errorMessage) {
            toast.error(errorMessage)
            dispatch(messageClear())
        }
    }, [errorMessage, successMessage, dispatch])

    const sendRequest = (e) => {
        e.preventDefault()
        if (availableAmount - amount > 10) {
            dispatch(send_withdrowal_request({ amount, sellerId: userInfo._id }))
            setAmount(0)
        } else {
            toast.error('insufficient balance')
        }
    }

    return (
        <div className='px-2 md:px-7 py-5'>
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5'>
                <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                        <h2 className='text-lg font-bold'>${totalAmount}</h2>
                        <span className='text-sm font-normal'>Total Sales</span>
                    </div>
                    <div className='w-[46px] h-[47px] rounded-full bg-[#28c76f1f] flex justify-center items-center text-xl'>
                        <BsCurrencyDollar className='text-[#28c76f] shadow-lg' />
                    </div>
                </div>
                <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                        <h2 className='text-lg font-bold'>${availableAmount}</h2>
                        <span className='text-sm font-normal'>Avaiable Amount</span>
                    </div>
                    <div className='w-[46px] h-[47px] rounded-full bg-[#e000e81f] flex justify-center items-center text-xl'>
                        <BsCurrencyDollar className='text-[#cd00e8] shadow-lg' />
                    </div>
                </div>
                <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                        <h2 className='text-lg font-bold'>${withdrowAmount}</h2>
                        <span className='text-sm font-normal'>Withdrawal Amount</span>
                    </div>
                    <div className='w-[46px] h-[47px] rounded-full bg-[#00cfe81f] flex justify-center items-center text-xl'>
                        <BsCurrencyDollar className='text-[#00cfe8] shadow-lg' />
                    </div>
                </div>
                <div className='flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#d0d2d6]'>
                        <h2 className='text-lg font-bold'>${pendingAmount}</h2>
                        <span className='text-sm font-normal'>Pending amount</span>
                    </div>
                    <div className='w-[46px] h-[47px] rounded-full bg-[#7367f01f] flex justify-center items-center text-xl'>
                        <BsCurrencyDollar className='text-[#7367f0] shadow-lg' />
                    </div>
                </div>
            </div>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-3 pb-4'>
                <div className='bg-[#283046]  text-[#d0d2d6] rounded-md p-5'>
                    <h2 className='text-lg'>Send withdrawal Request</h2>
                    <div className='py-5'>
                        <form onSubmit={sendRequest}>
                            <div className='flex gap-3 flex-wrap'>
                                <input onChange={(e) => setAmount(e.target.value)} value={amount} type="text" className='bg-transparent w-full border border-slate-500 rounded-md outline-none text-[#d0d2d6] text-sm py-2 px-3' placeholder='Enter Amount' />
                                <button type='submit' className='bg-pink-600 w-full rounded-md py-2'>Send Request</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className='w-full flex flex-col justify-start items-start gap-3'>
                    <div className='w-full bg-[#283046] text-[#d0d2d6] rounded-md p-5'>
                        <h2 className='text-lg'>Pending Withdrawal Request</h2>
                        <div className='overflow-y-auto py-2'>
                            {
                                pendingWithdrows?.length > 0 && (
                                    <List
                                        style={{ minWidth: '340px', overflowX: 'hidden' }}
                                        className='List'
                                        height={350}
                                        itemCount={pendingWithdrows.length}
                                        itemSize={35}
                                        outerElementType={outerElementType}
                                    >
                                        {Row}
                                    </List>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className='w-full flex flex-col justify-start items-start gap-3'>
                    <div className='w-full bg-[#283046] text-[#d0d2d6] rounded-md p-5'>
                        <h2 className='text-lg'>Successful Withdrawals</h2>
                        <div className='overflow-y-auto py-2'>
                            {
                                successWithdrows?.length > 0 && (
                                    <List
                                        style={{ minWidth: '340px', overflowX: 'hidden' }}
                                        className='List'
                                        height={350}
                                        itemCount={successWithdrows.length}
                                        itemSize={35}
                                        outerElementType={outerElementType}
                                    >
                                        {Rows}
                                    </List>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payments
