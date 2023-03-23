const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const _=require("lodash");
const app=express();
// const date=require(__dirname+"/date.js");
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://shantanukr2201:Hack%401811@cluster0.luaqqsb.mongodb.net/todolistDB?retryWrites=true&w=majority');

  const itemsSchema={
    name:String
};
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({
    name: "Welcome to your todolist"
});
const item2=new Item({
    name: "Hit the + button to add a new line"
});
const item3=new Item({
    name: "Hit this to delete an item"
});
const defaultItems=[item1,item2,item3];
const listSchema={
    name:String,
    items:[itemsSchema]
};
const List=mongoose.model("list",listSchema);
// await Item.create(item1);
// await Item.create(item2);
// await Item.create(item2);
app.get("/",async function(req,res){
    //  let day=date.getDate();
    const foundItems= await Item.find();
    if(foundItems.length===0)
    {
        await Item.insertMany(defaultItems);
        // foundItems= await Item.find();
        // res.render("list",{listTitle:"Today",NewListItems: foundItems});
        res.redirect("/");
    }
    else{
        res.render("list",{listTitle:"Today",NewListItems: foundItems});
    }
    
});
app.post("/",async function(req,res){
    const itemName =req.body.newItem;
    const listName=req.body.list;
    const item3=new Item({
        name: itemName
    });
    if(listName==="Today")
    {
        item3.save();
        res.redirect("/");
    }else{
        const foundList=await List.findOne({name:listName});
        foundList.items.push(item3);
        foundList.save();
        res.redirect("/" + listName);
    }
});

app.post("/delete",async function (req,res) {
    const checkedItemId= req.body.checkbox;
    const listName=req.body.listName;
    if(listName==="Today")
    {
        await Item.findByIdAndRemove(checkedItemId);
        res.redirect("/");
    }
    else{
        await List.findOneAndUpdate({name: listName},{$pull:{items:{_id:checkedItemId}}});
        res.redirect("/" +listName);
    }
    
});

app.get("/:customListName",async function(req,res){
    const customListName= _.capitalize(req.params.customListName);
    const foundList=await List.findOne({name:customListName});
    if(!foundList)
    {
        //Create a new list
        const list=new List({
            name:customListName,
            items:defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
    }
    else{
        //show an existing list
        res.render("list",{listTitle:foundList.name,NewListItems: foundList.items});
    }
});
}



// app.get("/work",function(req,res){
// res.render("list",{listTitle:"Work List",NewListItems:workItems})
// });
app.post("/work",function (req,res) {
    let item=req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});
app.listen(3000,function(){
    console.log("Server started on port 3000");
});