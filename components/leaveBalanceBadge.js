const LeaveBalanceBadge = ({ label, balance }) => (
    <div
        className={`flex items-center px-6 py-2 mx-auto mt-4 text-sm bg-green-100 rounded w-fit ${
            balance > 0 ? 'bg-green-100' : 'bg-red-100'
        }`}
    >
      <div className={balance > 0 ? 'text-green-600' : 'text-red-600'}>
        {label} : {balance > 0 ? balance : 0}
      </div>
    </div>
)

export default LeaveBalanceBadge;
