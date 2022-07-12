import { connect } from 'react-redux'
import { useState, useEffect } from 'react'
import DataTable from './DataTable'
import { columns } from '../../data/secretSantaTableData'
import { TableContainer } from '../modalComponents'
import { Btn } from '../formComponents'
import Modal from '../modal'
import InputWithLabelAndError from '../InputWithLabelAndError'
import { fetchSecretSantaSeason } from '../../redux/actions/dashboardActions'
import { createSecretSantaSeason } from '../../redux/actions/secretSantaSeasonAction'
import { searchRequest, fetchUsers } from '../../lib/queries'
import AsyncSelect from 'react-select/async'
import Select from 'react-select'

const SecretSantaDataTable = ({
  fetchSecretSantaSeason,
  createSecretSantaSeason,
}) => {
  const [season, setSeason] = useState({})
  const [createNewSeason, setCreateNewSeason] = useState(false)
  const [userOptions, setUserOptions] = useState([])

  const [errors, setErrors] = useState({})

  const creatingNewSeason = () => setCreateNewSeason(true)
  const validRegEx = /^[\w ]*$/

  useEffect(() => {
    const setOptions = async () => {
      const users = await fetchUsers()
      setUserOptions(users)
    }

    setOptions()
  }, [])

  //this is required because if we submit empty form we are getting error but status is stil 200:OK
  const checkIfFormIsValid = () => {
    let errorCount = 0
    ;['title', 'year', 'remarks', 'status', 'manager_id'].forEach((field) => {
      if (season[field] === undefined) {
        errorCount += 1
        setErrors({ ...errors, [field]: "Can't be blank." })
      } else if (!String(season[field]).match(validRegEx)) {
        errorCount += 1
        setErrors({ ...errors, [field]: 'empty' })
      }
    })

    return errorCount
  }

  const newSeason = async () => {
    if (checkIfFormIsValid() === 0) {
      createSecretSantaSeason(season)
      setCreateNewSeason(false)
    }
  }

  const options = [
    { value: 'active', label: 'Active' },
    { value: 'frozen', label: 'Frozen' },
    { value: 'archived', label: 'Archived' },
  ]

  return (
    <>
      <TableContainer>
        <div className="flex justify-end py-4">
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={creatingNewSeason}
          >
            Create New Season
          </Btn>
        </div>

        <DataTable columns={columns} fetchFunction={fetchSecretSantaSeason} />
      </TableContainer>
      {createNewSeason && (
        <Modal
          showModal={createNewSeason}
          setShowModal={setCreateNewSeason}
          title="Create New Season"
        >
          <div className="flex flex-wrap">
            {['title', 'year', 'remarks'].map((field) => (
              <InputWithLabelAndError
                name={field}
                onChange={(e) => {
                  setSeason({ ...season, [e.target.name]: e.target.value })
                }}
                value={season[field]}
                errors={errors}
              />
            ))}
            {/* <Select
              value={season}
              onChange={(e) => {
                setSeason({ ...season, status: e.target.value })
              }}
            >
              <Option value="active">active</Option>
              <Option value="archived">archived</Option>
              <Option value="frozen">frozen</Option>
            </Select> */}
          </div>
          <div className="flex flex-wrap">
            <Select
              placeholder={<p>Select Status</p>}
              className="w-40"
              onChange={(e) => {
                setSeason({ ...season, status: e.value })
              }}
              options={options}
            />
            <AsyncSelect
              placeholder="Select Manager"
              className="w-48"
              name="manager_id"
              onChange={(e) => {
                setSeason({ ...season, manager_id: e.value })
              }}
              defaultOptions={userOptions}
              loadOptions={(query) => searchRequest(query)}
            />
          </div>

          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={() => newSeason()}
          >
            Submit
          </Btn>
        </Modal>
      )}
    </>
  )
}

export default connect(() => ({}), {
  fetchSecretSantaSeason,
  createSecretSantaSeason,
})(SecretSantaDataTable)
