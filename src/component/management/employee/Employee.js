
import React, { useState, useEffect, state } from "react";
import EmployeeFetch from "../../../api/EmployeeFetch"
import Select from 'react-select';
import ProjectFetch from "../../../api/ProjectFetch"
import { useTranslation } from 'react-i18next';
import RemoveBox from '../../messageBox/RemoveBox'
import InfoBox from '../../messageBox/InfoBox'
import { Link } from 'react-router-dom';

const hash = require('object-hash');

const Employee = () => {
    const { t, i18n } = useTranslation('common');

    const eF = new EmployeeFetch();
    const pF = new ProjectFetch();


    const [showNewEmployeeContent, setShowNewEmployeeContent] = useState(false);
    const [showUpdateEmployeeContent, setShowUpdateEmployeeContent] = useState(false);
    const [showRemoveEmployeeContent, setShowRemoveEmployeeContent] = useState(false);
    const [showListEmployeeContent, setShowListEmployeeContent] = useState(false)
    const [employeesList, setEmployeesList] = useState([]);
    const [projectsList, setProjectsList] = useState([]);

    const [newEmployeeProjects, setNewEmployeeProjects] = useState([]);

    const [deleteIdEmployee, setDeleteIdEmployee] = useState(null);

    const [newEmployeeValue, setNewEmployeeValue] = useState([]);

    const [removeBox, setRemoveBox] = useState(false)
    const [infoBox, setInfoBox] = useState(false)
    const [infoBoxText, setInfoBoxText] = useState("")
    const UpdateNewEmployeeValue = e => {
        setNewEmployeeValue({ ...newEmployeeValue, [e.name]: e.value })
    }

    const [employeeInformation, setEmployeeInformation] = useState(null)

    const [changeEmployeeProject, setChangeEmployeeProject] = useState([]);

    const [changeEmployeeData, setChangeEmployeeData] = useState(null);
    const UpdateEmployeeData = e => {
        setChangeEmployeeData({ ...changeEmployeeData, [e.name]: e.value })
    }



    const getEmployeeDataToUpdate = async (id) => {
        const employee = await eF.GetById(id);
        setChangeEmployeeData(employee);
        if (employee.projects) {
            let selectProjects = [];
            employee.projects
                .filter((x) => {
                    return x.removed == false;
                })
                .map(x => {
                    const project = projectsList.find((ind) => {

                        return ind.value == x.id
                    })
                    selectProjects.push(project);
                })
            setChangeEmployeeProject(selectProjects);
        }
        else {
            setChangeEmployeeProject([])
        }

    }


    const getEmployeeList = async () => {
        const tmpEL = await eF.Get();
        let employeeListTMP = []
        tmpEL.length > 0 && tmpEL
            .filter((x) => x.removed != true)
            .map(x => {
                employeeListTMP.push({ value: x.id, label: `${x.firstName} ${x.lastName}`, name: "EmployeeList" })
            })
        setEmployeesList(employeeListTMP)
    }

    const getProjectsList = async () => {
        const tmpPL = await pF.Get();
        let projectsListTMP = []
        tmpPL.length > 0 && tmpPL
            .filter((x) => x.removed != true)
            .map(x => {
                projectsListTMP.push({ value: x.id, label: x.name, name: "ProjectsList", })
            })
        setProjectsList(projectsListTMP)
    }
    const saveEmployee = async (event) => {
        event.preventDefault();
        let tmpArray = [];
        if (newEmployeeProjects)
            newEmployeeProjects.map(x => {
                tmpArray.push({ id: x.value })
            })
        newEmployeeValue.password = hash(newEmployeeValue.password);
        if (newEmployeeValue.isAdmin && newEmployeeValue.isAdmin == "true")
            newEmployeeValue.isAdmin = true;
        else
            newEmployeeValue.isAdmin = false;
        newEmployeeValue.login = newEmployeeValue.login.trim();
        const obj = {
            ...newEmployeeValue,
            projects: tmpArray
        }
        await eF.Save(obj).then(data => {
            if (data.id) {
                setInfoBoxText(t('messageBox.addEmployee'))
            }
            else {
                if (data.error == "isBusy")
                    setInfoBoxText(t('messageBox.loginBusy'))
                else
                    setInfoBoxText(t('messageBox.error'))
            }
            setInfoBox(true)
            getEmployeeList();
        })

    }
    const deleteEmployee = async (remove) => {
        if (remove) {
            eF.Delete(deleteIdEmployee);
            await getEmployeeList();
        }

    }
    const updateEmployee = async (event) => {
        event.preventDefault();
        let newProjects = changeEmployeeData.projects;
        if (changeEmployeeProject) {
            newProjects = changeEmployeeProject;
            changeEmployeeData.projects.map((x, index) => {
                const projectRemove = changeEmployeeProject.find((ind) => {

                    return ind.value == x.id
                })
                if (!projectRemove) {
                    changeEmployeeData.projects[index].removed = true;
                }
                else {
                    changeEmployeeData.projects[index].removed = false;

                }
                newProjects = newProjects.filter((y) => {
                    return y.value != x.id
                })
            })
            newProjects.map(x => {
                const isOld = changeEmployeeData.projects.find((y) => {

                    return x.value == y.id
                })
                if (!isOld) {
                    changeEmployeeData.projects.push({ id: x.value, removed: false })
                }
            })
        }
        else {
            changeEmployeeData.projects.map((x, index) => {
                changeEmployeeData.projects[index].removed = true;
            })
        }

        const obj = {
            ...changeEmployeeData
        }
        await eF.Update(obj).then(data => {
            if (data.id) {
                setInfoBoxText(t('messageBox.editEmployee'))
            }
            else {
                setInfoBoxText(t('messageBox.error'))
            }
            setInfoBox(true)
        })
    }

    const getEmployeeInformation = async (id) => {
        const emp = await eF.GetById(id)

        if (emp.id) {
            const pro = await getProjectByEmployee(emp)

            setEmployeeInformation({ firstName: emp.firstName, lastName: emp.lastName, id: emp.id, phoneNumber: emp.phoneNumber, email: emp.email, ...pro })
        }
    }

    const getProjectByEmployee = async (emp) => {
        const empPro = emp.projects.filter((x) => {
            return x.removed != true
        })

        let projects = []
        let totalActiveProjectsHours = 0
        let totalActiveProjects = 0
     
        if (empPro.length > 0) {
            await Promise.all(empPro.map(async (x) => {
                const proTmp = await pF.GetById(x.id);
                if (proTmp.id)
                    if (proTmp.removed != true)
                        {
                            projects.push({ id: proTmp.id, name: proTmp.name })
                            if (x.hours)
                            totalActiveProjectsHours += x.hours
                        }
            })
            )
            totalActiveProjects = projects.length;
        }
        return { projects, totalActiveProjectsHours, totalActiveProjects };
    }


    useEffect(() => {
        getEmployeeList();
        getProjectsList();
    }, [])

    useEffect(() => { }, [changeEmployeeData])

    return (
        <>
            {infoBox && < InfoBox txt={infoBoxText} callback={(x) => { setInfoBox(x) }} />}
            {removeBox && < RemoveBox txt={t('messageBox.removeEmployeeConf')} callback={(x) => { setRemoveBox(false); deleteEmployee(x) }} />}
            <div className="dashboard-setting">
                <div className={`dashboard-setting__box dashboard-setting__box--admin ${showNewEmployeeContent ? "dashboard-setting__box--open" : ""}`} >
                    <div className={`dashboard-setting__txt dashboard-setting__txt--title ${showNewEmployeeContent ? "dashboard-setting__txt--coursor-reset" : ""}`}
                        onClick={x => { setShowNewEmployeeContent(true); setShowUpdateEmployeeContent(false); setShowRemoveEmployeeContent(false); setShowListEmployeeContent(false) }}>
                        {t('employee.addEmployee')}
                    </div>
                    {showNewEmployeeContent && <div className="cross" onClick={x => setShowNewEmployeeContent(false)} />}
                    <div className={`dashboard-setting__content  ${showNewEmployeeContent ? "dashboard-setting__content--open" : ""}`}>
                        <form
                            onSubmit={x => saveEmployee(x)}
                        >
                            <div className="form-editor__row">
                                <div className="form-editor__content">
                                    <div className="form-editor__txt">{t('employee.firstName')} </div>
                                    <input required type="text" className="form-editor__input" name="firstName" onChange={x => UpdateNewEmployeeValue(x.target)} />
                                </div>
                                <div className="form-editor__content">
                                    <div className="form-editor__txt ">{t('employee.lastName')} </div>
                                    <input required type="text" className="form-editor__input" name="lastName" onChange={x => UpdateNewEmployeeValue(x.target)} />
                                </div>
                                <div className="form-editor__content">
                                    <div className="form-editor__txt ">{t('common.phoneNumber')} </div>
                                    <input required pattern="[0-9]+" type="text" className="form-editor__input" name="phoneNumber" onChange={x => UpdateNewEmployeeValue(x.target)} />
                                </div>
                                <div className="form-editor__content">
                                    <div className="form-editor__txt ">{t('common.login')} </div>
                                    <input required type="text" className="form-editor__input" name="login" onChange={x => UpdateNewEmployeeValue(x.target)} />
                                </div>
                                <div className="form-editor__content">
                                    <div className="form-editor__txt ">{t('common.password')} </div>
                                    <input required type="password" className="form-editor__input" name="password" onChange={x => UpdateNewEmployeeValue(x.target)} />
                                </div>
                                <div className="form-editor__content">
                                    <div className="form-editor__txt">{t('employee.email')} </div>
                                    <input required type="email" className="form-editor__input" name="email" onChange={x => UpdateNewEmployeeValue(x.target)} />
                                </div>
                                <div className="form-editor__content">
                                    <div className="form-editor__txt">{t('employee.typeAccount')} </div>
                                    <select className="form-editor__input" name="isAdmin" onChange={x => { UpdateNewEmployeeValue(x.target) }}>
                                        <option value="false">{t('employee.standard')}</option>
                                        <option value="true">{t('employee.admin')}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-editor__row">
                                <div className="form-editor__content form-editor__content--large">
                                    <div className="form-editor__txt">{t('employee.projects')}</div>
                                    <Select
                                        className="form-editor__select form-editor__select--large"
                                        isMulti
                                        options={projectsList}
                                        onChange={x => setNewEmployeeProjects(x)}
                                    />
                                </div>
                            </div>
                            <div className="form-editor__row">
                                <input className="form-editor__button form-editor__button--submit" type="submit" value={t('button.add')} />

                            </div>
                        </form>
                    </div>
                </div>

                <div className={`dashboard-setting__box dashboard-setting__box--admin ${showRemoveEmployeeContent ? "dashboard-setting__box--open" : ""}`} >
                    <div className={`dashboard-setting__txt dashboard-setting__txt--title ${showRemoveEmployeeContent ? "dashboard-setting__txt--coursor-reset" : ""}`}
                        onClick={x => { setShowNewEmployeeContent(false); setShowUpdateEmployeeContent(false); setShowRemoveEmployeeContent(true); setShowListEmployeeContent(false) }}>
                        {t('employee.removeEmployee')}
                    </div>
                    {showRemoveEmployeeContent && <div className="cross" onClick={x => setShowRemoveEmployeeContent(false)} />}
                    <div className={`dashboard-setting__content  ${showRemoveEmployeeContent ? "dashboard-setting__content--open" : ""}`}>
                        <div className="form-editor__row">
                            <div className="form-editor__content">
                                <div className="form-editor__txt form-editor__txt--subtitle">{t('employee.select')} </div>
                                <Select
                                    className="form-editor__select"
                                    options={employeesList}
                                    onChange={x => setDeleteIdEmployee(x.value)}
                                />
                            </div>
                        </div>
                        <div className="form-editor__row">
                            <div className="form-editor__button form-editor__button--submit form-editor__button--red" onClick={x => setRemoveBox(true)}>{t('button.remove')}</div>
                        </div>
                    </div>
                </div>

                <div className={`dashboard-setting__box dashboard-setting__box--admin ${showUpdateEmployeeContent ? "dashboard-setting__box--open" : ""}`}>
                    <div className={`dashboard-setting__txt dashboard-setting__txt--title ${showUpdateEmployeeContent ? "dashboard-setting__txt--coursor-reset" : ""}`}
                        onClick={x => { setShowNewEmployeeContent(false); setShowUpdateEmployeeContent(true); setShowRemoveEmployeeContent(false); setShowListEmployeeContent(false) }}>
                        {t('employee.editEmployee')}
                    </div>
                    {showUpdateEmployeeContent && <div className="cross" onClick={x => { setShowUpdateEmployeeContent(false); }} />}
                    <div className={`dashboard-setting__content  ${showUpdateEmployeeContent ? "dashboard-setting__content--open" : ""}`}>
                        <div className="form-editor__row">
                            <div className="form-editor__content">
                                <div className="form-editor__txt form-editor__txt--subtitle">{t('employee.select')}</div>
                                <Select
                                    className="form-editor__select"
                                    options={employeesList}
                                    onChange={x => getEmployeeDataToUpdate(x.value)}
                                />
                            </div>
                        </div>
                        {changeEmployeeData && <form
                            onSubmit={x => updateEmployee(x)}
                        >
                            <div className="form-editor__row">
                                <div className="form-editor__content">
                                    <div className="form-editor__txt ">{t('employee.firstName')} </div>
                                    <input required type="text" className="form-editor__input" name="firstName" value={changeEmployeeData.firstName} onChange={x => UpdateEmployeeData(x.target)} />
                                </div>
                                <div className="form-editor__content">
                                    <div className="form-editor__txt ">{t('employee.lastName')} </div>
                                    <input required type="text" className="form-editor__input" name="lastName" value={changeEmployeeData.lastName} onChange={x => UpdateEmployeeData(x.target)} />
                                </div>
                                <div className="form-editor__content">
                                    <div className="form-editor__txt ">{t('employee.email')} </div>
                                    <input required type="email" className="form-editor__input" name="email" value={changeEmployeeData.email} onChange={x => UpdateEmployeeData(x.target)} />
                                </div>
                                <div className="form-editor__content">
                                    <div className="form-editor__txt ">{t('common.phoneNumber')}</div>
                                    <input required pattern="[0-9]+"  type="text" className="form-editor__input" name="phoneNumber" value={changeEmployeeData.phoneNumber} onChange={x => UpdateEmployeeData(x.target)} />
                                </div>
                                <div className="form-editor__content">
                                    <div className="form-editor__txt">{t('employee.typeAccount')} </div>
                                    <select value={changeEmployeeData.Admin} className="form-editor__input" name="Admin" onChange={x => { UpdateEmployeeData(x.target) }}>
                                        <option value="false">{t('employee.standard')}</option>
                                        <option value="true">{t('employee.admin')}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-editor__row">
                                <div className="form-editor__content form-editor__content--large">
                                    <div className="form-editor__txt form-editor__txt--subtitle">{t('employee.projects')}</div>
                                    <Select
                                        value={changeEmployeeProject}
                                        className="form-editor__select form-editor__select--large"
                                        isMulti
                                        options={projectsList}
                                        onChange={x => { setChangeEmployeeProject(x) }}
                                    />
                                </div>
                            </div>
                            <div className="form-editor__row">
                                <input className="form-editor__button form-editor__button--submit" type="submit" value={t('button.update')} />

                            </div>
                        </form>}
                    </div>
                </div>

                <div className={`dashboard-setting__box dashboard-setting__box--admin ${showListEmployeeContent ? "dashboard-setting__box--open" : ""}`} >
                    <div className={`dashboard-setting__txt dashboard-setting__txt--title ${showListEmployeeContent ? "dashboard-setting__txt--coursor-reset" : ""}`}
                        onClick={x => { setShowNewEmployeeContent(false); setShowUpdateEmployeeContent(false); setShowRemoveEmployeeContent(false); setShowListEmployeeContent(true) }}>
                        {t('adminPanel.employeesList')}
                    </div>
                    {showListEmployeeContent && <div className="cross" onClick={x => setShowListEmployeeContent(false)} />}
                    <div className={`dashboard-setting__content  ${showListEmployeeContent ? "dashboard-setting__content--open" : ""}`}>
                        <div className="form-editor__row">
                            <div className="form-editor__content">
                                <div className="form-editor__txt form-editor__txt--subtitle">{t('employee.select')} </div>
                                <Select
                                    className="form-editor__select"
                                    options={employeesList}
                                    onChange={x => getEmployeeInformation(x.value)}
                                />
                            </div>
                        </div>

                        {employeeInformation != null &&
                            < >
                                <div className="form-editor__row">
                                    <div className="form-editor__content form-editor__content--large form-editor__content--inline">
                                        <Link to={`/employee/${employeeInformation.id}`}>
                                            <div className="form-editor__button form-editor__button--employee"> {t('employee.toDetails')}</div>
                                        </Link>
                                    </div>
                                </div>
                                <div className="form-editor__row">
                                    <div className="form-editor__content form-editor__content--large form-editor__content--inline">

                                        <div className="form-editor__txt  form-editor__txt--rigth-gap">{t('common.emailAdress')}: <span className="form-editor__txt--bold">{employeeInformation.email} </span></div>
                                        <div className="form-editor__txt ">{t('common.phoneNumber')}: <span className="form-editor__txt--bold">{employeeInformation.phoneNumber} </span></div>

                                    </div>
                                </div>
                                <div className="form-editor__row">
                                    <div className="form-editor__content form-editor__content--large form-editor__content--inline">
                                        <div className="form-editor__txt  form-editor__txt--rigth-gap">{t('employee.totalActiveProjects')}: <span className="form-editor__txt--bold">{employeeInformation.totalActiveProjects} </span></div>
                                        <div className="form-editor__txt ">{t('employee.totalHours')}: <span className="form-editor__txt--bold">{employeeInformation.totalActiveProjectsHours} </span> </div>
                                    </div>
                                </div>
                                <div className="form-editor__row">
                                    <div className="form-editor__content form-editor__content--large">
                                        {employeeInformation.projects.map(x => (
                                            <Link key={x.id} to={`/project/${x.id}`}>
                                                <div className="form-editor__button form-editor__button--employee">{x.name}  </div>
                                            </Link>

                                        ))}
                                    </div>
                                </div>
                            </>

                        }

                    </div>
                </div>

            </div>
        </>
    )

}

export default Employee; 