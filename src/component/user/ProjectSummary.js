import React, { useState, useEffect, state } from "react";
import { Link } from 'react-router-dom';
import EmployeeFetch from "../../api/EmployeeFetch"
import Select from 'react-select';
import ProjectFetch from "../../api/ProjectFetch"
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { PDFDownloadLink } from "@react-pdf/renderer";
import ProjectPDF from "../pdfGeneration/ProjectPDF";
import NoMatch from "../mainPage/NoMatch";


const ProjectSummary = (props) => {
    const { t, i18n } = useTranslation('common');
    const pF = new ProjectFetch();
    const eF = new EmployeeFetch();
    const [project, setProject] = useState(null);
    const [projectRaw, setProjectRaw] = useState(null);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [addHoursValue, setAddHoursValue] = useState(null)
    const [isLoading, setIsLoading] = useState(true)


    const getProject = async () => {

        const id = props.match.params.id;
        const projectTMP = await pF.GetById(id);

        if (!projectTMP.id) {
            setIsLoading(false)
            return
        }
        if(projectTMP.removed == true){
            setIsLoading(false)
            return
        }
        setProjectRaw(projectTMP);
        const employees = (await getEmployeesList(projectTMP.employees, id)).filter(x => {
            return x.removed != true;
        })
        let totalActiveHours = 0;
        employees.map(x => {
            if (!x.removed)
                totalActiveHours += x.hours;
        })
      
        setProject({ ...projectTMP, employees: employees, totalActiveHours: totalActiveHours })
        setIsLoading(false)
    }

    const addHours = async () => {

        const hours = parseInt(addHoursValue, 10)
        if (!hours) { return }
        const employee = await eF.GetById(Cookies.get('id'))
        const pro = employee.projects.filter((x) => {
            return x.id == project.id
        })
        if (pro[0].hours)
            pro[0].hours += hours
        else {
            pro[0].hours = hours
        }
        setProject({ ...project, totalActiveHours: project.totalActiveHours += hours })
        await eF.Update(employee)

    }

    const getEmployeesList = async (list, projectId) => {
        let employeesList = [];
        if (!list)
            return employeesList
        await Promise.all(list.map(async (x, index) => {
            const employee = await eF.GetById(x.employeeID)
            const pro = employee.projects.find((x) => {
                return x.id == projectId
            })
            let hours = 0;
            let removed = false;

            if (pro) {
                pro.hours !== undefined ? hours = pro.hours : 0;
                pro.removed !== undefined ? removed = pro.removed : false;
            }
            if (employee.removed != true)
                employeesList.push({ id: employee.id, firstName: employee.firstName, lastName: employee.lastName, removed: removed, hours: hours })
        }))
        return employeesList;
    }
    useEffect(() => {
        getProject();
        checkCurrentUser()
    }, [])

    const checkCurrentUser = async () => {
        if (Cookies.get('id')) {
            const employee = await eF.GetById(Cookies.get('id'))
            if (employee.id) {
                const checkPro = await Promise.all(employee.projects.filter(x => {
                    return x.id == props.match.params.id && x.removed != true
                }))
                if (checkPro.length > 0)
                    setIsCurrentUser(true)
            }
        }
    }

    return (<>
        {project == null && !isLoading && <NoMatch text={t('error.notFoundProject')} />}
        {project && !isLoading &&
            <div className="view">
                <div className="view__container view__container--summmary">
                    <div className="view__row view__row--margin-bottom">
                        <div className="view__content view__content--inline-flex">
                            <div className="view__txt view__txt--project-name-position ">
                                <span>{t('project.name')}:</span>   <span className="view__txt--bold">{project.name}</span>
                            </div>
                            {isCurrentUser == true && <>
                                <span className="view__txt view__txt--project-name-position"> {t('common.yoursQuantityHours')}: {(project.employees.find(x => { return x.id == Cookies.get('id') })).hours}</span>
                                <div className="view__content--add-hour">
                                    <span className="view__txt"> {t('common.addHours')}: </span>
                                    <input type="number" className="view__input view__input--add-hour" onChange={x => setAddHoursValue(x.target.value)} />
                                    <span className="view__button view__button--add-hour" onClick={x => addHours()} > {t('button.accept')}</span>
                                </div>
                            </>}

                        </div>

                    </div>
                    <div className="view__row view__row--margin-bottom">
                        <div className="view__txt ">{t('project.totalHoursShort')}: {project.totalActiveHours} </div>
                        <div className="view__txt ">{t('project.quantityEmployees')}: {(project.employees.filter((y) => {
                            return y.removed != true
                        })).length} </div>
                    </div>
                    <div className="view__row view__row--margin-bottom">
                        <div className="view__txt view__txt--title">{t('project.description')}  </div>
                        <div className="view__content view__content--description">
                            {project.description}
                        </div>
                    </div>
                    <div className="view__row">
                        <div className="view__txt view__txt--title">{t('project.listEmployees')}:  </div>
                        <div className="view__content view__content--summary">
                            {project.employees.map((x, index) => (
                                x.removed != true &&

                                <Link key={x.id} className="view__button view__button--employee" to={`/employee/${x.id}`}>
                                    <div >
                                        {x.firstName} {x.lastName}
                                    </div>
                                </Link>

                            ))
                            }
                        </div>
                    </div>
                    <div className="view__row">
                        <div className="view__txt view__txt--title">Raport</div>
                        {project != null && <PDFDownloadLink
                            document={<ProjectPDF data={project} />}
                            fileName={`${project.name}-${project.id}.pdf`}
                            className="view__button view__button--report"
                        >
                            {({ blob, url, loading, error }) =>
                                loading ? t('pdf.loading') : t('pdf.downloadReport')
                            }
                        </PDFDownloadLink>}
                    </div>
                </div>
            </div>

        }
    </>)

}

export default ProjectSummary;