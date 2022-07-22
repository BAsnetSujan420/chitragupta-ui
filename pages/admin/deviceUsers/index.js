import React from 'react'
import Navbar from '../../../components/layout/Navbar'
import DeviceUsersDataTable from '../../../components/dashboard/DeviceUsersDataTable'
import { useRouter } from 'next/router'
import { useState } from 'react'

function DeviceUsers() {
  const router = useRouter()
  const [deviceUsers, setDeviceUsers] = useState([])
  return (
    <>
      <Navbar />
      <DeviceUsersDataTable
        deviceUsers={deviceUsers}
        setDeviceUsers={setDeviceUsers}
      />
    </>
  )
}

export default DeviceUsers
