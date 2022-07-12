import { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useRouter } from 'next/router'
import axios from 'axios'
import Navbar from '../../../components/layout/Navbar'
import {
  Btn,
  Label,
  Select,
  Input,
  Option,
} from '../../../components/formComponents'
import Modal from '../../../components/modal'
import { fetchUser } from '../../../redux/actions/usersActions'
import { fetchAllSalaries } from '../../../redux/actions/dashboardActions'

const User = ({ fetchUser, fetchAllSalaries, currentUser, user, salaries }) => {
  const isAdmin = () => currentUser && currentUser.role === 'admin'
  const [updatingUser, setUpdatingUser] = useState(false)
  const [salary, setSalary] = useState(null)
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [status, setStatus] = useState(null)
  const [errors, setErrors] = useState({})

  const router = useRouter()
  const { id: user_id } = router.query

  const MAX_SICK_LEAVE_BALANCE = 5
  const MAX_PAID_LEAVE_BALANCE = 18
  const MAX_UNPAID_LEAVE_BALANCE = 25

  const statuses = [
    { id: 0, status: 'invited' },
    { id: 1, status: 'active' },
    { id: 2, status: 'disabled' },
  ]

  const handleAvatarSubmit = async () => {
    const formData = new FormData()
    const imguser = document.querySelector('#avatarUser')

    formData.append('user[avatar]', imguser.files[0])

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/users/${user_id}.json`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: localStorage.token,
          },
        },
      )
    } catch (error) {
      console.log(error)
    }
  }

  const leave_percentage = (leave_balance, total) =>
    user ? Math.round((leave_balance / total) * 100) : 0

  useEffect(() => {
    const salary_controller = new AbortController()

    currentUser && fetchUser(user_id)
    isAdmin() && fetchAllSalaries()

    return () => {
      salary_controller?.abort()
    }
  }, [currentUser])

  const checkIfFormIsValid = () => {
    let errorCount = 0
    if (!salary) {
      errors.salary = "Can't be blank."
      // console.log(errors);
      setErrors({ ...errors })
      errorCount += 1
    }

    return errorCount
  }

  const updateUser = async () => {
    if (checkIfFormIsValid() === 0) {
      // make request to remote api to create or update user salary
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/users/${user_id}.json`,
          {
            user: {
              user_salaries_attributes: [
                {
                  salary_id: salary,
                  start_date: startDate,
                },
              ],
              status,
            },
          },
          {
            headers: {
              Authorization: localStorage.token,
            },
          },
        )
      } catch (error) {
        console.log(error)
        // handleUnauthorized(error, setToken, router)
      }
    }
  }

  return (
    <>
      <Navbar />

      {isAdmin() && (
        <div className="flex flex-row-reverse">
          <Btn
            className="mr-4 bg-gray-500 hover:bg-gray-400"
            onClick={() => setUpdatingUser(true)}
          >
            Edit
          </Btn>
        </div>
      )}

      <div className="bg-white w-[300px] mx-auto">
        <div className="pt-10 text-center">
          <div>
            <div>
              <img
                className="w-20 h-20 mx-auto rounded-full lg:w-24 lg:h-24"
                src={`${process.env.NEXT_PUBLIC_REMOTE_URL}/rails${user.avatar_url}`}
              />
              <div>
                <div className="my-5 text-xs font-medium lg:text-sm">
                  <h2 className="text-2xl">
                    {user && `${user.first_name} ${user.last_name}`}
                  </h2>

                  {
                    (currentUser?.id == user.id) &&
                    <Btn
                      className="mr-4 bg-gray-500 hover:bg-gray-400"
                      onClick={() =>
                        document.getElementById('avatarUser').click()
                      }
                    >
                      Change Image
                    </Btn>
                  }
                  <Input
                    id="avatarUser"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarSubmit}
                  />
                </div>
                <div className="w-full my-4 border-b-2" />
              </div>
            </div>

            <div className="px-4">
              <div className="mb-3">
                <div className="flex">
                  <span className="mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-mail"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  {user && user.email}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex">
                  <span className="mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-calendar"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </span>
                  {user && user.start_date}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-blue-700 dark:text-white">
                    Sick Leave Balance
                  </span>
                  <span className="text-sm text-blue-700 dark:text-white">
                    {user && user.sick_leave_balance}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{
                      width: `${leave_percentage(
                        user ? user.sick_leave_balance : 0,
                        MAX_SICK_LEAVE_BALANCE,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-blue-700 dark:text-white">
                    Paid Leave Balance
                  </span>
                  <span className="text-sm text-blue-700 dark:text-white">
                    {user && user.paid_leave_balance}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{
                      width: `${leave_percentage(
                        user ? user.paid_leave_balance : 0,
                        MAX_PAID_LEAVE_BALANCE,
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-blue-700 dark:text-white">
                    Paid Leave Balance
                  </span>
                  <span className="text-sm text-blue-700 dark:text-white">
                    {user && user.unpaid_leave_balance}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{
                      width: `${leave_percentage(
                        user ? user.unpaid_leave_balance : 0,
                        MAX_UNPAID_LEAVE_BALANCE,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {updatingUser && (
        <Modal
          showModal={updatingUser}
          setShowModal={setUpdatingUser}
          title="Update User"
        >
          <div>
            <Label
              className={`${errors.salary ? 'text-red-500' : 'text-gray-500'}`}
            >
              Select salary
            </Label>
            <Select
              onChange={(e) => setSalary(e.target.value)}
              className={errors.salary ? 'border-red-500' : ''}
              defaultValue={user.active_salary && user.active_salary.id}
            >
              <Option>...</Option>
              {salaries.map((salary) => (
                <Option value={salary.id} key={salary.id}>
                  Base: {salary.basic_salary}, Cash In Hand:
                  {salary.cash_in_hand}
                </Option>
              ))}
            </Select>
            {errors.salary && (
              <span className="text-sm text-red-500">{errors.salary}</span>
            )}

            <Label
              className={`${errors.salary ? 'text-red-500' : 'text-gray-500'}`}
            >
              Select Status
            </Label>
            <Select
              onChange={(e) => setStatus(e.target.value)}
              className={errors.status ? 'border-red-500' : ''}
              defaultValue={user.status}
            >
              <Option value={null}>...</Option>
              {statuses.map((status) => (
                <Option value={status.status} key={status.id}>
                  {status.status}
                </Option>
              ))}
            </Select>
            {errors.status && (
              <span className="text-sm text-red-500">{errors.status}</span>
            )}

            <Label>Start Date</Label>
            <Input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
            />

            <Btn className="bg-green-400" onClick={updateUser}>
              Submit
            </Btn>
          </div>
        </Modal>
      )}
    </>
  )
}

export default connect(
  (state) => ({
    currentUser: state.auth.user,
    user: state.users.user,
    salaries: state.records.records,
  }),
  {
    fetchUser,
    fetchAllSalaries,
  },
)(User)
