
import React, { useState, useEffect, state } from "react";
import { Link } from 'react-router-dom';
import EmployeeFetch from "../../api/EmployeeFetch"
import Select from 'react-select';
import ProjectFetch from "../../api/ProjectFetch"
import Cookies from 'js-cookie';
import EmployeePDF from "../pdfGeneration/EmployeePDF";
import { useTranslation } from 'react-i18next';
import { PDFDownloadLink } from "@react-pdf/renderer";
import NoMatch from "../mainPage/NoMatch";

const EmployeeSummary = (props) => {

    const { t, i18n } = useTranslation('common');
    const pF = new ProjectFetch();
    const eF = new EmployeeFetch();
    const [employee, setEmployee] = useState(null);
    const [employeeRaw, setEmployeeRaw] = useState(null);
    const [addHours, setAddHours] = useState([]);
    const [loginUserID, setLoginUserID] = useState(null);
    const [resultUpdate, setResultUpdate] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const updateAddHouers = (e) => {
        setAddHours({ ...addHours, [e.name]: e.value })
    }
    const getEmployee = async () => {
        const id = props.match.params.id;
        const employeeTMP = await eF.GetById(id);
        if (!employeeTMP.id) {
            setIsLoading(false)
            return
        }
        if (employeeTMP.removed) {
            setIsLoading(false)
            return
        }
        setEmployeeRaw(employeeTMP);
        const projects = await getProjectList(employeeTMP.projects)
        let totalActiveHours = 0;
        projects.map(x => {
            if (!x.removed)
                totalActiveHours += x.hours;
        })
        setEmployee({ ...employeeTMP, projects: projects, totalActiveHours: totalActiveHours });
        setIsLoading(false)
    }
    const getProjectList = async (list) => {
        let projectList = [];
        await Promise.all(list.map(async (x, index) => {
            const project = await pF.GetById(x.id)

            let removed = false
            if (project.removed || x.removed)
                removed = true
            projectList.push({ id: project.id, name: project.name, hours: x.hours !== undefined ? parseInt(x.hours, 10) : 0, removed: removed })
        }))
        return projectList;
    }
    const addHoursProject = async (idProject) => {
        const res = parseInt(addHours[idProject], 10)
        if (!res) { addHours[idProject] = 0; return }
        const pro = employeeRaw.projects.find((x => {
            return x.id == idProject
        }))

        if (pro.hours) {
            pro.hours += res;
            employee.totalActiveHours += res;
        }
        else
            pro.hours = parseInt(addHours[idProject], 10);
        if (pro.hours < 0)
            pro.hours = 0
        if (employee.totalActiveHours <= 0)
            employee.totalActiveHours = 0
        const resCha = employee.projects.find((x) => {
            return x.id == idProject
        })
        resCha.hours = pro.hours
        setResultUpdate(pro.hours)
        await eF.Update(employeeRaw);


    }

    useEffect(() => {
        getEmployee();
        if (Cookies.get('id')) {
            setLoginUserID(Cookies.get('id'));
        }
    }, [])

    useEffect(() => {
    }, [resultUpdate])

    return (<>
        {employee == null && !isLoading && <NoMatch text={t('error.notFoundEmployee')} />}
        {employee != null && !isLoading &&
            <div className="view">
                <div className="view__container view__container--summmary">
                    <div className="view__row ">
                        <div className="view__txt ">

                            <span> {t('employee.name')}:</span><span className="view__txt--bold">{` ${employee.firstName + " " + employee.lastName} `}</span>
                        </div>
                        <div className="view__txt  view__txt--phone ">
                            <span>{t('common.phoneNumber')}:</span><span className="view__txt--bold">{` ${employee.phoneNumber}`}</span>
                        </div>
                    </div>
                    <div className="view__row">
                        <div className="view__txt  view__txt--email">
                            <span>{t('common.emailAdress')}:</span>  <span className="view__txt--bold">{employee.email}</span>
                        </div>
                    </div>

                    <div className="view__row view__row--margin-bottom">
                        <div className="view__txt ">{`${t('employee.totalHours')}: ${employee.totalActiveHours}`} </div>
                        <div className="view__txt ">{`${t('employee.totalActiveProjects')}: ${(employee.projects.filter((y) => {
                            return y.removed != true
                        })).length}`} </div>
                    </div>
                    <div className="view__row">
                        <div className="view__txt view__txt--title">{t('employee.activeProjects')} </div>
                        <div className="view__content view__content--summary">
                            {employee.projects.map((x, index) => (
                                x.removed != true &&
                                <div className="view__content--projects view__content--inline-flex" key={index}>
                                    <div className="view__content--inline-flex view__content--projects-width">
                                        <Link className="view__button view__button--employee" to={`/project/${x.id}`}>
                                            <div >
                                                {x.name}
                                            </div>
                                        </Link>
                                        <div className="view__content--hour">
                                            <span className="view__txt">{t('common.quantityHours')}: {x.hours}</span>
                                        </div>
                                    </div>
                                    {loginUserID && loginUserID == employee.id && <>

                                        <div className="view__content--add-hour">
                                            <span className="view__txt"> {t('common.addHours')}: </span>
                                            <input type="number" value={addHours[x.id] ? addHours[x.id] : ""} name={x.id} className="view__input" onChange={x => updateAddHouers(x.target)} />
                                            <span className="view__button view__button--add-hour" onClick={z => addHoursProject(x.id)}> {t('button.accept')}</span>
                                        </div>
                                    </>
                                    }
                                </div>
                            ))
                            }
                        </div>
                    </div>
                    <div className="view__row">
                        <div className="view__txt view__txt--title">{t('employee.employeeReport')}</div>
                        {employee != null && <PDFDownloadLink
                            document={<EmployeePDF data={employee} />}
                            fileName={`${employee.firstName}-${employee.lastName}-${employee.id}.pdf`}
                            className="view__button view__button--report"
                        >
                            {({ blob, url, loading, error }) =>
                                loading ? t('pdf.loading') : t('pdf.downloadReport')
                            }
                        </PDFDownloadLink>}
                    </div>
                </div>
            </div>}
    </>)
}

export default EmployeeSummary;