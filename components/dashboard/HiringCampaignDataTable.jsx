import { useEffect, useState } from 'react'
import { connect} from 'react-redux'
import DataTable from './DataTable'
import { columns } from '../../data/hiringCampaignTableData'
import { TableContainer } from '../modalComponents'
import { Btn } from '../formComponents'
import Modal from '../modal'
import { fetchHiringCampaigns } from '../../redux/actions/dashboardActions'
import HiringCampaignForm from '../hiringCampaignForm'
import { createNewHiringCampaign, remoteUpdateHiringCampaign } from '../../redux/actions/hiringCampaignAction'

const HiringCampaign = ({ fetchHiringCampaigns, createNewHiringCampaign, remoteUpdateHiringCampaign }) => {
  const [hiringCampaign, setHiringCampaign] = useState({})
  const [createNew, setCreateNew] = useState(false)
  const [errors, setErrors] = useState({})
  const [updatingHiringCampaign, setUpdatingHiringCampaign] = useState(false)
  const creatingNew = () => setCreateNew(true)

  useEffect(() => {
    fetchHiringCampaigns()
  }, [])

 const checkIfFormIsValid = () => {
   let errorCount = 0;
   [
          'start_date',
          'end_date',
          'job_title',
          'job_description',
          'remarks',
          'status',
    ].forEach((field) => {
      if (hiringCampaign[field] === undefined) {
        errorCount += 1
        errors[field] = "Can't be blank."
        setErrors({ ...errors })
      }
    })

   // End date is greater than  start date
    if (
      hiringCampaign.start_date &&
      new Date(hiringCampaign.start_date) > new Date(hiringCampaign.end_date)
    ) {
      errorCount += 1
      setErrors({
        ...errors,
        start_date: "Can't be greater than end Date.",
        end_date: "Can't be less than start Date.",
      })
    }
    return errorCount
 }

  // create new hiring campaign
  const createHiringCampaign = async () => {
    if (checkIfFormIsValid() === 0) {
      createNewHiringCampaign(hiringCampaign)
      setCreateNew(false)
    }
  }

  // updating hiring campaign
  const sendUpdateHiringCampaign = async () => {
    if (checkIfFormIsValid() === 0) {
      remoteUpdateHiringCampaign(hiringCampaign)
      setUpdatingHiringCampaign(false)
    }
  }

  const updateHiringCampaign = (e) => {
    delete errors[e.target.name]
    if(
      !([
          'start_date',
          'end_date',
          'job_title',
          'job_description',
          'remarks',
          'status',
      ].includes(e.target.name))
    ) {
      setErrors({ ...errors, [e.target.name]: "can't be blank." })
    }
    setHiringCampaign({ ...hiringCampaign, [e.target.name]: e.target.value})
  }

  return (
    <>
      <TableContainer>
        <div className="flex justify-end py-4">
          <Btn className="bg-teal-500 hover:bg-teal-600" onClick={creatingNew}>
            New Hiring Campaign
          </Btn>
        </div>

        <DataTable
          rowClick={(row) => {
            setHiringCampaign(row.original)
            setUpdatingHiringCampaign(true)
          }}
          columns={columns}
          fetchFunction={fetchHiringCampaigns} />
      </TableContainer>

      {createNew && (
        <Modal
          showModal={createNew}
          setShowModal={setCreateNew}
          title="New Hiring Campaign"
        >
          <HiringCampaignForm
            onSubmit={createHiringCampaign}
            errors={errors}
            hiringCampaign={hiringCampaign}
            setHiringCampaign={setHiringCampaign}
            updateHiringCampaign={updateHiringCampaign}
          />
        </Modal>
      )}

      {updatingHiringCampaign && (
        <Modal
          showModal={updatingHiringCampaign}
          setShowModal={setUpdatingHiringCampaign}
          title="Update Hiring Campaign"
        >
          <HiringCampaignForm
            updateHiringCampaign={updateHiringCampaign}
            errors={errors}
            hiringCampaign={hiringCampaign}
            onSubmit={sendUpdateHiringCampaign}
          />
        </Modal>
      )}
    </>
  )
}

export default connect(() => ({}), { fetchHiringCampaigns, createNewHiringCampaign, remoteUpdateHiringCampaign })(HiringCampaign)
