import {  useState } from 'react'
import { connect } from 'react-redux'
import DataTable from './DataTable'
import { columns } from '../../data/salarySettingsTableData'
import { TableContainer } from '../modalComponents'
import { Btn } from '../formComponents'
import Modal from '../modal'
import SalarySettingForm from '../salarySettingForm'
import { fetchSalarySettings } from '../../redux/actions/dashboardActions'
import {createNewSalarySetting, remoteUpdateSalarySetting} from '../../redux/actions/salarySettingActions'

const SalariesDataTable = ({
  fetchSalarySettings,
  createNewSalarySetting,
  remoteUpdateSalarySetting
}) => {
  const [salarySetting, setSalarySetting] = useState({})
  const [createNew, setCreateNew] = useState(false)
  const [errors, setErrors] = useState({})
  const [taxRules, setTaxRules] = useState([])
  const [updatingSalarySetting, setUpdatingSalarySetting] = useState(false)

  const creatingNew = () => setCreateNew(true)
  const numberRegEx = /^\d+.?\d*$/

  // this is required because if we submit empty form we are getting error but status is stil 200:OK
  const checkIfFormIsValid = () => {
    let errorCount = 0
    ;[
      'ssf_office',
      'ssf_employee',
      'life_insurance_max',
      'ssf_tax_exemption_rate',
      'ssf_tax_exemption_max',
      'from_date',
    ].forEach((field) => {
      if (salarySetting[field] === undefined) {
        errorCount += 1
        errors[field] = "Can't be blank."
        setErrors({ ...errors })
      }
    })

    // make sure to_date is greater than from_date
    if (
      salarySetting.to_date &&
      new Date(salarySetting.from_date) > new Date(salarySetting.to_date)
    ) {
      errorCount += 1
      setErrors({
        ...errors,
        from_date: "Can't be greater than To Date.",
        to_date: "Can't be less than From Date.",
      })
    }

    // make sure each field in tax rules are valid
    taxRules.forEach((taxRule) => {
      ;['amount_from', 'amount_to', 'rate'].forEach((field) => {
        if (taxRule[`${field}_${taxRule.id || taxRule.key}`] === undefined) {
          errorCount += 1

          errors[`${field}_${taxRule.id || taxRule.key}`] = "Can't be blank."
          setErrors({ ...errors })
        } else if (
          !taxRule[`${field}_${taxRule.id || taxRule.key}`].match(numberRegEx)
        ) {
          errorCount += 1

          errors[`${field}_${taxRule.id || taxRule.key}`] = 'Must be a number.'
          setErrors({ ...errors })
        }
      })
    })

    return errorCount
  }

  const createSalarySetting = () => {
    if (checkIfFormIsValid() === 0) {
      createNewSalarySetting(salarySetting, taxRules)
      setCreateNew(false)
    }
  }

  const sendUpdateSalarySettingRequest = () => {
    if (checkIfFormIsValid() === 0) {
      remoteUpdateSalarySetting(salarySetting, taxRules)
      setUpdatingSalarySetting(false)
    }
  }

  const updateSalarySetting = (e) => {
    delete errors[e.target.name]
    if (
      [
        'ssf_office',
        'ssf_employee',
        'life_insurance_max',
        'ssf_tax_exemption_rate',
        'ssf_tax_exemption_max',
      ].includes(e.target.name) &&
      !e.target.value.match(numberRegEx)
    ) {
      setErrors({ ...errors, [e.target.name]: 'Must be a number.' })
    }
    setSalarySetting({ ...salarySetting, [e.target.name]: e.target.value })
  }

  const updateTaxRules = (e) => {
    if (!e.target.value.match(numberRegEx)) {
      setErrors({ ...errors, [e.target.name]: 'Must be a number.' })
    } else {
      setErrors({ ...errors, [e.target.name]: null })
    }
    const index = taxRules.findIndex(
      (taxRule) => taxRule.id === e.target.id || taxRule.key === e.target.id,
    )
    const name_with_key = e.target.name
    const name_without_key = name_with_key.split('_').slice(0, -1).join('_')

    taxRules[index][name_with_key] = e.target.value
    taxRules[index][name_without_key] = e.target.value
    setTaxRules([...taxRules])
  }

  const removeTaxRule = (key) => {
    const index = taxRules.findIndex((taxRule) => taxRule.key === key)

    taxRules.splice(index, 1)
    setTaxRules([...taxRules])
  }

  return (
    <>
      <TableContainer>
        <div className="flex justify-end py-4">
          <Btn className="bg-teal-500 hover:bg-teal-600" onClick={creatingNew}>
            New Salary Setting
          </Btn>
        </div>

        <DataTable
          rowClick={(row) => {
            // console.log(row.original);
            setSalarySetting(row.original)
            setTaxRules(row.original.tax_rules)
            setUpdatingSalarySetting(true)
          }}
          columns={columns}
          fetchFunction={fetchSalarySettings}
        />
      </TableContainer>

      {createNew && (
        <Modal
          showModal={createNew}
          setShowModal={setCreateNew}
          title="New Salary Setting"
        >
          <SalarySettingForm
            updateSalarySetting={updateSalarySetting}
            salarySetting={salarySetting}
            errors={errors}
            taxRules={taxRules}
            onSubmit={createSalarySetting}
            setTaxRules={setTaxRules}
            updateTaxRules={updateTaxRules}
            removeTaxRule={removeTaxRule}
          />
        </Modal>
      )}

      {updatingSalarySetting && (
        <Modal
          showModal={updatingSalarySetting}
          setShowModal={setUpdatingSalarySetting}
          title="Update Salary Setting"
        >
          <SalarySettingForm
            updateSalarySetting={updateSalarySetting}
            salarySetting={salarySetting}
            errors={errors}
            taxRules={taxRules}
            onSubmit={sendUpdateSalarySettingRequest}
            setTaxRules={setTaxRules}
            updateTaxRules={updateTaxRules}
            removeTaxRule={removeTaxRule}
          />
        </Modal>
      )}
    </>
  )
}

export default connect(() => ({}), { fetchSalarySettings, createNewSalarySetting, remoteUpdateSalarySetting })(SalariesDataTable)
