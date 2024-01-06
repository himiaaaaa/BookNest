import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, USER  } from './queries'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import Loading from './components/Loading'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { FaBook } from 'react-icons/fa'

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
  const user = useQuery(USER) 
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

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
  }

  if(authors.loading || books.loading){
    return (
      <Loading />
    )
  }

  console.log('authors', authors.data.allAuthors)
  console.log('books', books.data.allBooks)
  //console.log('user', user.data.me.favoriteGenre)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const pageButtons = [
    { name: 'authors', label: 'Authors', condition: undefined, action: () => setPage('authors') },
    { name: 'books', label: 'Books', condition: undefined, action: () => setPage('books') },
    { 
      name: 'login', 
      label: 'Login', 
      condition: !token, 
      action: () => setPage('login') 
    },
    { 
      name: 'add', 
      label: 'Add book', 
      condition: token,  
      action: () => setPage('add') 
    },
    { 
      name: 'logout', 
      label: 'Logout', 
      condition: token,  
      action: logout
    },
    { name: 'recommend', label: 'Recommend', condition: undefined, action: () => setPage('recommend') },
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
                      {pageButtons.map((button) => (
                          button.condition !== undefined && !button.condition ? null :
                            <button
                              key={button.name}
                              href={button.href}
                              onClick={button.action}
                              className={classNames(
                                page === button.name ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium'
                              )}
                              aria-current={page === button.name ? 'page' : undefined}
                            >
                              {button.label}
                            </button>
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
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      onClick={item.action}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
            )}
      </Disclosure>

      <Authors show={page === 'authors'} authors={authors.data.allAuthors} setError={notify} />

      <Books show={page === 'books'} books={books.data.allBooks} />

      <NewBook show={page === 'add'} setError={notify}/>

      <LoginForm show={page === 'login'} setToken={setToken} setError={notify} /> 

      <Recommend show={page === 'recommend'} user={user.data.me} books={books.data.allBooks}/>
    </div>
  )


  // return (
  //   <div className="bg-gray-100 min-h-screen">
  //     <Notify errorMessage={errorMessage} />
  //     <div className="flex justify-center items-center mt-4 space-x-4">
  //       <button onClick={() => setPage('authors')} >authors</button>
  //       <button onClick={() => setPage('books')}>books</button>
  //       {!token ? 
  //       <button onClick={() => setPage('login')}>login</button>
  //       : <div>
  //           <button onClick={() => setPage('add')}>add book</button>
  //           <button onClick={logout}>logout</button>
  //         </div>
  //       }
  //       <button onClick={() => setPage('recommend')}>recommend</button>
  //     </div>

  //     <Authors show={page === 'authors'} authors={authors.data.allAuthors} setError={notify} />

  //     <Books show={page === 'books'} books={books.data.allBooks} />

  //     <NewBook show={page === 'add'} setError={notify}/>

  //     <LoginForm show={page === 'login'} setToken={setToken} setError={notify} /> 

  //     <Recommend show={page === 'recommend'} user={user.data.me} books={books.data.allBooks}/>
  //   </div>
  // )
}

export default App
