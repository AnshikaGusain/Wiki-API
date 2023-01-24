const express=require("express");
const mongoose=require("mongoose");
const ejs=require("ejs");

const app=express();
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine","ejs");
mongoose.set('strictQuery',false);
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema=new mongoose.Schema({
    title:String,
    content:String
})

const Article=new mongoose.model("article",articleSchema);

// app.get("/articles",(req,res)=>{
//     Article.find({},(err,articles)=>{
//         if(!err){
//             res.send(articles);
//         }
//         else{
//             res.send(err);
//         }
//     })
// });

// app.post("/articles",(req,res)=>{
//     console.log(req.body);
//     const article=new Article({
//         title:req.body.title,
//         content:req.body.content
//     });
//     article.save((err)=>{
//         if(err)res.send(err);
//         else res.send("Successfully added a new article");
//     });
// })

// app.delete("/articles",(req,res)=>{
//     Article.deleteMany((err)=>{
//         if(err)res.send(err);
//         else res.send("Successfully deleting all the articles");
//     });
// })




// Route chaning


///////////////////////////////////// Request targeting all articles///////////////////////
app.route("/articles")
.get((req,res)=>{
    Article.find({},(err,articles)=>{
        if(!err){
            res.send(articles);
        }
        else{
            res.send(err);
        }
    })
})
.post((req,res)=>{
    const article=new Article({
        title:req.body.title,
        content:req.body.content
    });
    article.save((err)=>{
        if(err)res.send(err);
        else res.send("Successfully added a new article");
    });
})
.delete((req,res)=>{
    Article.deleteMany((err)=>{
        if(err)res.send(err);
        else res.send("Successfully deleting all the articles");
    });
});


//////////////////////////////// Request targeting a specific article /////////////////////
app.route("/articles/:articleName")
.get((req,res)=>{
    Article.findOne({title:req.params.articleName},(err,article)=>{
        if (article)res.send(article);
        else res.send("No articles matching that title was found");
    })
})
.put((req,res)=>{
    Article.findOneAndUpdate({title:req.params.articleName},{title:req.body.title, content: req.body.content},{overwrite:true},(err)=>{
        // console.log(req.body);
        if(!err)res.send("Successfully updated specified article");
        else res.send(err);
    })
})
.patch((req,res)=>{
    Article.updateOne({title:req.params.articleName},{$set:req.body},(err)=>{
        if(!err)res.send("Successfully update field of article");
        else res.send(err);
    })
})
.delete((req,res)=>{
    Article.deleteOne({title:req.params.articleName},(err)=>{
        if(err)res.send(err);
        else res.send("Successfully deleted specified article");
    })
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})