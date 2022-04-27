import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import { columns } from "../../data/salarySettingsTableData";
import { TableContainer } from "../modalComponents";
import { Btn, Label, Input } from "../formComponents";
import Modal from "../modal";
import axios from "axios";
import Jsona from "jsona";
import InputWithLabelAndError from "../InputWithLabelAndError";
import SalarySettingForm from "../salarySettingForm";
import { useRouter } from "next/router";

const SalariesDataTable = ({ salarySettings, setSalarySettings }) => {
  const [salarySetting, setSalarySetting] = useState({});
  const [createNew, setCreateNew] = useState(false);
  const [errors, setErrors] = useState({});
  const [taxRules, setTaxRules] = useState([]);
  const [updatingSalarySetting, setUpdatingSalarySetting] = useState(false);

  const dataFormatter = new Jsona();
  const creatingNew = () => setCreateNew(true);
  const numberRegEx = /^\d+.?\d*$/;
  const router = useRouter();

  // this is required because if we submit empty form we are getting error but status is stil 200:OK
  const checkIfFormIsValid = () => {
    let errorCount = 0;
    [
      "ssf_office",
      "ssf_employee",
      "life_insurance_max",
      "ssf_tax_exemption_rate",
      "ssf_tax_exemption_max",
      "from_date",
    ].forEach((field) => {
      if (salarySetting[field] === undefined) {
        errorCount += 1;
        errors[field] = "Can't be blank.";
        setErrors({ ...errors });
      }
    });

    // make sure to_date is greater than from_date
    if (
      salarySetting.to_date &&
      new Date(salarySetting.from_date) > new Date(salarySetting.to_date)
    ) {
      errorCount += 1;
      setErrors({
        ...errors,
        from_date: "Can't be greater than To Date.",
        to_date: "Can't be less than From Date.",
      });
    }

    // make sure each field in tax rules are valid
    taxRules.forEach((taxRule) => {
      ["amount_from", "amount_to", "rate"].forEach((field) => {
        if (taxRule[`${field}_${taxRule.id || taxRule.key}`] === undefined) {
          errorCount += 1;

          errors[`${field}_${taxRule.id || taxRule.key}`] = "Can't be blank.";
          setErrors({ ...errors });
        } else if (
          !taxRule[`${field}_${taxRule.id || taxRule.key}`].match(numberRegEx)
        ) {
          errorCount += 1;

          errors[`${field}_${taxRule.id || taxRule.key}`] = "Must be a number.";
          setErrors({ ...errors });
        }
      });
    });

    return errorCount;
  };

  const createSalarySetting = async () => {
    if (checkIfFormIsValid() === 0) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/salary_settings.json`,
          {
            salary_setting: {
              ...salarySetting,
              tax_rules_attributes: taxRules,
            },
          },
          {
            headers: {
              Authorization: localStorage.token,
            },
          }
        );

        if (response.statusText === "OK") {
          setSalarySettings([
            dataFormatter.deserialize(response.data),
            ...salarySettings,
          ]);
          setCreateNew(false);
          setSalarySetting({});
          setTaxRules([]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const remoteUpdateSalarySetting = async () => {
    if (checkIfFormIsValid() === 0) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_REMOTE_URL}/api/v1/salary_settings/${salarySetting.id}.json`,
          {
            salary_setting: {
              ...salarySetting,
              tax_rules_attributes: taxRules,
            },
          },
          {
            headers: {
              Authorization: localStorage.token,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateSalarySetting = (e) => {
    delete errors[e.target.name];
    if (
      [
        "ssf_office",
        "ssf_employee",
        "life_insurance_max",
        "ssf_tax_exemption_rate",
        "ssf_tax_exemption_max",
      ].includes(e.target.name) &&
      !e.target.value.match(numberRegEx)
    ) {
      setErrors({ ...errors, [e.target.name]: "Must be a number." });
    }
    setSalarySetting({ ...salarySetting, [e.target.name]: e.target.value });
  };

  const updateTaxRules = (e) => {
    if (!e.target.value.match(numberRegEx)) {
      setErrors({ ...errors, [e.target.name]: "Must be a number." });
    }
    const index = taxRules.findIndex(
      (taxRule) => taxRule.id == e.target.key || taxRule.key == e.target.key
    );
    const name_with_key = e.target.name;
    const name_without_key = name_with_key.split("_").slice(0, -1).join("_");

    taxRules[index][name_with_key] = e.target.value;
    taxRules[index][name_without_key] = e.target.value;
    setTaxRules([...taxRules]);
  };

  const removeTaxRule = (key) => {
    const index = taxRules.findIndex((taxRule) => taxRule.key == key);

    taxRules.splice(index, 1);
    setTaxRules([...taxRules]);
  };

  return (
    <>
      <TableContainer>
        <DataTable
          data={salarySettings}
          rowClick={(row) => {
            console.log(row.original);
            setSalarySetting(row.original);
            setTaxRules(row.original.tax_rules);
            setUpdatingSalarySetting(true);
          }}
          columns={columns}
        >
          <div className="flex justify-end py-4">
            <Btn
              className="bg-teal-500 hover:bg-teal-600"
              onClick={creatingNew}
            >
              New Salary Setting
            </Btn>
          </div>
        </DataTable>
      </TableContainer>

      {createNew && (
        <Modal
          showModal={createNew}
          setShowModal={setCreateNew}
          title={"New Salary Setting"}
        >
          <SalarySettingForm
            updateSalarySetting={updateSalarySetting}
            salarySetting={salarySetting}
            errors={errors}
            taxRules={taxRules}
            onSubmit={createSalarySetting}
            setTaxRules={setTaxRules}
            updateTaxRules={updateTaxRules}
            removeTaxRule={removeTaxRule}
          />
        </Modal>
      )}

      {updatingSalarySetting && (
        <Modal
          showModal={updatingSalarySetting}
          setShowModal={setUpdatingSalarySetting}
          title={"Update Salary Setting"}
        >
          <SalarySettingForm
            updateSalarySetting={updateSalarySetting}
            salarySetting={salarySetting}
            errors={errors}
            taxRules={taxRules}
            onSubmit={remoteUpdateSalarySetting}
            setTaxRules={setTaxRules}
            updateTaxRules={updateTaxRules}
            removeTaxRule={removeTaxRule}
          />
        </Modal>
      )}
    </>
  );
};

export default SalariesDataTable;
