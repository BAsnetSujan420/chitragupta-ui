import Navbar from '../../../components/layout/Navbar'
import DeviceTypesDataTable from '../../../components/dashboard/DeviceTypesDataTable'
import { useState } from 'react'
import { useRouter } from 'next/router'

function DeviceTypes() {
  const router = useRouter()
  const [deviceTypes, setDeviceTypes] = useState([])
  return (
    <>
      <Navbar />
      <DeviceTypesDataTable
        deviceTypes={deviceTypes}
        setDeviceTypes={setDeviceTypes}
      />
    </>
  )
}

export default DeviceTypes
