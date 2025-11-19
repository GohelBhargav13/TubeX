import React,{ useEffect } from 'react'
import { useParams,useNavigate } from "react-router-dom"
import { UserEmailVerification } from '../API/user.api'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const EmailVerification = () => {

    const { tokenUrl } = useParams()
    const navigate = useNavigate()
    const [isVerified,setIsVerified] = useState(false)
    const [loading,setIsLoading] = useState(false)

    useEffect(() => {
      const verifyEmail = async() => {
        try {
            setIsLoading(true)
            const res = await UserEmailVerification(tokenUrl)

            if(res?.StatusCode === 400){
                console.log("user is not verified")
                toast.error(res?.message || "User is not Verified")
                return;
            }

            if(res?.StatusCode === 200){
                setTimeout(() => {
                    setIsVerified(true)
                }, 1500)
                toast.success(res?.message)
                return;
            }
            
        } catch (error) {
            setIsVerified(false)
            setIsLoading(false)
            console.log("Internal error while verify user email")
            return;
        }finally {
            setIsLoading(false)
            setIsVerified(false)
        }
      }  
      verifyEmail()
    },[])

    // Loding state if the page is load
    if(loading){
        return (
            <div className='text-black font-bold text-center'>
                <Loader2 className='animate-spin' />
            </div>
        )
    }

  return (
    <>
        <div className='bg-slate-900 text-white text-center font-mono font-bold'>
            { isVerified ? <p>IsAutheticated</p> : <p>Not Verified</p> }
            { isVerified && <button onClick={() => navigate("/login")} className='p-2 bg-blue-500 text-white rounded-lg'> Sign In</button> }
        </div>
    </>
  )
}

export default EmailVerification