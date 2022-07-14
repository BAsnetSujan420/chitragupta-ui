import {useState} from 'react'
import {connect} from 'react-redux'
import Head from 'next/head'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import axios from 'axios'
import Jsona from 'jsona'
import Modal from '../components/modal'
import {Input, Label, Select, Option, Btn} from '../components/formComponents'
import LeaveBalanceBadge from '../components/leaveBalanceBadge'
import {isAdmin, colorMap, fullCalendarEndDate} from '../lib/utils'
import Navbar from '../components/layout/Navbar'
import {addLeaveRequest, setSelectedLeave, updateLeaveRequest} from "../redux/actions/leaveActions";
import {setNewModal, setUpdateModal} from "../redux/actions/modalActions";

const Calendar = ({
                    user,
                    leave_request,
                    newModal,
                    updateModal,
                    token,
                    setSelectedLeave,
                    addLeaveRequest,
                    updateLeaveRequest,
                    setNewModal,
                    setUpdateModal
                  }) => {
  const [error, setError] = useState('')

  const dataFormatter = new Jsona()

  const createLeaveRequest = (info) => {
    setError('')

    // end date should be the last day of the leave, better not include the present day
    const endDate = new Date(info.endStr)
    endDate.setDate(endDate.getDate() - 1)
    endDate.toLocaleString()

    setSelectedLeave(
      {
        ...leave_request,
        leave_type: 'sick_leave',
        start_date: info.startStr,
        end_date: endDate,
        status: 'pending',
      }
    )
    setNewModal(true)
  }

  const updateLeave = async ({event}) => {
    setError('')

    //  first get id of leave request with
    const {id} = event

    // make request to remote API to get leave request detail
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/leave_requests/${id}`,
      {headers: {Authorization: token}},
    )

    setSelectedLeave(dataFormatter.deserialize(response.data))

    setUpdateModal(true)
  }

  return (
    <>
      <Head>
        <title>Chitragupta App</title>
        <meta name="description" content="chitragupta"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Navbar/>
      <div className="p-8">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          events={async (info) => {
            const start = info.start.toISOString().substring(0, 10)
            const end = info.end.toISOString().substring(0, 10)

            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/leave_requests.json`,
              {
                params: {start, end, all_leaves: true},
                headers: {Authorization: token},
              },
            )

            const leave_requests = dataFormatter.deserialize(response.data.data)

            return leave_requests.map((leave) => ({
              ...leave,
              start: leave.start_date,
              end: fullCalendarEndDate(leave.end_date),
              color: colorMap(leave.status),
            }))
          }}
          selectable
          editable
          select={createLeaveRequest}
          eventClick={updateLeave}
        />
      </div>
      {newModal && (
        <Modal
          setShowModal={setNewModal}
          showModal={newModal}
          title='New Leave Request'
          leaveRequest={leave_request}
        >
          <div>
            <div className="flex justify-between">
              <LeaveBalanceBadge
                label='Sick Leave Balance'
                balance={user.sick_leave_balance || 0}
              />
              <LeaveBalanceBadge
                label='Paid Leave Balance'
                balance={user.paid_leave_balance || 0}
              />
              <LeaveBalanceBadge
                label='Unpaid Leave Balance'
                balance={user.unpaid_leave_balance || 0}
              />
            </div>

            {error !== '' && <span className="mb-2 text-red-500">{error}</span>}
            <Label>Leave Type</Label>
            <Select
              onChange={(e) => setSelectedLeave({...leave_request, leave_type: e.target.value})}
            >
              <Option
                value="sick_leave"
                selected={leave_request.leave_type === 'sick_leave'}
              >
                Sick Leave
              </Option>
              <Option
                value="personal"
                selected={leave_request.leave_type === 'personal'}
              >
                Personal
              </Option>
              <Option
                value="others"
                selected={leave_request.leave_type === 'others'}
              >
                Others
              </Option>
            </Select>

            <Label>Reason</Label>
            <Input
              onChange={(e) => setSelectedLeave({...leave_request, title: e.target.value})}
              value={leave_request.title}
            />

            <Btn className="bg-blue-500 hover:bg-blue-600" onClick={addLeaveRequest}>
              Submit
            </Btn>
          </div>
        </Modal>
      )}

      {updateModal && (
        <Modal
          setShowModal={setUpdateModal}
          showModal={updateModal}
          title={`${leave_request.user.first_name} ${leave_request.user.last_name}`}
        >
          <div className="flex justify-between">
            <LeaveBalanceBadge
              label='Sick Leave Balance'
              balance={leave_request.user.sick_leave_balance}
            />
            <LeaveBalanceBadge
              label='Paid Leave Balance'
              balance={leave_request.user.paid_leave_balance}
            />
            <LeaveBalanceBadge
              label='Unpaid Leave Balance'
              balance={leave_request.user.unpaid_leave_balance}
            />
          </div>
          <div>
            {error !== '' && <span className="mb-2 text-red-500">{error}</span>}
            <Label>Leave Type</Label>
            <Select
              onChange={(e) => setSelectedLeave({...leave_request, leave_type: e.target.value})}
              disabled={isAdmin(user)}
            >
              <Option
                value="sick_leave"
                selected={leave_request.leave_type === 'sick_leave'}
              >
                Sick Leave
              </Option>
              <Option
                value="personal"
                selected={leave_request.leave_type === 'personal'}
              >
                Personal
              </Option>
              <Option
                value="others"
                selected={leave_request.leave_type === 'others'}
              >
                Others
              </Option>
            </Select>

            <Label>Reason</Label>
            <Input
              onChange={(e) =>
                setSelectedLeave({...leave_request, title: e.target.value})
              }
              value={leave_request.title}
              disabled={isAdmin(user)}
            />

            {isAdmin(user) && (
              <>
                <Label>Reply</Label>
                <Input
                  onChange={(e) =>
                    setSelectedLeave({
                      ...leave_request,
                      reply_attributes: {reason: e.target.value},
                    })
                  }
                  value={leave_request.reply && leave_request.reply.reason}
                />
                <Btn
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => {
                    setSelectedLeave({...leave_request, status: 'rejected'})
                    updateLeaveRequest()
                  }}
                >
                  Reject
                </Btn>
                <Btn
                  className="ml-2 bg-green-500 hover:bg-green-600"
                  onClick={() => {
                    setSelectedLeave({...leave_request, status: 'approved'})
                    updateLeaveRequest()
                  }}
                >
                  Approve
                </Btn>
              </>
            )}

            {!isAdmin(user) && (
              <Btn
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => updateLeaveRequest()}
              >
                Update
              </Btn>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  leave_request: state.leave.selectedLeave,
  newModal: state.modal.newModal,
  updateModal: state.modal.updateModal,
  token: state.auth.token
})
export default connect(mapStateToProps, {
  setSelectedLeave,
  addLeaveRequest,
  updateLeaveRequest,
  setNewModal,
  setUpdateModal
})(Calendar)
