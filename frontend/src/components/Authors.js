import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import {
  Card,
  Button,
  Typography,
} from "@material-tailwind/react";

const Authors = ({show, authors, setError}) => {
  const[name, setName] = useState('')
  const[born, setBorn] = useState('')

  const [ changeAuthor, result ] = useMutation(EDIT_AUTHOR, {
    refetchQueries:[{ query: ALL_AUTHORS }],
  })
  
  const submit = (event) => {
    event.preventDefault()

    changeAuthor({ variables: { name, born } })

    setName('')
    setBorn('')
  }

  useEffect(() => {
    if(result.data && result.data.editAuthor === null){
      setError('person not found')
    }
  }, [result.data]) // eslint-disable-line 
 
  if (!show) {
    return null
  }

  const TABLE_HEAD = ["Author", "Born", "Book Number"];

  return (
    <div>
        <Typography className='my-8 text-center text-4xl font-extrabold'>
          About Authors
        </Typography>
      <Card className="h-full w-full overflow-scroll"> 
        <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {authors.map((a) => {
            const classes = "p-4 border-b border-blue-gray-50"
            return (
            <tr key={a.id} className="even:bg-blue-gray-50/50">
              <td className={classes}>
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                  {a.name}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {a.born}
                </Typography>
              </td>
              <td className={classes}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {a.bookCount}
                </Typography>
              </td>
            </tr>
          )}
          )}
        </tbody>
      </table>
      </Card>
      
      
      <Card color="transparent" className="h-full w-full overflow-scroll flex items-center" shadow={false}>
        
        <Typography variant="h4" color="blue-gray" className='mt-10'>
          Set Birthyear
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          ---- Select a author to update the birthday ----
        </Typography>
            <form onSubmit={submit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select an option
            </label>
              <select 
                value={name} 
                onChange={({ target }) => setName(target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {authors.map(a => 
                  <option value={a.name} key={a.name}>
                    {a.name}
                  </option>
                )}
              </select>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white my-5">
              Born
            </label>
            <input 
              value={born}
              onChange={({target}) => setBorn(target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div>
            <Button type='submit' className="mt-6 py-3" fullWidth>
              update author
            </Button>
          </div>
              
        </form>
      </Card>
      
    </div>
  )
}

export default Authors
