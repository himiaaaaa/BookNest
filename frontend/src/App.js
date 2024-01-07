import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, ALL_USERS, BOOK_ADDED, USER  } from './queries'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import Loading from './components/Loading'
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { FaBook } from 'react-icons/fa'
import { Routes, Route, Link } from 'react-router-dom'
import SignUp from './components/SignUp'

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const users = useQuery(ALL_USERS)
  const user = useQuery(USER) 
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const storedToken = localStorage.getItem('library-user-token')
    if (storedToken) {
        setToken(storedToken);
    }
  }, [])

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log(data)
      const addedBook = data.data.bookAdded
      try {window.alert(`${addedBook.title} added`)
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)}
      catch {
        console.log('error')
      }

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ 
        allBooks }) => {        
          return {          
            allBooks: allBooks.concat(addedBook),        
          }      
        })    
      }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    window.location.replace('/')
  }

  if(authors.loading || books.loading){
    return (
      <Loading />
    )
  }

  console.log('authors', authors.data.allAuthors)
  console.log('books', books.data.allBooks)
  console.log('user', user.data.me)
  console.log('all users', users.data.allUsers)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const pageButtons = [
    { name: 'authors', path: '/', label: 'Authors', condition: undefined, action: () => setPage('authors') },
    { name: 'books', path: '/books', label: 'Books', condition: undefined, action: () => setPage('books') },
    { 
      name: 'login',
      path: '/login', 
      label: 'Login', 
      condition: !token, 
      action: () => setPage('login') 
    },
    { 
      name: 'signup',
      path: '/signup', 
      label: 'Signup', 
      condition: !token, 
      action: () => setPage('signup') 
    },
    { 
      name: 'add', 
      path: '/addBook',
      label: 'Add book', 
      condition: token,  
      action: () => setPage('add') 
    },
    { 
      name: 'logout', 
      label: 'Logout', 
      condition: token,  
      action: logout,
      path: '/'
    },
    { 
      name: 'recommend', 
      label: 'Recommend', 
      condition: token, 
      action: () => setPage('recommend'),
      path: '/recommend'
     },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Notify errorMessage={errorMessage} />       
      <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                    <FaBook className="mx-auto h-8 w-8 fill-white"/>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4 text-white">
                      
                      {pageButtons
                        .filter((button) => button.condition === undefined || button.condition)
                        .map((button) => (
                          <Link
                            key={button.name}
                            to={button.path}
                            href={button.href}
                            onClick={button.action}
                            className={classNames(
                              page === button.name ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'block rounded-md px-3 py-2 text-base font-medium'
                            )}
                            aria-current={page === button.name ? 'page' : undefined}
                          >
                            {button.label}
                          </Link>
                      ))}
               
                      </div>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {pageButtons.map((item) => (
                    item.condition !== undefined && !item.condition ? null :
                    <Link
                      key={item.name}
                      to={item.path}
                      href={item.href}
                      onClick={item.action}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                    ))}
                </div>
              </Disclosure.Panel>
            </>
            )}

      </Disclosure>

        <Routes>
          <Route path='/' element={<Authors show={page === 'authors'} authors={authors.data.allAuthors} setError={notify} user={user.data.me}/>} />
          <Route path='/books' element={<Books show={page === 'books'} books={books.data.allBooks} setError={notify} />} />
          <Route path='/addBook' element={token? <NewBook show={page === 'add'} setError={notify} /> : <LoginForm setToken={setToken} setError={notify}/>} />
          <Route path='/recommend' element={token? <Recommend show={page === 'recommend'} user={user.data.me} books={books.data.allBooks}/> : <LoginForm setToken={setToken} setError={notify}/>} />
          <Route path='/login' element={token ? <Authors show={page === 'authors'} authors={authors.data.allAuthors} setError={notify}/> : <LoginForm show={page === 'login'} setToken={setToken} setError={notify}/>} />
          <Route path='/signup' element={token ? <Authors show={page === 'authors'} authors={authors.data.allAuthors} setError={notify}/> : <SignUp show={page === 'signup'} setToken={setToken} setError={notify}/>} />
        </Routes>        
      
    </div>
  )
}

export default App
