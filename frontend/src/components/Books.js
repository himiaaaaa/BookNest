import { useState } from 'react'
import {
  Card,
  Button,
  Typography,
} from "@material-tailwind/react"

const Books = ({show, books}) => {
  const [filter, setFilter] = useState('All genres')

  const genreDuplicateArray = books.map(b => b.genres).flat()

  const genres = [...new Set(genreDuplicateArray)] //uses the Set object to remove duplicate values from the genreDuplicateArray

  genres.unshift("All genres")

  console.log('genreArray', genres)

  //const genres = ["refactoring", "agile", "patterns", "design", "crime", "classic", "all genres"]

  if (!show) {
    return null
  }

  const filteredBook = books.filter(book => filter === 'All genres'? book : book.genres.includes(filter))

  const TABLE_HEAD = ["Book", "Author", "Published"];

  return (
    <div>
      <Typography className='my-8 text-center text-4xl font-extrabold'>
          About Books
      </Typography>

      <div className='mx-2'>
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Choose the genre: 
        </h3>
        <p className="my-1 max-w-2xl text-sm leading-6 text-gray-500">{filter}</p>

        <div>
          {genres.map((g) => (
              <Button 
                onClick={() => setFilter(g)}
                className='px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white'
              >
                {g}
              </Button>
            ))}
        </div>
      </div>

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
          {filteredBook.map((a) => (
            <tr key={a.title}>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                  {a.title}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                  {a.author.name}
                </Typography>
              </td>
              <td className="p-4 border-b border-blue-gray-50">
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                >
                  {a.published}
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </Card>
    </div>
  )
}

export default Books
