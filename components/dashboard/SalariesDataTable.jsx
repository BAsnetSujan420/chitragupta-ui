import { connect } from 'react-redux'
import { useState } from 'react'
import DataTable from './DataTable'
import { columns } from '../../data/salariesTableData'
import { TableContainer } from '../modalComponents'
import { Btn } from '../formComponents'
import Modal from '../modal'
import InputWithLabelAndError from '../InputWithLabelAndError'
import { fetchSalaries } from '../../redux/actions/dashboardActions'
import { createSalary, uploadSalaryCSV } from '../../redux/actions/salaryActions'
import { returnErrors } from "../../redux/actions/alertActions";

const SalariesDataTable = ({ fetchSalaries, createSalary, uploadSalaryCSV, returnErrors }) => {
  const [salary, setSalary] = useState({})
  const [createNewSalary, setCreateNewSalary] = useState(false)
  const [uploadingCSV, setUploadingCSV] = useState(false)
  const [errors, setErrors] = useState({})

  const creatingNewSalary = () => setCreateNewSalary(true)
  const numberRegEx = /^\d+.?\d*$/

  const updateSalary = (e) => {
    delete errors[e.target.name]
    if (!e.target.value.match(numberRegEx))
      setErrors({ ...errors, [e.target.name]: 'Must be a number.' })
    setSalary({ ...salary, [e.target.name]: e.target.value })
  }

  // this is required because if we submit empty form we are getting error but status is stil 200:OK
  const checkIfFormIsValid = () => {
    let errorCount = 0
    ;[
      'basic_salary',
      'commitment_bonus',
      'allowance',
      'festival_bonus',
    ].forEach((field) => {
      if (salary[field] === undefined) {
        errorCount += 1
        setErrors({ ...errors, [field]: "Can't be blank." })
      } else if (!String(salary[field]).match(numberRegEx)) {
        errorCount += 1
        setErrors({ ...errors, [field]: 'Must be a number.' })
      }
    })

    return errorCount
  }

  const newSalary = async () => {
    if (checkIfFormIsValid() === 0) {
      createSalary(salary)
      setCreateNewSalary(false)
    }
  }

  return (
    <>
      <TableContainer>
        <div className="flex justify-end py-4">
          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={creatingNewSalary}
          >
            New Salary
          </Btn>

          <Btn
            className="bg-teal-500 hover:bg-teal-600 mx-4"
            onClick={() => {
              setUploadingCSV(true)
            }}
          >
            Bulk Upload
          </Btn>
        </div>

        <DataTable columns={columns} fetchFunction={fetchSalaries} />
      </TableContainer>
      {createNewSalary && (
        <Modal
          showModal={createNewSalary}
          setShowModal={setCreateNewSalary}
          title="New Salary"
        >
          <div className="flex flex-wrap">
            {[
              'basic_salary',
              'commitment_bonus',
              'allowance',
              'festival_bonus',
              'life_insurance_deduction',
            ].map((field) => (
              <InputWithLabelAndError
                name={field}
                onChange={updateSalary}
                value={salary[field]}
                errors={errors}
              />
            ))}
          </div>

          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={() => newSalary()}
          >
            Submit
          </Btn>
        </Modal>
      )}

      {uploadingCSV && (
        <Modal
          showModal={uploadingCSV}
          setShowModal={setUploadingCSV}
          title="New Salary"
        >
          <input
            type="file"
            id="salary-csv-upload"
          />

          <Btn
            className="bg-teal-500 hover:bg-teal-600"
            onClick={() => {
              const csv = document.querySelector("#salary-csv-upload")
              if (!csv.files[0]) {
                returnErrors('Please select a valid file', 400)
              } else {
                const formData = new FormData()
                formData.append('salaryCSVFile', csv.files[0])
                uploadSalaryCSV(formData)
                setUploadingCSV(false)
              }
            }}
          >
            Submit
          </Btn>
        </Modal>
      )}
    </>
  )
}

export default connect(() => ({}), { fetchSalaries, createSalary, uploadSalaryCSV, returnErrors })(
  SalariesDataTable,
)
