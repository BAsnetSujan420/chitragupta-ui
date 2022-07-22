import React from 'react'
import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import DataTable from './DataTable'
import { TableContainer } from '../modalComponents'
import { columns } from '../../data/deviceUserTableData'
import { Btn, Label, Select, Option } from '../formComponents'
import InputWithLabelAndError from '../InputWithLabelAndError'
import Modal from '../modal'
import { fetchDeviceUsers } from '../../redux/actions/dashboardActions'
import {
  createDeviceUser,
  remoteUpdateDeviceUser,
} from '../../redux/actions/deviceUserActions'
// import { fetchUsers } from '../../redux/actions/usersActions'
// import { fetchDevices } from '../../redux/actions/dashboardActions'
import Jsona from 'jsona'
import axios from 'axios'

function DeviceUsersDataTable({
  createDeviceUser,
  fetchDeviceUsers,
  remoteUpdateDeviceUser,
}) {
  const [deviceUser, setDeviceUser] = useState({})
  const [createNewDeviceUser, setCreateNewDeviceUser] = useState(false)
  const [errors, setErrors] = useState({})
  const creatingNewDeviceUser = () => setCreateNewDeviceUser(true)
  const [devices, setDevices] = useState([])
  const [updatingDeviceUser, setUpdatingDeviceUser] = useState(false)
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

  // useEffect(() => console.log(deviceUser), [deviceUser])

  const checkIfFormIsValid = () => {
    let errorCount = 0
    ;['device_id', 'user_id', 'status', 'assigned_at'].forEach((field) => {
      if (deviceUser[field] === undefined) {
        errorCount += 1
        errors[field] = "Can't be blank."
        setErrors({ ...errors })
      }
    })
    if (
      deviceUser.assigned_at &&
      new Date(deviceUser.assigned_at) > new Date(deviceUser.unassigned_at)
    ) {
      errorCount += 1
      setErrors({
        ...errors,
        unassigned_at: "Can't be less than assigned date.",
      })
    }

    return errorCount
  }

  const newDeviceUser = async () => {
    if (checkIfFormIsValid() === 0) {
      createDeviceUser(deviceUser)
      setCreateNewDeviceUser(false)
    }
  }

  const updateDeviceUser = (e) => {
    delete errors[e.target.name]
    setDeviceUser({ ...deviceUser, [e.target.name]: e.target.value })
  }

  const sendRemoteUpdateRequest = () => {
    if (checkIfFormIsValid() === 0) {
      remoteUpdateDeviceUser(deviceUser)
      setUpdatingDeviceUser(false)
    }
  }

  return (
    <>
      <TableContainer>
        <div className="flex justify-end py-4">
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={creatingNewDeviceUser}
          >
            New Device User
          </Btn>
        </div>
        <DataTable
          rowClick={(row) => {
            setDeviceUser(row.original)
            setUpdatingDeviceUser(true)
          }}
          columns={columns}
          fetchFunction={fetchDeviceUsers}
        />
      </TableContainer>

      {createNewDeviceUser && (
        <Modal
          showModal={createNewDeviceUser}
          setShowModal={setCreateNewDeviceUser}
          title="New Device User"
        >
          {createNewDeviceUser && (
            <div className="flex flex-wrap">
              <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
                Device
              </Label>
              <Select
                className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
                name="device_id"
                onChange={updateDeviceUser}
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
                onChange={updateDeviceUser}
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
                  onChange={updateDeviceUser}
                  value={deviceUser[field]}
                  errors={errors}
                  type={'date'}
                />
              ))}

              <div className="w-status">
                <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
                  Status
                </Label>
                <Select
                  className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
                  name="status"
                  onChange={updateDeviceUser}
                  errrors={errors}
                >
                  <Option value="" disabled selected>
                    Please Select one
                  </Option>
                  <Option
                    value="active"
                    selected={deviceUser.status == 'active'}
                  >
                    Active
                  </Option>
                  <Option
                    value="inactive"
                    selected={deviceUser.status == 'inactive'}
                  >
                    Inactive
                  </Option>
                </Select>
              </div>
            </div>
          )}
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={function () {
              newDeviceUser()
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

      {updatingDeviceUser && (
        <Modal
          showModal={updatingDeviceUser}
          setShowModal={setUpdatingDeviceUser}
          title="Update Device User"
        >
          <div className="flex flex-wrap">
            <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
              Device
            </Label>
            <Select
              className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
              name="device_id"
              onChange={updateDeviceUser}
              value={deviceUser.device_id}
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
              onChange={updateDeviceUser}
              value={deviceUser.user_id}
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
                onChange={updateDeviceUser}
                value={deviceUser[field]?.slice(0, 10)}
                errors={errors}
                type={'date'}
              />
            ))}

            <div className="w-status">
              <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
                Status
              </Label>
              <Select
                className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
                name="status"
                onChange={updateDeviceUser}
                value={deviceUser.status}
                errrors={errors}
              >
                <Option value="" disabled selected>
                  Please Select one
                </Option>
                <Option value="active" selected={deviceUser.status == 'active'}>
                  Active
                </Option>
                <Option
                  value="inactive"
                  selected={deviceUser.status == 'inactive'}
                >
                  Inactive
                </Option>
              </Select>
            </div>
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
  fetchDeviceUsers,
  createDeviceUser,
  remoteUpdateDeviceUser,
})(DeviceUsersDataTable)
