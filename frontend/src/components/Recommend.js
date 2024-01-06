import { Typography, Card } from "@material-tailwind/react"

const Recommend = ({ show, user, books }) => {

  const favoriteGenre = user ? user.favoriteGenre : null

    if (!show) {
        return null
    }

    const filteredBook = books.filter(book => book.genres.includes(favoriteGenre))

    const TABLE_HEAD = ["Book", "Author", "Published"];

    return (
        <div>
          <Typography className='my-8 text-center text-4xl font-extrabold'>
            Recommendations
          </Typography>
          <div className="mx-2">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
            Books in your favorite genres: 
            </h3>
            <p className="my-1 max-w-2xl text-sm leading-6 text-gray-500">{favoriteGenre}</p>
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
                  <td>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {a.author.name}
                    </Typography>
                  </td>
                  <td>
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

export default Recommend