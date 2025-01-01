import React from 'react'

const Login = () => {
  return (
    <div>Login
        <div>
            <form className='ml-2'>
                <div>Username:
                    <input type="text" name="username" id="username" placeholder='Enter your username' className='border border-blue-600 p-2 rounded-lg' />
                </div>
                <div>Password:
                    <input type="password" name="username" id="username" placeholder='Enter your password' className='border border-blue-600 p-2 rounded-lg' />
                </div>
                <div><button className='border border-blue-600 p-2 rounded-lg'>Login</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login