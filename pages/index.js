import { connect } from 'react-redux'
import LeaveRequestDataTable from '../components/dashboard/LeaveRequestDataTable'
import Navbar from '../components/layout/Navbar'
import Modal from '../components/modal'
import { Btn, Input, Label } from '../components/formComponents'
import LeaveBalanceBadge from '../components/leaveBalanceBadge'
import {
  fetchLeaveRequests,
  setSelectedLeave,
  updateLeaveRequest,
  setLeaveModal,
} from '../redux/actions/leaveActions'
import { setFetchAllRecords } from '../redux/actions/dashboardActions'

const Home = (props) => {
  const isAdmin = () => props.user && props.user.role === 'admin'

  return (
    <>
      <Navbar page="Dashboard" subPages={['Calendar', 'Admin']} />
      <div className="p-12 mx-6 -mt-6 bg-white rounded shadow h-3/5">
        <div className="flex justify-end py-4">
          <span className="mr-2">All Leaves</span>
          <button
            type="button"
            className={`${
              props.fetchAllRecords ? 'bg-indigo-600' : 'bg-gray-200'
            } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            role="switch"
            aria-checked="false"
            onClick={() => {
              props.setFetchAllRecords(!props.fetchAllRecords)
              props.fetchLeaveRequests()
            }}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={`inline-block w-5 h-5 transition duration-200 ease-in-out transform ${
                props.fetchAllRecords ? 'translate-x-5' : 'translate-x-0'
              } bg-white rounded-full shadow pointer-events-none ring-0`}
            />
          </button>
        </div>

        <LeaveRequestDataTable
          showModal={props.showModal}
          setShowModal={props.setLeaveModal}
          setLeaveRequest={props.setSelectedLeave}
        />
        {props.showModal && (
          <Modal
            showModal={props.showModal}
            setShowModal={props.setLeaveModal}
            title={`${props.selectedLeave.user.first_name} ${props.selectedLeave.user.last_name}`}
          >
            <div className="flex justify-between">
              <LeaveBalanceBadge
                label="Sick Leave Balance"
                balance={props.selectedLeave.user.sick_leave_balance || 0}
              />
              <LeaveBalanceBadge
                label="Paid Leave Balance"
                balance={props.selectedLeave.user.paid_leave_balance || 0}
              />
              <LeaveBalanceBadge
                label="Unpaid Leave Balance"
                balance={props.selectedLeave.user.unpaid_leave_balance || 0}
              />
            </div>
            {props.alerts.message && (
              <span className="text-red-500">
                {JSON.stringify(props.alerts.message)}
              </span>
            )}
            <Label>Reason</Label>
            <Input
              type="text"
              value={props.selectedLeave.title}
              onChange={(e) => {
                props.setSelectedLeave({
                  ...props.selectedLeave,
                  title: e.target.value,
                })
              }}
              disabled={isAdmin()}
            />
            {isAdmin() && (
              <>
                <Label>Reply</Label>
                <Input
                  type="text"
                  value={
                    props.selectedLeave.reply &&
                    props.selectedLeave.reply.reason
                  }
                  onChange={(e) =>
                    props.setSelectedLeave({
                      ...props.selectedLeave,
                      reply: { reason: e.target.value },
                      reply_attributes: { reason: e.target.value },
                    })
                  }
                />
              </>
            )}

            {isAdmin() && props.selectedLeave.status !== 'rejected' && (
              <Btn
                className="bg-red-500 hover:bg-red-600"
                onClick={() => {
                  props.setSelectedLeave({
                    ...props.selectedLeave,
                    status: 'rejected',
                    approver_id: props.user.id,
                  })
                  props.updateLeaveRequest()
                }}
              >
                Reject
              </Btn>
            )}
            {isAdmin() && props.selectedLeave.status !== 'approved' && (
              <Btn
                className="ml-2 bg-green-500 hover:bg-green-600"
                onClick={() => {
                  props.setSelectedLeave({
                    ...props.selectedLeave,
                    status: 'approved',
                    approver_id: props.user.id,
                  })
                  props.updateLeaveRequest()
                }}
              >
                Approve
              </Btn>
            )}
            {!isAdmin() && (
              <Btn
                className="ml-2 bg-green-500 hover:bg-green-600"
                onClick={() =>
                  props.updateLeaveRequest(props.selectedLeave.status)
                }
              >
                Update
              </Btn>
            )}
          </Modal>
        )}
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  user: state.auth.user,
  leave: state.leave,
  alerts: state.alerts,
  showModal: state.leave.leaveModal,
  selectedLeave: state.leave.selectedLeave,
  fetchAllRecords: state.records.fetchAllRecords,
  loading: state.records.loading,
})
export default connect(mapStateToProps, {
  fetchLeaveRequests,
  setSelectedLeave,
  updateLeaveRequest,
  setLeaveModal,
  setFetchAllRecords,
})(Home)
