import { useState } from 'react'
import { connect } from 'react-redux'
import { columns } from '../../data/yearlySalaryTableData'
import { TableContainer } from '../modalComponents'
import { Btn, Input } from '../formComponents'
import DataTable from './DataTable'
import { fetchYearlySalary } from '../../redux/actions/dashboardActions'
import { generateYearlySalary } from '../../redux/actions/yearlySalaryAction'
import React from 'react'


const YearlySalaryDataTable = ({ fetchYearlySalary, generateYearlySalary }) => {
  const [fiscal_year, setFiscalYear] = useState(null)

  // make request to remote api for salary records generation
  const fillSalaryRecords = async () => {
    generateYearlySalary(fiscal_year)
  }

  return (
    <TableContainer>
      <div className="flex justify-end py-4">
        <Input
          className="w-full mr-4 sm:w-1/2 md:w-1/3"
          onChange={(e) => setFiscalYear(e.target.value)}
          placeholder="eg: 7879"
          type="integer"
        />
        <Btn
          className="bg-teal-500 hover:bg-teal-600"
          onClick={function () {
            fillSalaryRecords()
              { setTimeout(function () {
                window.location.reload()
              }, 7000)}
          }}
        >
          Generate
        </Btn>
      </div>

      <DataTable columns={columns} fetchFunction={fetchYearlySalary} />
    </TableContainer>
  )


}

export default connect(() => ({}), {
  fetchYearlySalary,
  generateYearlySalary,
})(YearlySalaryDataTable)
