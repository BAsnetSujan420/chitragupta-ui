import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import DataTable from './DataTable'
import { columns } from '../../data/jobApplicantTableData'
import { fetchJobApplicants } from '../../redux/actions/dashboardActions'
import { TableContainer } from '../modalComponents'
import Modal from '../modal'
import JobApplicantForm from '../jobApplicantForm'
import { remoteUpdateJobApplicant } from '../../redux/actions/jobApplicantAction'

const JobApplicant = ({ fetchJobApplicants, remoteUpdateJobApplicant }) => {
  const [jobApplicant, setJobApplicant] = useState({})
  const [errors, setErrors] = useState({})
  const [updatingJobApplicant, setUpdatingJobApplicant] = useState(false)

  useEffect(() => {
    fetchJobApplicants()
  }, [])
    const checkIfFormIsValid = () => {
        let errorCount = 0;
        [
            'first_name',
            'last_name',
            'email',
            'primary_phone_number',
            'secondary_phone_number',
        ].forEach((field) => {
            if (jobApplicant[field] === undefined) {
                errorCount += 1
                errors[field] = "Can't be blank."
                setErrors({ ...errors })
            }
        })
         return errorCount
    }

  // updating hiring campaign
  const sendUpdateJobApplicant = async () => {
    if (checkIfFormIsValid() === 0) {
      remoteUpdateJobApplicant(jobApplicant)
      setUpdatingJobApplicant(false)
    }
  }

  const updateJobApplicant = (e) => {
    delete errors[e.target.name]
    if(
      !([
          'first_name',
          'last_name',
          'email',
          'primary_phone_number',
          'secondary_phone_number',
      ].includes(e.target.name))
    ) {
      setErrors({ ...errors, [e.target.name]: "can't be blank." })
    }
      setJobApplicant({ ...jobApplicant, [e.target.name]: e.target.value })
  }

  const updateReferrer = (e) => {
    delete errors[e.target.name]
    setJobApplicant({ ...jobApplicant, [e.target.name]: e.target.value })
  }

  return (
    <>
      <TableContainer>
        <DataTable
          rowClick={(row) => {
            setJobApplicant(row.original)
            setUpdatingJobApplicant(true)
          }}
          columns={columns}
          fetchFunction={fetchJobApplicants} />
      </TableContainer>

        {updatingJobApplicant && (
        <Modal
          showModal={updatingJobApplicant}
          setShowModal={setUpdatingJobApplicant}
          title="Update job Applicant"
        >
          <JobApplicantForm
            updateJobApplicant={updateJobApplicant}
            errors={errors}
            jobApplicant={jobApplicant}
            onSubmit={sendUpdateJobApplicant}
            title="update"
            updateReferrer={updateReferrer}
          />
        </Modal>
      )}
    </>
  )
}

export default connect(() => ({}), { fetchJobApplicants, remoteUpdateJobApplicant })(JobApplicant)
