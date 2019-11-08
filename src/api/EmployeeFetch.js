import { EFAULT } from "constants";


class EmployeeFetch {

    async Get() {
        let result = [];
        await fetch("http://localhost:4000/employees", {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(res => res.json())
            .then(res => {
                result = res;

            })

        return result;
    }
    async GetById(id) {
        let result = [];
        await fetch(`http://localhost:4000/employees/${id}`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(res => res.json())
            .then(res => {
                result = res;
            })

        return result;
    }
    async Save(obj) {
        let result = []
        const list = await this.Get();
        const isBussy = await Promise.all(list.filter(x => {
            return x.login == obj.login
        }))
        if (isBussy.length > 0) {
            return { error: "isBusy" }
        }
        await fetch("http://localhost:4000/employees", {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(obj)
        })
            .then(res => res.json())
            .then(res => {
                result = res;

               
            })
        if (result != [])
            this.AddEmployeeToProject(obj.projects, result.id)
        return result;
    }
    async Update(obj) {
        let result = []
        await fetch(`http://localhost:4000/employees/${obj.id}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(obj)
        })
            .then(res => res.json())
            .then(res => {
                result = res;

            })
        if (result != [])
            this.AddEmployeeToProject(obj.projects, obj.id)

        return result;
    }

    async Delete(id) {
        let employee = await this.GetById(id);
        employee.removed = true;
        await this.Update(employee);
    }



    //methods unnecessary when backendd is real and relation was configurated
    async AddEmployeeToProject(projectsArray, employeeId) {
        let obj2 = []
        await Promise.all(projectsArray.map(async (x) => {
            await fetch(`http://localhost:4000/projects/${x.id}`, {
                method: "get",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
                .then(res => res.json())
                .then(res => {
                    if (res != []) {
                        obj2.push(res);
                    }
                })
        }))

        if (obj2.length <= 0)
            return
        obj2.map((x, index) => {
            let employRet = null
            if (x.employees)
                employRet = x.employees.find((emp) => {
                    return emp.employeeID == employeeId
                })
            if (!employRet) {
                if (x.employees)
                    x.employees.push({ employeeID: employeeId })
                else
                    x.employees = [{ employeeID: employeeId }]
            }
        })
        await Promise.all(obj2.map(async (x, index) => {

            await fetch(`http://localhost:4000/projects/${x.id}`, {
                method: "put",
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(x)
            })
                .then(res => res.json())
                .then(res => {

                })


        }))
    }
}

export default EmployeeFetch;