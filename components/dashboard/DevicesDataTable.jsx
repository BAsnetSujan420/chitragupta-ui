import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Jsona from 'jsona'
import { Btn, Label, Select, Option } from '../formComponents'
import Modal from '../modal'
import InputWithLabelAndError from '../InputWithLabelAndError'
import DataTable from './DataTable'
import { columns } from '../../data/deviceTableData'
import { TableContainer } from '../modalComponents'
import { fetchDevices } from '../../redux/actions/dashboardActions'
import {
  createDevice,
  remoteUpdateDevice,
  remoteDestroyDevice,
} from '../../redux/actions/deviceActions'

function DevicesDataTable({
  fetchDevices,
  createDevice,
  remoteUpdateDevice,
  remoteDestroyDevice,
}) {
  const [device, setDevice] = useState({})
  const [createNewDevice, setCreateNewDevice] = useState(false)
  const [errors, setErrors] = useState({})
  const creatingNewDevice = () => setCreateNewDevice(true)
  const [deviceTypes, setDeviceTypes] = useState([])
  const [updatingDevice, setUpdatingDevice] = useState(false)
  const dataFormatter = new Jsona()

  useEffect(() => {
    const fetchDeviceTypes = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/device_types.json`,
        { headers: { Authorization: localStorage.token } },
      )

      const deviceTypes = dataFormatter.deserialize(response.data.data)
      setDeviceTypes([...deviceTypes])
    }
    fetchDeviceTypes()
  }, [])

  const checkIfFormIsValid = () => {
    let errorCount = 0
    ;['device_type_id', 'identifier', 'status'].forEach((field) => {
      if (device[field] === undefined) {
        errorCount += 1
        errors[field] = "Can't be blank."
        setErrors({ ...errors })
      }
    })
    return errorCount
  }

  const newDevice = async () => {
    if (checkIfFormIsValid() === 0) {
      createDevice(device)
      setCreateNewDevice(false)
    }
  }

  const updateDevice = (e) => {
    delete errors[e.target.name]
    setDevice({ ...device, [e.target.name]: e.target.value })
  }

  const sendRemoteUpdateRequest = () => {
    if (checkIfFormIsValid() === 0) {
      remoteUpdateDevice(device)
      setUpdatingDevice(false)
    }
  }

  const sendRemoteDestroyRequest = () => {
    remoteDestroyDevice(device)
    setDevice({ ...device })
  }

  return (
    <>
      <TableContainer>
        <div className="flex justify-end py-4">
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={creatingNewDevice}
          >
            New Device
          </Btn>
        </div>
        <DataTable
          rowClick={(row) => {
            setDevice(row.original)
            setUpdatingDevice(true)
          }}
          columns={columns}
          fetchFunction={fetchDevices}
        />
      </TableContainer>

      {createNewDevice && (
        <Modal
          showModal={createNewDevice}
          setShowModal={setCreateNewDevice}
          title="New Device"
        >
          {createNewDevice && (
            <div className="flex flex-wrap">
              <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
                Device Type
              </Label>

              <Select
                className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
                name="device_type_id"
                onChange={updateDevice}
                errrors={errors}
              >
                <Option value="" disabled selected>
                  Please Select one
                </Option>
                {deviceTypes.map((device_type) => (
                  <Option value={device_type.id} key={device_type.id}>
                    {device_type.device_type}
                  </Option>
                ))}
              </Select>

              {['identifier', 'images'].map((field) => {
                if (field === 'images') {
                  return (
                    <div className="block px-5 py-3 pr-4 mb-4 md:w-1/2">
                      <label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
                        images
                      </label>
                      <input id="image" name={field} type={'file'} />
                    </div>
                  )
                } else {
                  return (
                    <InputWithLabelAndError
                      name={field}
                      onChange={updateDevice}
                      value={device[field]}
                      errors={errors}
                    />
                  )
                }
              })}

              <div className="w-status">
                <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
                  Status
                </Label>
                <Select
                  className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
                  name="status"
                  onChange={updateDevice}
                  errrors={errors}
                >
                  <Option>Please Select one</Option>
                  <Option
                    value="available"
                    selected={device.status == 'available'}
                  >
                    available
                  </Option>
                  <Option
                    value="unavailable"
                    selected={device.status == 'unavailable'}
                  >
                    unavailable
                  </Option>
                  <Option
                    value="dysfunctional"
                    selected={device.status == 'dysfunctional'}
                  >
                    dysfunctional
                  </Option>
                </Select>
              </div>
            </div>
          )}
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={function () {
              newDevice()
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

      {updatingDevice && (
        <Modal
          showModal={updatingDevice}
          setShowModal={setUpdatingDevice}
          title="Update Device"
        >
          {updatingDevice && (
            <div className="flex flex-wrap">
              <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
                Device Type
              </Label>

              <Select
                className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
                name="device_type_id"
                onChange={updateDevice}
                value={device.device_type}
                errrors={errors}
              >
                <Option value="" disabled selected>
                  Please Select one
                </Option>
                {deviceTypes.map((device_type) => (
                  <Option value={device_type.id} key={device_type.id}>
                    {device_type.device_type}
                  </Option>
                ))}
              </Select>

              {['identifier', 'images'].map((field) => {
                if (field === 'images') {
                  return (
                    <div className="block px-5 py-3 pr-4 mb-4 md:w-1/2">
                      <label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
                        images
                      </label>
                      <input id="image" name={field} type={'file'} />
                    </div>
                  )
                } else {
                  return (
                    <InputWithLabelAndError
                      name={field}
                      onChange={updateDevice}
                      value={device[field]}
                      errors={errors}
                    />
                  )
                }
              })}

              <div className="w-status">
                <Label className="block pb-3 text-sm font-semibold text-gray-500 uppercase">
                  Status
                </Label>
                <Select
                  className="w-full px-3 py-3 text-sm border rounded-lg mt-0"
                  name="status"
                  onChange={updateDevice}
                  errrors={errors}
                >
                  <Option>Please Select one</Option>
                  <Option
                    value="available"
                    selected={device.status == 'available'}
                  >
                    available
                  </Option>
                  <Option
                    value="unavailable"
                    selected={device.status == 'unavailable'}
                  >
                    unavailable
                  </Option>
                  <Option
                    value="dysfunctional"
                    selected={device.status == 'dysfunctional'}
                  >
                    dysfunctional
                  </Option>
                </Select>
              </div>
            </div>
          )}
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
          <Btn
            className="bg-red-500 hover:bg-red-600"
            onClick={function () {
              sendRemoteDestroyRequest()
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
  fetchDevices,
  createDevice,
  remoteUpdateDevice,
  remoteDestroyDevice,
})(DevicesDataTable)
