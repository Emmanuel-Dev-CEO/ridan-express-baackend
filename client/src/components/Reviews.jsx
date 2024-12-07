import React, { useState, useEffect } from 'react'
import Ratings from './Ratings'
import RatingTemp from './RatingTemp'
import Pagination from './Pagination'
import { AiFillStar } from 'react-icons/ai'
import RatingReact from 'react-rating'
import { CiStar } from 'react-icons/ci'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { customer_review, messageClear, get_reviews, get_product } from '../store/reducers/homeReducer'
import toast from 'react-hot-toast'

const Reviews = ({ product }) => {

  const dispatch = useDispatch()
  const { userInfo } = useSelector(state => state.auth)
  const { successMessage, reviews, totalReview, rating_review } = useSelector(state => state.home)
  const [pageNumber, setPageNumber] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const [rat, setRat] = useState('')
  const [re, setRe] = useState('')

  const review_submit = (e) => {
    e.preventDefault()
    const obj = {
      name: userInfo.name,
      review: re,
      rating: rat,
      productId: product._id
    }
    dispatch(customer_review(obj))
  }

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage)
      dispatch(get_reviews({
        productId: product._id,
        pageNumber
      }))
      dispatch(get_product(product.slug))
      setRat('')
      setRe('')
      dispatch(messageClear())
    }
  }, [successMessage])

  useEffect(() => {
    if (product._id) {
      dispatch(get_reviews({
        productId: product._id,
        pageNumber
      }))
    }
  }, [pageNumber, product])

  return (
    <div className='mt-4 flex md:flex-col gap-8'>
      <div>
        <div className='flex gap-1 flex-col'>
          <div className='flex gap-4  justify-start items-center py-4'>
            <div >
              <span className='text-4xl font-light text-[#191919]'>{product.rating}</span>
              <span className='text-3xl font-light text-[#191919]'>/5</span>
            </div>
            <div className='flex flex-col gap-1 text-xl'>
              <Ratings ratings={product.rating} />
              <p className='text-sm text-gray-500'>{totalReview} Reviews</p>
            </div>
          </div>
          <div className='flex gap-2 flex-col py-2'>
            <div className='flex justify-start items-center gap-5'>
              <div className='text-md flex gap-1 w-[93px]'>
                <RatingTemp rating={5} />
              </div>
              <div className='w-[250px] h-[9px] rounded-full bg-slate-200 relative'>
                <div style={{ width: `${Math.floor((100 * (rating_review[0]?.sum || 0)) / totalReview)}%` }} className='h-full bg-gradient-to-r from-orange-300 to-orange-500 rounded-full'></div>
              </div>
              <p className='text-sm text-slate-600  w-[0%]'>{rating_review[0]?.sum}</p>
            </div>
            <div className='flex justify-start items-center gap-5'>
              <div className='text-md flex gap-1 w-[93px]'>
                <RatingTemp rating={4} />
              </div>
              <div className='w-[250px] rounded-full h-[9px] bg-slate-200 relative'>
                <div style={{ width: `${Math.floor((100 * (rating_review[1]?.sum || 0)) / totalReview)}%` }} className='h-full bg-gradient-to-r from-orange-300 to-orange-500 rounded-full'></div>
              </div>
              <p className='text-sm text-slate-600 w-[0%]'>{rating_review[2]?.sum}</p>
            </div>
            <div className='flex justify-start items-center gap-5'>
              <div className='text-md flex gap-1 w-[93px]'>
                <RatingTemp rating={3} />
              </div>
              <div className='w-[250px] rounded-full h-[9px] bg-slate-200 relative'>
                <div style={{ width: `${Math.floor((100 * (rating_review[2]?.sum || 0)) / totalReview)}%` }} className='h-full bg-gradient-to-r from-orange-300 to-orange-500 rounded-full'></div>
              </div>
              <p className='text-sm text-slate-600 w-[0%]'>{rating_review[2]?.sum}</p>
            </div>
            <div className='flex justify-start  items-center gap-5'>
              <div className='text-md flex gap-1 w-[93px]'>
                <RatingTemp rating={2} />
              </div>
              <div className='w-[250px] h-[9px] rounded-full bg-slate-200 relative'>
                <div style={{ width: `${Math.floor((100 * (rating_review[3]?.sum || 0)) / totalReview)}%` }} className='h-full bg-gradient-to-r from-orange-300 to-orange-500 rounded-full'></div>
              </div>
              <p className='text-sm text-slate-600 w-[0%]'>{rating_review[3]?.sum}</p>
            </div>
            <div className='flex justify-start items-center gap-5'>
              <div className='text-md flex gap-1 w-[93px]'>
                <RatingTemp rating={1} />
              </div>
              <div className='w-[250px] h-[9px] rounded-full bg-slate-200 relative'>
                <div style={{ width: `${Math.floor((100 * (rating_review[4]?.sum || 0)) / totalReview)}%` }} className='h-full bg-gradient-to-r from-orange-300 to-orange-500 rounded-full'></div>
              </div>
              <p className='text-sm text-slate-600 w-[0%]'>{rating_review[4]?.sum}</p>
            </div>
            <div className='flex justify-start items-center gap-5'>
              <div className='text-md flex gap-1 w-[93px]'>
                <RatingTemp rating={0} />
              </div>
              <div className='w-[250px] h-[9px] rounded-full bg-slate-200 relative'>
                <div className='h-full bg-[#EDBB0E] w-[0%]'></div>
              </div>
              <p className='text-sm text-slate-600 w-[0%]'>0</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className='3xl text-[#191919] font-semibold'> Write Your Review </h2>
          <p className='text-gray-600 text-sm leading-snug'>write your feedback and help create better shopping <br /> experience for everyone</p>
          <br />
          {
            userInfo ? <div className='flex flex-col gap-3'>
              <div className='flex gap-1'>
                <RatingReact
                  onChange={(e) => setRat(e)}
                  initialRating={rat}
                  emptySymbol={<span className='text-slate-500 text-2xl'><CiStar /></span>}
                  fullSymbol={<span className='text-orange-400 text-2xl'><AiFillStar /></span>}
                />
              </div>
              <form onSubmit={review_submit}>
                <textarea value={re} required onChange={(e) => setRe(e.target.value)} type='text' className='border rounded-[15px] w-[80%] border-gray-400 h-[100px] md:w-[full] outline-0 p-3 w-full' ></textarea>
                <div className='mt-2'>
                  <button className='py-2 px-8 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded-lg'>Submit</button>
                </div>
              </form>
            </div> : <div>
              <Link className='py-1 px-5 bg-indigo-500 text-white rounded-sm' to='/login'>Login</Link>
            </div>
          }
        </div>
      </div>

      <div className='w-[100%]'>
        <h2 className='text-[#191919] text-xl font-bold py-5'>Customer Feedback </h2>
        <div className='flex flex-col gap-8 pb-10 pt-4'>
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 border border-gray-300 p-5 rounded-3xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-semibold text-sm">{r.name}</span>
                  <div className="flex gap-1 text-orange-400 text-lg">
                    <RatingTemp rating={r.rating} />
                  </div>
                </div>

                <span className="text-gray-400 text-xs font-medium">{r.date}</span>

                <p className="text-gray-600 text-sm leading-snug">{r.review}</p>
              </div>
            ))}
          </div>

          <div className='flex justify-end'>
            {
              totalReview > 5 && <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalItem={totalReview} perPage={perPage} showItem={Math.round(totalReview / 5)} />
            }
          </div>
        </div>
      </div>

    </div>
  )
}

export default Reviews