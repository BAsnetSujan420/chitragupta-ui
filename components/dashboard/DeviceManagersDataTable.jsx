import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Jsona from 'jsona'
import { Btn, Label, Select, Option } from '../formComponents'
import Modal from '../modal'
import InputWithLabelAndError from '../InputWithLabelAndError'
import DataTable from './DataTable'
import { columns } from '../../data/deviceManagerTableData'
import { TableContainer } from '../modalComponents'
import { fetchDeviceManagers } from '../../redux/actions/dashboardActions'
import {
  createDeviceManager,
  remoteUpdateDeviceManager,
} from '../../redux/actions/deviceManagerActions'

function DeviceManagersDataTable({
  createDeviceManager,
  remoteUpdateDeviceManager,
  fetchDeviceManagers,
}) {
  const [deviceManager, setDeviceManager] = useState({})
  const [createNewDeviceManager, setCreateNewDeviceManager] = useState(false)
  const [errors, setErrors] = useState({})
  const creatingNewDeviceManager = () => setCreateNewDeviceManager(true)
  const [updatingDeviceManager, setUpdatingDeviceManager] = useState(false)
  const [devices, setDevices] = useState([])
  const [users, setUsers] = useState([])
  const dataFormatter = new Jsona()

  useEffect(() => {
    const fetchDevices = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/devices.json`,
        { headers: { Authorization: localStorage.token } },
      )

      const devices = dataFormatter.deserialize(response.data.data)
      setDevices([...devices])
    }
    fetchDevices()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/users.json`,
        { headers: { Authorization: localStorage.token } },
      )

      const users = dataFormatter.deserialize(response.data.data)
      setUsers([...users])
    }
    fetchUsers()
  }, [])

  // useEffect(() => console.log(deviceManager), [deviceManager])

  const checkIfFormIsValid = () => {
    let errorCount = 0
    ;['device_id', 'user_id', 'assigned_at'].forEach((field) => {
      if (deviceManager[field] === undefined) {
        errorCount += 1
        errors[field] = "Can't be blank."
        setErrors({ ...errors })
      }
    })
    if (
      deviceManager.assigned_at &&
      new Date(deviceManager.assigned_at) >
        new Date(deviceManager.unassigned_at)
    ) {
      errorCount += 1
      setErrors({
        ...errors,
        unassigned_at: "Can't be less than assigned date.",
      })
    }

    return errorCount
  }

  const newDeviceManager = async () => {
    if (checkIfFormIsValid() === 0) {
      createDeviceManager(deviceManager)
      setCreateNewDeviceManager(false)
    }
  }

  const updateDeviceManager = (e) => {
    delete errors[e.target.name]
    setDeviceManager({ ...deviceManager, [e.target.name]: e.target.value })
  }

  const sendRemoteUpdateRequest = () => {
    if (checkIfFormIsValid() === 0) {
      remoteUpdateDeviceManager(deviceManager)
      setUpdatingDeviceManager(false)
    }
  }

  return (
    <>
      <TableContainer>
        <div className="flex justify-end py-4">
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={creatingNewDeviceManager}
          >
            New Device Manager
          </Btn>
        </div>
        <DataTable
          rowClick={(row) => {
            setDeviceManager(row.original)
            setUpdatingDeviceManager(true)
          }}
          columns={columns}
          fetchFunction={fetchDeviceManagers}
        />
      </TableContainer>

      {createNewDeviceManager && (
        <Modal
          showModal={createNewDeviceManager}
          setShowModal={setCreateNewDeviceManager}
          title="New Device Manager"
        >
          {createNewDeviceManager && (
            <div className="flex flex-wrap">
              <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
                Device
              </Label>
              <Select
                className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
                name="device_id"
                onChange={updateDeviceManager}
                errrors={errors}
              >
                <Option value="" disabled selected>
                  Please Select one
                </Option>
                {devices.map((device) => (
                  <Option value={device.id} key={device.id}>
                    {device.identifier}
                  </Option>
                ))}
              </Select>

              <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
                User
              </Label>
              <Select
                className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
                name="user_id"
                onChange={updateDeviceManager}
                errrors={errors}
              >
                <Option value="" disabled selected>
                  Please Select one
                </Option>
                {users.map((user) => (
                  <Option value={user.id} key={user.id}>
                    {user.first_name} {user.last_name}
                  </Option>
                ))}
              </Select>

              {['assigned_at', 'unassigned_at'].map((field) => (
                <InputWithLabelAndError
                  name={field}
                  onChange={updateDeviceManager}
                  value={deviceManager[field]}
                  errors={errors}
                  type={'date'}
                />
              ))}
            </div>
          )}
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={function () {
              newDeviceManager()
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

      {updatingDeviceManager && (
        <Modal
          showModal={updatingDeviceManager}
          setShowModal={setUpdatingDeviceManager}
          title="Update Device Manager"
        >
          <div className="flex flex-wrap">
            <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
              Device
            </Label>
            <Select
              className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
              name="device_id"
              onChange={updateDeviceManager}
              value={deviceManager.device_id}
              errrors={errors}
            >
              <Option value="" disabled selected>
                Please Select one
              </Option>
              {devices.map((device) => (
                <Option value={device.id} key={device.id}>
                  {device.identifier}
                </Option>
              ))}
            </Select>

            <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
              User
            </Label>
            <Select
              className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
              name="user_id"
              onChange={updateDeviceManager}
              value={deviceManager.user_id}
              errrors={errors}
            >
              <Option value="" disabled selected>
                Please Select one
              </Option>
              {users.map((user) => (
                <Option value={user.id} key={user.id}>
                  {user.first_name} {user.last_name}
                </Option>
              ))}
            </Select>

            {['assigned_at', 'unassigned_at'].map((field) => (
              <InputWithLabelAndError
                name={field}
                onChange={updateDeviceManager}
                value={deviceManager[field]?.slice(0, 10)}
                errors={errors}
                type={'date'}
              />
            ))}
          </div>

          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={function () {
              sendRemoteUpdateRequest()
              {
                setTimeout(function () {
                  window.location.reload()
                })
              }
            }}
          >
            Update
          </Btn>
        </Modal>
      )}
    </>
  )
}

export default connect(() => ({}), {
  fetchDeviceManagers,
  createDeviceManager,
  remoteUpdateDeviceManager,
})(DeviceManagersDataTable)
