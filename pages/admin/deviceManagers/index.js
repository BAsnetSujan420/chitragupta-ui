import React from 'react'
import Navbar from '../../../components/layout/Navbar'
import DeviceManagersDataTable from '../../../components/dashboard/DeviceManagersDataTable'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

function DeviceManagers() {
  const router = useRouter()
  const [deviceManagers, setDeviceManagers] = useState([])

  return (
    <>
      <Navbar />
      <DeviceManagersDataTable
        deviceManagers={deviceManagers}
        setDeviceManagers={setDeviceManagers}
      />
    </>
  )
}

export default DeviceManagers
