import React, { useEffect, useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import SalarySettingsDataTable from "../../../components/dashboard/SalarySettingsDataTable";
import axios from "axios";
import Jsona from "jsona";
import { handleUnauthorized } from "../../../lib/utils";
import { useGlobalContext } from "../../../context";
import { useRouter } from "next/router";

const salarySettings = () => {
  const router = useRouter();
  const { setToken } = useGlobalContext();
  const [salarySettings, setSalarySettings] = useState([]);

  useEffect(() => {
    const fetchSalarySettings = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/salary_settings.json`,
          { headers: { Authorization: localStorage.token } }
        );

        const dataFormatter = new Jsona();
        setSalarySettings(dataFormatter.deserialize(response.data));
      } catch (error) {
        console.log(error);
        handleUnauthorized(error, setToken, router);
      }
    };

    fetchSalarySettings();
  }, []);

  return (
    <>
      <Navbar />
      <SalarySettingsDataTable
        salarySettings={salarySettings}
        setSalarySettings={setSalarySettings}
      />
    </>
  );
};

export default salarySettings;
