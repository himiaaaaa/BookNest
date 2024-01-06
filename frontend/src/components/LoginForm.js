import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import { FaBook } from 'react-icons/fa'


const LoginForm = ({ setError, setToken, show }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [ login, result ] = useMutation(LOGIN, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        }
    })

    useEffect(() => {
        if(result.data){
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('library-user-token', token)
        }
    }, [result.data, setToken]) 

    if (!show) {
        return null
      }

    const submit = async (event) => {
        event.preventDefault()

        login({ variables: { username, password } })

        setUsername('')
        setPassword('')

    }

    return(
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <FaBook className="mx-auto h-10 w-auto"/>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Login
            </h2>
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            name
                        </label>
                        <div className="mt-2">
                            <input
                                value={username}
                                onChange={({ target }) => setUsername(target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                password
                            </label>
                            <div className="mt-2">
                            <input 
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            </div>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        login
                    </button>
                </form>
              </div>
            </div>
        </div>
    )
}

export default LoginForm