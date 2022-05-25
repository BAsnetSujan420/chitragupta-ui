import { connect } from 'react-redux'
import DataTable from './DataTable'
import { columns } from '../../data/yearlySalaryRecordsTableData'
import { fetchYearlySalaryRecords } from '../../redux/actions/dashboardActions'
import { Btn } from '../formComponents'

function YearlySalaryRecordDataTable({ fetchYearlySalaryRecords }) {
  return (
    <DataTable
      rowClick={() => console.log('')}
      columns={columns}
      fetchFunction={fetchYearlySalaryRecords}
    >
      <Btn
        className="bg-teal-500 hover:bg-teal-600"
        onClick={() => {
          console.log('Generating Yearly Salary Records')
        }}
      >
        Generate Records
      </Btn>
    </DataTable>
  )
}

export default connect(() => ({}), { fetchYearlySalaryRecords })(
  YearlySalaryRecordDataTable,
)
