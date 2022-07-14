import { useEffect } from 'react';
import { connect } from 'react-redux';
import { clearErrors } from '../redux/actions/alertActions';

const Alert = (props) => {
  const { message, type } = props.alerts;
  const show = message !== null;
  const success = type === 'success';
  useEffect(() => {
    setTimeout(() => {
      props.clearErrors();
    }, 5000);
  }, [show]);
  return (
    <div>
      {show && (
        <div
          className={`${
            success
              ? 'bg-green-100 border-green-400 text-green-700'
              : 'bg-red-100 border-red-400 text-red-400'
          } border px-4 py-3 rounded fixed left-2/4 -translate-x-1/2`}
          role="alert"
        >
          <span className="">{JSON.stringify(message)}</span>

          <button
            type="button"
            className="ml-4"
            onClick={() => {
              props.clearErrors();
            }}
          >
            <svg
              className={`${
                success ? 'text-green-500' : 'text-red-500'
              } w-4 h-4 fill-current`}
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  alerts: state.alerts,
});
export default connect(mapStateToProps, { clearErrors })(Alert);
