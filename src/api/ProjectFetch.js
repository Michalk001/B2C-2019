

class ProjectFetch {

    async Get() {
        let result = [];
        await fetch("http://localhost:4000/projects", {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(res => res.json())
            .then(res => {
                result = res.filter((x) => {
                    return x.removed != true;
                });
            })

        return result;
    }
    async Save(obj) {
        let result = [];
        await fetch("http://localhost:4000/projects", {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(obj)
        })
            .then(res => res.json())
            .then(res => {
                result = res
            })
        return result;
    }
    async GetById(id) {
        let result = [];
        await fetch(`http://localhost:4000/projects/${id}`, {
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
    async Update(obj) {
        let result = [];
        await fetch(`http://localhost:4000/projects/${obj.id}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(obj)
        })
            .then(res => res.json())
            .then(res => {
                result = res
            })
        return result;
    }

    async Delete(id) {
        let project = await this.GetById(id);
        project.removed = true;
        await this.Update(project);
    }
}

export default ProjectFetch;