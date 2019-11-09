
import React, { useState, useEffect, state } from "react";
import { Link } from 'react-router-dom';
import EmployeeFetch from "../../../api/EmployeeFetch"
import Select from 'react-select';
import ProjectFetch from "../../../api/ProjectFetch"
import { useTranslation } from 'react-i18next';
import RemoveBox from '../../messageBox/RemoveBox'
import InfoBox from '../../messageBox/InfoBox'

const Project = () => {

    const { t, i18n } = useTranslation('common');
    const pF = new ProjectFetch();
    const eF = new EmployeeFetch();

    const [showNewProjectContent, setShowNewProjectContent] = useState(false);
    const [showUpdateProjectContent, setShowUpdateProjectContent] = useState(false);
    const [showRemoveProjectContent, setShowRemoveProjectContent] = useState(false);
    const [showInformationProjectContent, setShowInformationProjectContent] = useState(false);

    const [projectsList, setProjectsList] = useState([]);
    const [deleteIdProject, setDeleteIdProject] = useState(null);

    const [newProjectValue, setNewProjectValue] = useState(null);
    const [projectInformation, setProjectInformation] = useState(null);
    const [changeProjectValue, setChangeProjectValue] = useState(null);


    const [removeBox, setRemoveBox] = useState(false)
    const [infoBox, setInfoBox] = useState(false)
    const [infoBoxText, setInfoBoxText] = useState("")

    const UpdateNewProjectValue = e => {
        setNewProjectValue({ ...newProjectValue, [e.name]: e.value })
    }
    const UpdateChangeProjectValue = e => {
        setChangeProjectValue({ ...changeProjectValue, [e.name]: e.value })
    }
    const getProjectsList = async () => {
        const tmpPL = await pF.Get();
        let projectsListTMP = []
        tmpPL.length > 0 && tmpPL.map(x => {
            projectsListTMP.push({ value: x.id, label: x.name, name: "ProjectsList", })
        })
        setProjectsList(projectsListTMP)
    }

    const saveProject = async (event) => {
        event.preventDefault();
        await pF.Save(newProjectValue).then(data => {
            if (data.id) {
                setInfoBoxText(t('messageBox.addProject'))
            }
            else {
                setInfoBoxText(t('messageBox.error'))
            }
            setInfoBox(true)
        })
        getProjectsList()
    }

    const deleteProject = async (remove) => {
        if (remove) {
            await pF.Delete(deleteIdProject);
            getProjectsList()
        }
    }
    useEffect(() => {
        getProjectsList();
    }, [])
    useEffect(() => {

    }, [projectInformation])
    const getProjectInformation = async (id) => {

        let project = await pF.GetById(id)
        let totalHours = 0;
        let currentyTotalHours = 0;
        if (project.employees) {
            const res = await getEmployeesList(project.employees, id)
            project = { ...project, employees: res }
            res.map(x => {
                totalHours += x.hours;
                if (!x.removed && !x.projectRemoved)
                    currentyTotalHours += x.hours;
            })
        }
        else
            project.employees = null;
        project.totalHours = totalHours;
        project.currentyTotalHours = currentyTotalHours;
        setProjectInformation(project)
    }

    const getEmployeesList = async (listE, projectId) => {
        let list = []

        await Promise.all(listE.map(async x => {
            let hours = 0
            const employee = await eF.GetById(x.employeeID);
            if (employee.id) {
                const proj = employee.projects.find((x) => {
                    return x.id == projectId
                })
                if (proj !== undefined) {
                    if (proj && proj.hours)
                        hours = proj.hours
                    if (employee.removed === undefined)
                        employee.removed = false;
                    if (proj.removed === undefined)
                        employee.projectRemoved = false;
                    else {
                        employee.projectRemoved = proj.removed;
                    }
                    list.push({ projectRemoved: employee.projectRemoved, firstName: employee.firstName, lastName: employee.lastName, id: employee.id, hours: hours, removed: employee.removed })
                }
            }
        }))
        return list;
    }

    const getProjectUpdate = async (x) => {
        const result = await pF.GetById(x)
        setChangeProjectValue(result);
    }
    const updateProject = async (event) => {
        event.preventDefault();
        await pF.Update(changeProjectValue).then(data => {
            if (data.id) {
                setInfoBoxText(t('messageBox.editProject'))
                getProjectsList()
            }
            else {
                setInfoBoxText(t('messageBox.error'))
            }
            setInfoBox(true)
        })
    }

    return (
        <>
            {infoBox && < InfoBox txt={infoBoxText} callback={(x) => { setInfoBox(x) }} />}
            {removeBox && < RemoveBox txt={t('messageBox.removeProjectConf')} callback={(x) => { setRemoveBox(false); deleteProject(x) }} />}
            <div className="dashboard-setting">
                <div className={`dashboard-setting__box dashboard-setting__box--admin  ${showNewProjectContent ? "dashboard-setting__box--open" : ""}`} >
                    <div className={`dashboard-setting__txt dashboard-setting__txt--title  ${showNewProjectContent ? "dashboard-setting__txt--coursor-reset" : ""}`}
                        onClick={x => { setShowNewProjectContent(true); setShowUpdateProjectContent(false); setShowRemoveProjectContent(false); setShowInformationProjectContent(false) }}>
                        {t('project.addProject')}
                    </div>
                    {showNewProjectContent && <div className="cross" onClick={x => setShowNewProjectContent(false)} />}
                    <div className={`dashboard-setting__content ${showNewProjectContent ? "dashboard-setting__content--open" : ""}`}>
                        <form
                            onSubmit={x => saveProject(x)}
                        >
                            <div className="form-editor__row">
                                <div className="form-editor__content">
                                    <div className="form-editor__txt form-editor__txt--subtitle">{t('project.name')}: </div>
                                    <input required type="text" className="form-editor__input" name="name" onChange={x => UpdateNewProjectValue(x.target)} />
                                </div>
                            </div>
                            <div className="form-editor__row">
                                <div className="form-editor__content form-editor__content--large">
                                    <div className="form-editor__txt form-editor__txt--subtitle">{t('project.description')}: </div>
                                    <textarea className="form-editor__input form-editor__input--description" name="description" onChange={x => UpdateNewProjectValue(x.target)} />
                                </div>
                            </div>
                            <div className="form-editor__row">
                                <input className="form-editor__button form-editor__button--submit" type="submit" value={t('button.add')} />

                            </div>
                        </form>
                    </div>

                </div>


                <div className={`dashboard-setting__box dashboard-setting__box--admin ${showUpdateProjectContent ? "dashboard-setting__box--open" : ""}`} >
                    <div className={`dashboard-setting__txt dashboard-setting__txt--title  ${showUpdateProjectContent ? "dashboard-setting__txt--coursor-reset" : ""}`}
                        onClick={x => { setShowNewProjectContent(false); setShowUpdateProjectContent(true); setShowRemoveProjectContent(false); setShowInformationProjectContent(false) }} >
                        {t('project.editProject')}
                    </div>
                    {showUpdateProjectContent && <div className="cross" onClick={x => setShowUpdateProjectContent(false)} />}
                    <div className={`dashboard-setting__content  ${showUpdateProjectContent ? "dashboard-setting__content--open" : ""}`}>
                        <div className="form-editor__row">
                            <div className="form-editor__content">
                                <div className="form-editor__txt form-editor__txt--subtitle">{t('project.select')}:</div>
                                <Select
                                    className="form-editor__select"
                                    options={projectsList}
                                    onChange={x => getProjectUpdate(x.value)}
                                />
                            </div>
                        </div>
                        {changeProjectValue != null && <form
                            onSubmit={x => updateProject(x)}
                        >
                            <div className="form-editor__row">
                                <div className="form-editor__content">
                                    <div className="form-editor__txt form-editor__txt--subtitle">{t('project.name')}:</div>
                                    <input required type="text" value={changeProjectValue.name != null ? changeProjectValue.name : ""} className="form-editor__input" name="name" onChange={x => UpdateChangeProjectValue(x.target)} />
                                </div>
                            </div>
                            <div className="form-editor__row">
                                <div className="form-editor__content form-editor__content--large">
                                    <div className="form-editor__txt form-editor__txt--subtitle">{t('project.description')}:</div>
                                    <textarea className="form-editor__input form-editor__input--description" value={changeProjectValue.description} name="description" onChange={x => UpdateChangeProjectValue(x.target)} />
                                </div>
                            </div>
                            <div className="form-editor__row">
                                <input className="form-editor__button form-editor__button--submit" type="submit" value={t('button.update')} />
                            </div>
                        </form>}
                    </div>
                </div>

                <div className={`dashboard-setting__box dashboard-setting__box--admin ${showRemoveProjectContent ? "dashboard-setting__box--open" : ""}`} >
                    <div className={`dashboard-setting__txt dashboard-setting__txt--title ${showRemoveProjectContent ? "dashboard-setting__txt--coursor-reset" : ""}`}
                        onClick={x => { setShowNewProjectContent(false); setShowUpdateProjectContent(false); setShowRemoveProjectContent(true); setShowInformationProjectContent(false) }}>
                        {t('project.removeProject')}
                    </div>
                    {showRemoveProjectContent && <div className="cross" onClick={x => setShowRemoveProjectContent(false)} />}
                    <div className={`dashboard-setting__content  ${showRemoveProjectContent ? "dashboard-setting__content--open" : ""}`}>
                        <div className="form-editor__row">
                            <div className="form-editor__content">
                                <div className="form-editor__txt form-editor__txt--subtitle">{t('project.select')}:</div>
                                <Select
                                    className="form-editor__select"
                                    options={projectsList}
                                    onChange={x => setDeleteIdProject(x.value)}
                                />
                            </div>
                        </div>
                        <div className="form-editor__row">
                            <div className="form-editor__button form-editor__button--submit form-editor__button--red" onClick={x => setRemoveBox(true)}>{t('button.remove')}</div>
                        </div>
                    </div>
                </div>


                <div className={`dashboard-setting__box dashboard-setting__box--admin  ${showInformationProjectContent ? "dashboard-setting__box--open" : ""}`} >
                    <div className={`dashboard-setting__txt dashboard-setting__txt--title  ${showInformationProjectContent ? "dashboard-setting__txt--coursor-reset" : ""}`}
                        onClick={x => { setShowNewProjectContent(false); setShowUpdateProjectContent(false); setShowRemoveProjectContent(false); setShowInformationProjectContent(true) }} >
                        {t('adminPanel.projectsList2')}
                    </div>
                    {showInformationProjectContent && <div className="cross" onClick={x => setShowRemoveProjectContent(false)} />}
                    <div className={`dashboard-setting__content ${showInformationProjectContent ? "dashboard-setting__content--open" : ""}`}>
                        <div className="form-editor__row">
                            <div className="form-editor__content">
                                <Select
                                    className="form-editor__select"
                                    options={projectsList}
                                    onChange={x => getProjectInformation(x.value)}
                                />
                            </div>
                        </div>
                        {projectInformation != null && <>
                            <div className="form-editor__row">
                                <div className="form-editor__content">

                                    <div className="form-editor__txt ">{t('project.name')}:<span className="form-editor__txt--bold"> {projectInformation.name}</span></div>
                                </div>

                                <div className="form-editor__content form-editor__content--large form-editor__content--inline">
                                    <Link to={`/project/${projectInformation.id}`}>
                                        <div className="form-editor__button form-editor__button--employee"> {t('employee.toDetails')}</div>
                                    </Link>
                                </div>

                                <div className="form-editor__content form-editor__content--large form-editor__content--inline">

                                    <div className="form-editor__txt  form-editor__txt--rigth-gap">{t('project.totalHours')}:<span className="form-editor__txt--bold"> {projectInformation.totalHours}</span></div>
                                    <div className="form-editor__txt ">{t('project.currentyHours')}: <span className="form-editor__txt--bold">{projectInformation.currentyTotalHours}</span></div>

                                </div>
                            </div>
                            <div className="form-editor__row">
                                <div className="form-editor__content form-editor__content--large">
                                    <div className="form-editor__txt form-editor__txt--subtitle">  {t('project.description')}: </div>
                                    <div className="form-editor__txt form-editor__txt--description">{projectInformation.description}</div>
                                </div>
                            </div>
                            {projectInformation.employees != null && <>
                                <div className="form-editor__row">
                                    <div className="form-editor__content form-editor__content--large form-editor__content--inline">
                                        <div className="form-editor__txt form-editor__txt--rigth-gap">{t('project.quantityEmployees')}: <span className="form-editor__txt--bold"> {(projectInformation.employees.filter((x) => {
                                            return (x.removed == false && x.projectRemoved == false)
                                        })).length} </span> </div>

                                    </div>
                                </div>
                                <div className="form-editor__row">
                                    <div className="form-editor__content form-editor__content--large"><div className="form-editor__txt form-editor__txt--subtitle">{t('project.listEmployees')}:</div></div>
                                    <div className="form-editor__content form-editor__content--large">
                                        {projectInformation.employees.map(x => (
                                            x.removed == false && x.projectRemoved == false &&
                                            <Link key={x.id} to={`/employee/${x.id}`}>
                                                <div className="form-editor__button form-editor__button--employee">{x.firstName} {x.lastName} </div>
                                            </Link>

                                        ))}
                                    </div>
                                </div>
                            </>}
                            {projectInformation.employees == null &&
                                <div className="form-editor__row">
                                    <div className="form-editor__txt ">{t('project.noEmployees')}</div>
                                </div>
                            }
                        </>}
                    </div>
                </div>
            </div>
        </>
    )

}

export default Project 