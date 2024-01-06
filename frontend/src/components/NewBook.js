import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'
//import Notify from './Notify'
import { updateCache } from '../App'
import { Button } from '@material-tailwind/react'

const NewBook = ({show, setError}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [ createBook ] = useMutation(CREATE_BOOK,{
    refetchQueries: [{ query:ALL_AUTHORS }], 
    onError: (error) => {
      const messages = error.graphQLErrors[0].message
      setError(messages)
      console.log('error', error.graphQLErrors[0].message)
    },
    update: (cache, response) => {
      updateCache(cache, { query: ALL_BOOKS }, 
        response.data.addBook)    
      },
  })

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')

    createBook({ variables: { title, author, published, genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Expand literary horizons with us</h1>
            <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Each added book unlocks knowledge and fosters a community of lifelong learners.</p>
        </div>
        <div>
            <div className="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add Book
                </h2>
                <form className="mt-8 space-y-6" onSubmit={submit}>
                  <div>
                  <label for="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title:</label>
                    <input
                      value={title}
                      onChange={({ target }) => setTitle(target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Author:</label>
                    <input
                      value={author}
                      onChange={({ target }) => setAuthor(target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Published:</label>
                    <input
                      type="number"
                      value={published}
                      onChange={({ target }) => setPublished(target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label for="title" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Genre:</label>
                    <div className="flex space-x-2">
                      <input
                      value={genre}
                      onChange={({ target }) => setGenre(target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <Button onClick={addGenre} type="button">
                        Add
                      </Button>
                    </div>
                    
                  </div>
                  <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    Include genres: {genres.join(' ')}
                  </div>
                  <button type="submit" className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create Book</button>
                </form>
            </div>
        </div>
      </div>
  </section>
  )
}

export default NewBook