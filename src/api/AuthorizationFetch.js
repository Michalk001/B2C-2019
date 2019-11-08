
import EmployeeFetch from "./EmployeeFetch"
const hash = require('object-hash');
const jwt = require('jwt-simple');
class AuthorizationFetch {
   // console.log(hash("Test")

    async SingIn(login,password){
        const hashPass = hash(password);
        const eF = new EmployeeFetch();
        let result = [];
        await eF.Get().then(x =>{
            result = x.filter((z) =>{
                return z.login.toLowerCase() == login.trim().toLowerCase() && z.password == hashPass
            })
        })
        if(result.length > 0 )
        {
            const payload = {id: result[0].id, firstName: result[0].firstName, lastName: result[0].lastName, isAdmin: result[0].Admin}
            result = jwt.encode(payload,"secret");
        }
        return result;
    }
}

export default AuthorizationFetch;