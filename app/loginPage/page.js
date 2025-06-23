'use client'

import { useState } from 'react'
import TopBanner from '../components/TopBanner'
import { useRouter } from 'next/navigation'

require('dotenv').config(); 

export default function Login()
{
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')

    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try 
        {
            const responses = await fetch('/api/login',
                {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            }
            );
            if (responses.ok)
            {;
                setUsername('');
                setPassword('');
                router.push('/uploadpage');
            }
            else
            {
                setLoginError('Invalid username or password');
            }
        }
        catch (error) 
        {
            console.error("loging error", error);
        }
    }
    return (
    <div className="min-h-screen flex flex-col">
    <TopBanner/>
    
     <div className="flex-1 flex items-center justify-center">
         
     <div className="p-11 rounded-2xl bg-white">
     <div className="flex text-black font-semibold justify-left">
       Admin login
     </div>
     
     <form onSubmit={handleLogin} className="flex flex-col items-center space-y-4 p-4 ">

        <input
        type = "text"
        placeholder='username'
        value = {username}
        onChange = {(e) => setUsername(e.target.value)}
        className="  text-[#949494] px-8 py-4 border rounded-xl">
        </input>

        <input
        type = "password"
        placeholder='password'
        value = {password}
        onChange = {(e) => setPassword(e.target.value)}
        className="  text-[#949494] px-8 py-4 border rounded-xl">
        </input>
       

        <div className='space-y-5    '>
            <button type="submit" className="flex bg-[#f15a22] hover:bg-blue-500 text-white px-8 py-4 rounded-xl justify-center">
        Login
        </button>
        </div>
     </form>
     
        {loginError && (<p className="p-2 text-black rounded-xl border border-black/50 shadow-inner mt-1"> <span >{loginError}</span> </p>)} 
    </div>
        </div>
    </div>
    )
}


