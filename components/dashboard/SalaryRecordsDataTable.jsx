import { useState } from 'react'
import { connect } from 'react-redux'
import { columns } from '../../data/salaryRecordsTableData'
import { TableContainer } from '../modalComponents'
import { Btn, Input } from '../formComponents'
import DataTable from './DataTable'
import { fetchSalaryRecords } from '../../redux/actions/dashboardActions'
import {generateSalaryRecords} from "../../redux/actions/salaryRecordActions";

const SalaryRecordsDataTable = ({ fetchSalaryRecords, generateSalaryRecords }) => {
  const [date, setDate] = useState(null)

  // make request to remote api for salary records generation
  const fillSalaryRecords = async () => {
    generateSalaryRecords(date)
  }

  return (
    <TableContainer>
      <div className="flex justify-end py-4">
        <Input
          className="w-full mr-4 sm:w-1/2 md:w-1/3"
          onChange={(e) => setDate(e.target.value)}
          type="date"
        />
        <Btn
          className="bg-teal-500 hover:bg-teal-600"
          onClick={fillSalaryRecords}
        >
          Generate
        </Btn>
      </div>

      <DataTable columns={columns} fetchFunction={fetchSalaryRecords} />
    </TableContainer>
  )
}

export default connect(() => ({}), { fetchSalaryRecords, generateSalaryRecords })(
  SalaryRecordsDataTable,
)
