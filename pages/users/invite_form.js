import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addGreptcha } from "../../lib/utils";
import { invitationFormSubmit } from "../../redux/actions/authActions";

const InviteForm = ({ invitationFormSubmit }) => {
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState(false);

  useEffect(() => {
    addGreptcha()
    if(document.getElementById('recaptcha')) {
      setCaptcha(true)
    }
  }, []);

  const formSubmit = async (e) => {
    e.preventDefault();

    invitationFormSubmit(email)
  };

  return (
    <section className="my-8 pt-14">
      <div className="container px-2 py-2 mx-auto md:w-full md:max-w-2xl">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="email"
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
        </div>

        <button
          className="inline-block px-4 py-2 text-white bg-blue-500 rounded"
          type="button"
          onClick={(e) => formSubmit(e)}
          disabled={!captcha}
        >
          Invite
        </button>
      </div>
    </section>
  );
};

export default connect(() => ({}), {
  invitationFormSubmit
}) (InviteForm);
