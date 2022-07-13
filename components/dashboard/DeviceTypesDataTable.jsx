import DataTable from './DataTable'
import Modal from '../modal'
import { Btn } from '../formComponents'
import { useState } from 'react'
import { connect } from 'react-redux'
import { columns } from '../../data/deviceTypeTableData'
import { TableContainer } from '../modalComponents'
import { fetchDeviceTypes } from '../../redux/actions/dashboardActions'
import {
  createDeviceType,
  remoteUpdateDeviceType,
  remoteDestroyDeviceType,
} from '../../redux/actions/deviceTypeActions'
import InputWithLabelAndError from '../InputWithLabelAndError'

function DeviceTypesDataTable({
  fetchDeviceTypes,
  createDeviceType,
  remoteUpdateDeviceType,
  remoteDestroyDeviceType,
}) {
  const [deviceType, setDeviceType] = useState({})
  const [createNewDeviceType, setCreateNewDeviceType] = useState(false)
  const [errors, setErrors] = useState({})
  const creatingNewDeviceType = () => setCreateNewDeviceType(true)
  const [updatingDeviceType, setUpdatingDeviceType] = useState(false)

  const checkIfFormIsValid = () => {
    let errorCount = 0
    ;['device_type'].forEach((field) => {
      if (deviceType[field] === undefined) {
        errorCount += 1
        errors[field] = "Can't be blank."
        setErrors({ ...errors })
      }
    })
    return errorCount
  }

  function newDeviceType() {
    if (checkIfFormIsValid() === 0) {
      createDeviceType(deviceType)
      setCreateNewDeviceType(false)
    }
  }

  function newUpdateDeviceType() {
    if (checkIfFormIsValid() === 0) {
      remoteUpdateDeviceType(deviceType)
      setUpdatingDeviceType(false)
    }
  }

  function deleteDeviceType() {
    remoteDestroyDeviceType(deviceType)
    setDeviceType({ ...deviceType })
  }

  const updateDeviceType = (e) => {
    delete errors[e.target.name]
    setDeviceType({ ...deviceType, [e.target.name]: e.target.value })
  }

  return (
    <>
      <TableContainer>
        <div className="flex justify-end py-4">
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={creatingNewDeviceType}
          >
            New Device Type
          </Btn>
        </div>

        <DataTable
          rowClick={(row) => {
            setDeviceType(row.original)
            setUpdatingDeviceType(true)
          }}
          columns={columns}
          fetchFunction={fetchDeviceTypes}
        />
      </TableContainer>

      {createNewDeviceType && (
        <Modal
          showModal={createNewDeviceType}
          setShowModal={setCreateNewDeviceType}
          title="New Device Type"
        >
          {createNewDeviceType && (
            <div className="flex flex-wrap">
              {['device_type'].map((field) => (
                <InputWithLabelAndError
                  name={field}
                  onChange={updateDeviceType}
                  value={deviceType[field]}
                  errors={errors}
                />
              ))}
            </div>
          )}
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={function () {
              newDeviceType()
              {
                setTimeout(function () {
                  window.location.reload()
                })
              }
            }}
          >
            Submit
          </Btn>
        </Modal>
      )}

      {updatingDeviceType && (
        <Modal
          showModal={updatingDeviceType}
          setShowModal={setCreateNewDeviceType}
          title="Update Device Type"
        >
          {updatingDeviceType && (
            <div className="flex flex-wrap">
              {['device_type'].map((field) => (
                <InputWithLabelAndError
                  name={field}
                  onChange={updateDeviceType}
                  value={deviceType[field]}
                  errors={errors}
                />
              ))}
            </div>
          )}
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={function () {
              newUpdateDeviceType()
              {
                setTimeout(function () {
                  window.location.reload()
                })
              }
            }}
          >
            Update
          </Btn>
          <Btn
            className="bg-red-500 hover:bg-red-600"
            onClick={function () {
              deleteDeviceType()
              {
                setTimeout(function () {
                  window.location.reload()
                })
              }
            }}
          >
            Delete
          </Btn>
        </Modal>
      )}
    </>
  )
}

export default connect(() => ({}), {
  fetchDeviceTypes,
  createDeviceType,
  remoteUpdateDeviceType,
  remoteDestroyDeviceType,
})(DeviceTypesDataTable)
