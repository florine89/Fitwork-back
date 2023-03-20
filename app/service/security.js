import jwt from 'jsonwebtoken';
import userMapper from '../DataMapper/userMapper.js'
export default {
    //on verifie le token içi
    checkToken(req, res, next) {
        try {
 
            const user = jwt.verify(req.token, process.env.SESSION_SECRET);
            if (!user){
                res.json(`problème d'identité`)
            }
            next();
        }
        catch (error) {
            console.log('checkToken - error : ',error);
            next(error);
        }
    },
    async readToken(req, res, next) {
        let result;
        try {
            console.log(req.headers.authorization);
            const token = req.headers.authorization.split(' ')[1]; 
            const user = jwt.verify(token, process.env.SESSION_SECRET);
            if (!user){
                res.json(`problème d'identité`)
            };
            try{
                const foundUser = await userMapper.selectOne(user.user_id);
                const firstname=foundUser.firstname;
                const id = foundUser.id;
                const role_id = foundUser.role_id;
                result ={logged:true,id,firstname,role_id};
                res.json(result)
            }
            catch(error){
                console.log('reloadToken error', error)
            }
        }
        catch (error) {
            console.log('checkToken - error : ',error);
            next(error);
        }
    }
};
