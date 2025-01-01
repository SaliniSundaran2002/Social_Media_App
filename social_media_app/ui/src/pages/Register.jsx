import React from 'react'

const Register = () => {
  return (
    <div>Register

        <div>
            <form>
                <div>Name:
                    <input type="text" id='name' name='name' placeholder='Enter your name' className='border border-blue-500 p-4 rounded-lg' />
                </div>
                <div>Email:
                    <input type="text" id='email' name='email' placeholder='Enter your emai' className='border border-blue-500 p-4 rounded-lg' />
                </div>
                <div>Username:
                    <input type="text" id='username' name='username' placeholder='Enter your username' className='border border-blue-500 p-4 rounded-lg' />
                </div>
                <div>Password:
                    <input type="password" id='password' name='password' placeholder='Enter your password' className='border border-blue-500 p-4 rounded-lg' />
                </div>
                <div><button className='bg-cyan-400 p-2 rounded-lg border border-blue-500 text-green-700'>Register</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Register