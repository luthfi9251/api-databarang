

const mysql = require('serverless-mysql')({
    config: {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    }
})

async function excuteQuery({ query, values }) {
    try{
        const results = await mysql.query(query, values);
        await mysql.end();
        return results;
    }catch(err){
        console.log(err)
        return "Error during query"
    }
    
  }

module.exports = {
    excuteQuery
}