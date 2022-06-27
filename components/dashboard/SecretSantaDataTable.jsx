import React from 'react'
import { connect } from 'react-redux'

import { TableContainer } from '../modalComponents'
import { columns } from '../../data/secretSantaTableData'
import DataTable from './DataTable'
import { fetchSecretSanta } from '../../redux/actions/dashboardActions'

function SecretSantaDataTable({ fetchSecretSanta }) {
  return (
    <TableContainer>
      <DataTable columns={columns} fetchFunction={fetchSecretSanta} />
    </TableContainer>
  )
}

export default connect(() => ({}), { fetchSecretSanta }) (SecretSantaDataTable)
