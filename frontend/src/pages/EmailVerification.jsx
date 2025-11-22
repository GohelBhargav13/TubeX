import React,{ useEffect } from 'react'
import { useParams,useNavigate } from "react-router-dom"
import { UserEmailVerification } from '../API/user.api'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import socket from '../Server/Server.js'

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
                console.log("User is verified")
                setIsVerified(true)

                // new socket of the new user join
                socket.emit("newUserJoin", { userData:userData})

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
            // setIsVerified(false)
        }
      }  
      verifyEmail()
    },[])

    // Loding state if the page is load
    if(loading){
        return (
            <div className='h-screen text-black font-bold text-center'>
                <div className='flex gap-4 items-center justify-center'>
                    {!isVerified && (
                        <>
                            <Loader2 className='animate-spin' />
                            <p className='font-bold text-white font-mono text-xl'>Authenticating....</p>
                        </>
                    )}
                </div>
            </div>
        )
    }

  return (
    <>
        <div className='bg-linear-to-b from-slate-900 to-black h-screen text-white font-mono font-bold'>
            <div className='min-h-screen text-xl justify-center items-center flex flex-col gap-4'>
                { isVerified && <p className='font-bold text-white font-mono text-2xl'>IsAuthenticated</p> }
                { isVerified && <button onClick={() => navigate("/login")} className='p-2 bg-slate-800 cursor-pointer text-lg text-white rounded-lg hover:bg-slate-900 hover:scale-105 duration-500 hover:font-bold'> Sign In</button> }
            </div>
        </div>
    </>
  )
}

export default EmailVerification