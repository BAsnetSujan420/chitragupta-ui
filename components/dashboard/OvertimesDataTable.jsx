import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import AsyncSelect from 'react-select/async'
import DataTable from './DataTable'
import { columns } from '../../data/overtimeTableData'
import {
  fetchOvertimes,
  setShowModal,
} from '../../redux/actions/dashboardActions'
import { createOvertime } from '../../redux/actions/overtimeActions'
import Modal from '../modal'
import { Btn, Label } from '../formComponents'
import InputWithLabelAndError from '../InputWithLabelAndError'
import { TableContainer } from '../modalComponents'
import { searchRequest, fetchUsers } from "../../lib/queries";

const OvertimesDataTable = ({
  fetchOvertimes,
  createOvertime,
  setShowModal,
  approver,
  showModal,
}) => {
  const isAdmin = () => approver && approver.role === 'admin'
  const numberRegEx = /^\d*$/

  // const [showModal, setShowModal] = useState(false)
  const [overtime, setOvertime] = useState({
    approver_id: approver && approver.id,
  })
  const [userOptions, setUserOptions] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const setOptions = async () => {
      const users = await fetchUsers()
      setUserOptions(users)
    }

    setOptions()
  }, [])

  return (
    <>
      <TableContainer>
        <DataTable
          rowClick={() => console.log('')}
          columns={columns}
          fetchFunction={fetchOvertimes}
        >
          {isAdmin() && (
            <Btn
              className="bg-teal-500 hover:bg-teal-600"
              onClick={() => {
                setShowModal(true)
              }}
            >
              New Overtime
            </Btn>
          )}
        </DataTable>
      </TableContainer>

      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          title="New Overtime"
        >
          <InputWithLabelAndError
            name="seconds_tracked"
            errors={errors}
            onChange={(e) => {
              if (!e.target.value.match(numberRegEx))
                setErrors({ seconds_tracked: 'Must be a whole number.' })
              else setErrors({ seconds_tracked: null })
              setOvertime({ ...overtime, seconds_tracked: e.target.value })
            }}
          />

          <Label>Select salary</Label>
          <AsyncSelect
            onChange={(e) => {
              setOvertime({ ...overtime, user_id: e.value })
            }}
            defaultOptions={userOptions}
            loadOptions={(query) => searchRequest(query)}
          />
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={() => createOvertime(overtime)}
          >
            Submit
          </Btn>
        </Modal>
      )}
    </>
  )
}

export default connect(
  (state) => ({
    approver: state.auth.user,
    showModal: state.records.showModal,
  }),
  { fetchOvertimes, setShowModal, createOvertime },
)(OvertimesDataTable)
