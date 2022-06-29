import { useState } from 'react'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import axios from 'axios'
import { columns } from '../../data/usersTableData'
import { Btn } from '../formComponents'
import DataTable from './DataTable'
import Alert from '../alert'
import { fetchUsers } from '../../redux/actions/usersActions'

const UsersDataTable = ({ fetchUsers }) => {
  // const { users } = useGlobalContext()
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const rowClick = (row) => router.push(`/admin/users/${row.original.id}`)

  // const exportData = users.map((d) => Object.values(d))

  const handleBulkImport = async () => {
    setError('')
    setSuccess('')

    const formData = new FormData()
    const csv = document.querySelector('#file-upload')

    formData.append('userFile', csv.files[0])

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/create_users`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: localStorage.token,
          },
        },
      )

      if (response.statusText === 'OK') {
        setSuccess(response.data.message)
      }
    } catch (rerror) {
      setError(
        (rerror.response && rerror.response.data.message) || rerror.message,
      )
    }
  }

  return (
    <>
      <Alert
        success={error === ''}
        message={error}
        show={error !== ''}
        setError={setError}
        setSuccess={setSuccess}
      />
      <Alert
        success={success !== ''}
        message={success}
        show={success !== ''}
        setError={setError}
        setSuccess={setSuccess}
      />
      <DataTable
        rowClick={rowClick}
        columns={columns}
        fetchFunction={fetchUsers}
      >
        <div className="flex justify-between my-4">
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={() => document.getElementById('file-upload').click()}
          >
            Bulk Upload
          </Btn>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleBulkImport}
          />

          {/* <Btn className="bg-teal-500 hover:bg-teal-600">
            <CSVLink
              // data={exportData}
              filename={`${new Date().toISOString().slice(0, 18)}_report.csv`}
            >
              Export Data
            </CSVLink>
          </Btn> */}
        </div>
      </DataTable>
    </>
  )
}

export default connect(() => ({}), { fetchUsers })(UsersDataTable)
