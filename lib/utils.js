import axios from "axios";

const addGreptcha = () => {
  const recaptcha_script = document.createElement("script");
  recaptcha_script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}`;
  recaptcha_script.id = "recaptcha";
  document.head.append(recaptcha_script);

  // clean up
  return () => {
    recaptcha_script.remove();
  };
};

const getCaptchaScore = async () => {
  const score = await grecaptcha
    .execute(process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY, { action: "submit" })
    .then((token) => axios.get(
        `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/user_scores`,
        { params: { token } }
    )).then((response) => response.data.score );

  return score;
};

export { addGreptcha, getCaptchaScore };
export const handleUnauthorized = (error, router) => {
  // console.log(window.location.pathname);
  // console.log(error.response);
  if (error.response && error.response.statusText === 'Unauthorized') {
    // console.log(error.response);

    localStorage.token = '';

    router.push({
      pathname: '/login',
      // after login redirect to intended page
      query: { returnUrl: window.location.pathname },
    });
  }
};

export const colorMap = (status) => {
  switch (status) {
    case 'pending':
      return 'blue'
    case 'rejected':
      return 'red'
    case 'approved':
      return 'green'
    default:
      return 'blue'
  }
}

export const fullCalendarEndDate = (date) => {
  const end_date = new Date(date)
  end_date.setDate(end_date.getDate() + 1)
  end_date.toLocaleString()
  // we need to make sure we have date in YY-MM-DD format
  // '2022-1-1' is not valid date
  // '2022-01-01' is valid date
  return `${end_date.getFullYear()}-${`0${end_date.getMonth() + 1}`.slice(
    -2,
  )}-${`0${end_date.getDate()}`.slice(-2)}`
}

export const isAdmin = (user) => user.role === 'admin'
