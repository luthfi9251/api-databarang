require("dotenv").config();
const express = require("express");
const app = express();
const {excuteQuery} = require('./db');


const PORT = 4000


app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.get("/",(req,res)=>{
    res.send("hello world");
})

// Endpoint untuk mendapatkan data guru
app.get("/sma",async (req,res)=>{
        let result = await excuteQuery({
            query: "select * from guru",
        })
        res.send(result)
})

// Endpoint untuk menambah data guru
app.post("/sma",async (req,res)=>{
    let {nip, nama_guru, status, alamat,nomor} = req.body
    alamat = alamat || "semarang"
    nomor = nomor || "08135555"
    let query = `insert into guru values(?,?,?,?)`
    try{
        let result = await excuteQuery({
            query,
            values : [nip, nama_guru, status,alamat,nomor]
        })
    
        if(result.hasOwnProperty('error')){
            throw result.error.sqlMessage
        }
    
        res.send(result)
    }catch(error){
        res.send(error)
    }
    
})

// Endpoint untuk mengupdate data guru
app.post("/sma/update",async (req,res) => {
    let {nip, nama_guru, status, alamat} = req.body
    alamat = alamat || "semarang"

    try{
        let result = await excuteQuery({
            query: "update guru set nama_guru=?,status=?,alamat=? where nip=?",
            values: [nama_guru,status,alamat,nip]
        })

        res.send(result)
    }catch(err){
        console.log(err)
        res.send("error happened!")
    }
})

// Endpoint untuk menghapus data guru
app.get("/sma/delete", async (req,res) => {
    let nip = req.query.id

    if(!nip){
        res.send("Please send the ID")
        return
    }
    try{
        let result = await excuteQuery({
            query: "delete from guru where nip=?",
            values: [nip]
        })

        res.send(result)
    }catch(err){
        console.log(err)
        res.send("error happened!")
    }

})

//untuk mendapatkan dokumentasi api
app.get("/sma/desc", (req,res)=>{
    let data = {
        author: "luthfi",
        get: {
            detail: "Untuk mendapatkan seluruh data guru",
            path: "/sma",
            method: "GET",
            bodyField: "",
            example: "GET /sma"
        },
        insert : {
            detail: "Untuk menambah seluruh data guru",
            path: "/sma",
            method: "POST",
            bodyField: "nip, nama_guru, status, alamat",
            example: "POST /sma"
        },
        update : {
            detail: "Untuk mengupdate seluruh data guru",
            path: "/sma/update",
            method: "POST",
            bodyField: "nip, nama_guru, status, alamat",
            example: "POST /sma/update"
        },
        delete : {
            detail: "Untuk menghapus seluruh data guru",
            path: "/sma/delete",
            method: "GET",
            bodyField: "id",
            example: "GET /sma/delete?id=4"
        }
    }

    res.json(data)
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port : ${PORT}`)
})

module.exports = app