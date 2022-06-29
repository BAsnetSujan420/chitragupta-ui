import { useEffect, useState } from 'react'
import { connect} from 'react-redux'
import axios from 'axios'
import Jsona from 'jsona'
import DataTable from './DataTable'
import { columns } from '../../data/hiringCampaignTableData'
import { TableContainer } from '../modalComponents'
import { Btn } from '../formComponents'
import Modal from '../modal'
import { fetchHiringCampaigns } from '../../redux/actions/dashboardActions'
import HiringCampaignForm from '../hiringCampaignForm'

const HiringCampaign = ({ fetchHiringCampaign }) => {
  const [hiringCampaign, setHiringCampaign] = useState({})
  const [createNew, setCreateNew] = useState(false)
  const [errors, setErrors] = useState({})
  const [updatingHiringCampaign, setUpdatingHiringCampaign] = useState(false)
  const dataFormatter = new Jsona()
  const creatingNew = () => setCreateNew(true)

  useEffect(() => {
    fetchHiringCampaign()
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
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/hiring_campaign`,
          {
            hiring_campaign: {
              ...hiringCampaign,
            },
          },
          {
            headers: {
              Authorization: localStorage.token,
            },
          },
        )
         window.location.reload()
        if (response.statusText === 'OK') {
          setHiringCampaign([
            dataFormatter.deserialize(response.data),
            ...hiringCampaign,
          ])
          setCreateNew(false)
          setHiringCampaign({})

        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // updating hiring campaign
  const remoteUpdateHiringCampaign = async () => {
    if (checkIfFormIsValid() === 0) {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/hiring_campaign/${hiringCampaign.id}.json`,
          {
            hiring_campaign: {
              ...hiringCampaign,
            },
          },
          {
            headers: {
              Authorization: localStorage.token,
            },
          },
        )
        window.location.reload()
      } catch (error) {
        console.log(error);
      }
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
          fetchFunction={fetchHiringCampaign} />
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
            onSubmit={remoteUpdateHiringCampaign}
          />
        </Modal>
      )}
    </>
  )
}

const mapStateToProps = (state) => (
   {
    hiringCampaigns: state.records,
  }
)
const mapDispatchToProps = (dispatch) => (
  {
    fetchHiringCampaign: () => dispatch(fetchHiringCampaigns()),
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(HiringCampaign)
