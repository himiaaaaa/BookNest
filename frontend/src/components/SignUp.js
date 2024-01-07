import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_USER, ALL_USERS } from '../queries'
import { FaBook } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
//import { updateCache } from '../App'

const SignUp = ({ setError, setToken, show }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [favoriteGenre, setFavoriteGenre] = useState('')
    const navigate = useNavigate()

    const [ createUser, result ] = useMutation(CREATE_USER,{
        refetchQueries: [{ query:ALL_USERS }], 
        onError: (error) => {
          const messages = error.graphQLErrors[0]?.message
          setError(messages)
          console.log('sign up error', messages)
        },
      })

    useEffect(() => {
         console.log('Result data:', result.data);
         if(result.data){
            const token = result.data.createUser.token?.value;

        if (token) {
            setToken(token);
            localStorage.setItem('library-user-token', token);
            navigate('/');
            window.location.reload();
        } else {
            console.error('Token is missing in the response.');
        }
         }
     }, [ result.data, setToken, navigate ]) 

    if (!show) {
        return null
      }

    const submit = async (event) => {
        event.preventDefault()

        console.log('Submitting...');

        createUser({ variables: { username, password, favoriteGenre } })
    
        console.log('Mutation executed.');

        setUsername('')
        setPassword('')
        setFavoriteGenre('')
    }

    return(
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <FaBook className="mx-auto h-10 w-auto"/>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign UP
            </h2>
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            username
                        </label>
                        <div className="mt-2">
                            <input
                                value={username}
                                onChange={({ target }) => setUsername(target.value)}
                                className="block w-full rounded-md border-0 py-1.5 pl-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                                className="block w-full rounded-md border-0 pl-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                favorite genre
                            </label>
                            <div className="mt-2">
                            <input 
                                value={favoriteGenre}
                                onChange={({ target }) => setFavoriteGenre(target.value)}
                                className="block w-full rounded-md border-0 pl-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            </div>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        SignUp
                    </button>
                </form>
              </div>
            </div>
        </div>
    )
}

export default SignUp