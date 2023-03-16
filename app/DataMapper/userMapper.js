// toute la gestion de l'utilisateur se passe içi


import  dbClient  from '../service/dbClient.js';
import bcrypt from 'bcryptjs';
import dayjs from 'dayjs';

export default{
 /**
     * Cherche un utilisateur par son ID (SQL)
     * @param {integer} id 
     */
    async selectOne(id){
        let result;
        const sqlQuery= `SELECT "user".id, firstname, lastname, birth_date, email, role.id AS role_id, role.label AS role FROM "user" JOIN "role" ON role.id=role_id WHERE "user".id=$1;`;
        const value= [id];
    try {
        const response = await dbClient.query (sqlQuery,value);
        result = response.rows[0];
        result.birth_date = dayjs(result.birth_date).format('YYYY-MM-DD');
    } 
    catch (error){
        console.log('userMapper selectOne sql request - error : ', error);
        throw error
    }
    return result;
    },
   
     /**
     * Cherche un utilisateur par son email (SQL)
     * @param {text} email 
     */
     async findOneByEmail(email){
        let result;
        const sqlQuery= `SELECT * FROM "user" WHERE email=$1;`;
        const value= [email];
    try {
        const response = await dbClient.query (sqlQuery,value);
        result = response.rows[0];
    } 
    catch (error){
        console.log('userMapper findOnebyEmail sql request - error : ', error);
        throw error
    }
    return result;
    },
    /**
     * Gère la création d'un utilisateur (SQL)
     * @param {text} firstname
     * @param {text} lastname
     * @param {text} email
     * @param {date} birth_date
     * @param {text} password
     * @param {integer} role_id
     */

    //ici c'est la création d'un utilisateur
    async insert (user){
        try{
            const foundUser = await this.findOneByEmail(user.email)
            if (foundUser){
                const foundAlert='Adresse email déjà utilisée.'
                return foundAlert
            }
            const saltRounds=12;
            const hash=await bcrypt.hash(user.password,saltRounds);
            // user.password=NULL;
            const sqlQuery =`INSERT INTO "user" ("firstname","lastname","email","birth_date","password","role_id") VALUES ($1,$2,$3,$4,$5,$6);`;    
            const values=[user.firstname, user.lastname,user.email,user.birth_date,hash,user.role_id=2];
            try{
                await dbClient.query(sqlQuery,values);
                return 'ok';
            }
            catch(error){
                console.log('userMapper insertOne sql request - error : ', error);
                throw error
            }
        }
        catch(error){
            console.log('userMapper insert findByEmail - error : ', error);
            throw error;
        }
    },

    async update (userId, body){
       
        const sqlQuery = `UPDATE "user" SET
                        "firstname" = COALESCE($1, firstname),
                        "lastname" = COALESCE($2, lastname),
                        "email" = COALESCE($3, email),
                        "birth_date" = COALESCE($4, birth_date),
                        updated_at = now()
                        WHERE id=$5::int RETURNING firstname,lastname,email,birth_date;`
        const values =[body.firstname,body.lastname,body.email,body.birth_date,userId];
        try {
            const result = await dbClient.query (sqlQuery,values);
            return result.rows[0];
        } catch (error){
            console.log('userMapper update sql request - error : ', error);
            throw error
        }
    },

    async deleteOne(id){
        const sqlQuery= `DELETE FROM "user" WHERE id=$1`;
        const value= [id];
        try {
            await dbClient.query (sqlQuery,value);
            return 'done';
        } catch (error){
            console.log('userMapper deleteOne sql request - error : ', error);
            throw error
        }
        },

        async getAllArticles(user_id){
            const sqlQuery = `SELECT 
            article.id, title, description, time, "type", image,
            "name" AS category  
            FROM article 
            JOIN category ON category.id=category_id WHERE user_id=$1;`;
            const value = [user_id]
            try{
                const articles = await dbClient.query(sqlQuery,value);
                if(!articles){
                    throw 'problème de lecture des articles'
                }
                return articles.rows;
            }
            catch(error){
                console.log('articleMapper getAll SQL - error : ',error)
                throw error
            }
        }

}