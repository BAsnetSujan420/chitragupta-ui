import Navbar from '../../../components/layout/Navbar'
import DevicesDataTable from '../../../components/dashboard/DevicesDataTable'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Jsona from 'jsona'
import { handleUnauthorized } from '../../../lib/utils'
import { useGlobalContext } from '../../../context'

function Devices() {
  const router = useRouter()
  const [devices, setDevices] = useState([])

  return (
    <>
      <Navbar />
      <DevicesDataTable devices={devices} setDevices={setDevices} />
    </>
  )
}

export default Devices
