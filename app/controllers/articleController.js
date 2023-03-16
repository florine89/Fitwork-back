//Le controller fait appel au dataMapper du fichier concerné


import articleMapper from "../DataMapper/articleMapper.js";

export default{
    async getArticlesByCategory(req,res,next) {
        try{
            const articles = await articleMapper.getAll(req.params.id);
            if (!articles){
                throw "Il n'y a pas d'article dans cette catégorie"
            }
            res.json(articles);
        }
        catch(error){
            console.log('getAllArticle-error : ',error);
            next(error)
        }
    },

    async getOneArticle(req,res,next){
        try {
            const article = await articleMapper.getOne(req.params.id);
            if (!article){
                throw 'article non trouvé';
            }
            res.json(article);
        }
        catch(error){
            console.log('getOneArticle-error : ',error);
            next(error)
        }
    },

    async addOneArticle(req,res,next){
        try{
            const newArticle = await articleMapper.addOne(req.body);
            if (!newArticle){
                throw 'une erreur est survenue à la création';
            }
            res.json(newArticle);
        }
        catch(error){
            console.log('addOneArticle-error',error);
            next(error);
        }
    },

    async updateOneArticle(req,res,next){
        try{
        const foundArticle = await articleMapper.getOne(req.params.id);
        if(!foundArticle){
            next(new Error(`l'article n'existe pas`))
        }
        if (foundArticle.user_id !== req.body.user_id){
            next(new Error(`Vous n'êtes pas l'auteur, vous ne pouvez pas supprimer cet article`))
        }
            try{
                const updatedArticle = await articleMapper.updateOne(req.params.id,req.body);
                if (!updatedArticle){
                    throw`L'article n'a pas pu être modifié`
                }
                res.json(updatedArticle);
            }
            catch(error){
                console.log('updatedArticle from Mapper-error : ', error)
                next(error)
            }
    
        }
        catch(error){
            console.log('updateOneArticle article not found error : ', error);
            next(error);
        }
    },

    async deleteOneArticle(req,res,next){
        console.log(req.params.id, "params")
        console.log(req.body.id, "body")
        try{
            const foundArticle = await articleMapper.getOne(req.params.id);
            if(!foundArticle){
                next(new Error(`l'article n'existe pas`))
                return;
            }
            if (foundArticle.user_id !== req.body.user_id){
                next(new Error(`Vous n'êtes pas l'auteur, vous ne pouvez pas supprimer cet article`))
            }
            try{
                
                const deletedArticle = await articleMapper.deleteOne(req.params.id);
                if (!deletedArticle){
                    next(new Error(`problème lors de la suppression de l'article`))
                }
                res.json(deletedArticle);
            }
            catch(error){
                console.log('deleteOneArticle no deleted article - error : ', error)
                next(error)
                return;
            }
        }
        catch(error){
            console.log('deleteOneArticle no found article -error : ', error);
            next(error);
            return;
        }
    },
    async getAllArticles(_,res,next){
        try {
            const articles = await articleMapper.getAllArticles();
            if (!articles){
                next (new Error ("Pas d'article à présenter."));
            }
            res.json(articles);
        }
        catch(error){
            console.log('getAllArticles no articles returned - error', error);
            next(error);
        }
    }
}
