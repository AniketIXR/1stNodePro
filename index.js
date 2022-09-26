const fs=require('fs');
const http=require('http');
const url = require('url');
const replaceTemplate= require('./modules/replaceTemplate');
//////////////////////
//Files


//Blocking synchronous way
// const textIn=fs.readFileSync('./complete-node-bootcamp/1-node-farm/starter/txt/input.txt','utf-8');



// console.log(textIn);

// const textOut = `This is what we know about the avocardo: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./complete-node-bootcamp/1-node-farm/starter/txt/output.txt', textOut);
// console.log('File Written');

// //Non blocking asynchronous way

// fs.readFile('./complete-node-bootcamp/1-node-farm/starter/txt/start.txt','utf-8',(err,data1)=>{
   
//     // if(err) return console.log('Error !');
//     console.log(data1);

//     fs.readFile(`./complete-node-bootcamp/1-node-farm/starter/txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2);
//         fs.readFile('./complete-node-bootcamp/1-node-farm/starter/txt/append.txt','utf-8',(err,data3)=>{
//             console.log(data3);
            
//             fs.writeFile('./complete-node-bootcamp/1-node-farm/starter/txt/final.txt',`${data2}\n${data3}`,'utf-8',err=>{
//               console.log('Your file has been written :) ');
//             });
//         });
//     });
// });
// console.log('will read file');


/////////////////////////////////////////////
//Server

//The following commented part has been moved to the 
// module.js file in /1-node-farm/modules


// const replaceTemplate =(temp,product)=>{

//   //   this /somestuff/g is a regular expression here the g refers
//   // to global means it will change all the occurance of the term
//   // somestuff
//      let output=temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//      output = output.replace(/{%IMAGE%}/g,product.image);
//      output = output.replace(/{%PRICE%}/g,product.price);
//      output = output.replace(/{%FROM%}/g,product.from);
//      output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
//      output = output.replace(/{%QUANTITY%}/g,product.quantity);
//      output = output.replace(/{%DESCRIPTION%}/g,product.description);
//      output = output.replace(/{%ID%}/g,product.id);

//      if(!product.organic) 
//      output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');

//      return output;
//     }

//Here we are using the synchronous read because this part will only be 
//executed once

const tempOverview = fs.readFileSync('./starter/templates/template-overview.html','utf-8');
const tempCard= fs.readFileSync('./starter/templates/template-card.html','utf-8');
const tempProduct = fs.readFileSync('./starter/templates/template-product.html','utf-8');

const data = fs.readFileSync('./starter/dev-data/data.json','utf-8');

const dataObj= JSON.parse(data);

const server = http.createServer((req,res) => {
// const pathname=req.url;

  // console.log(req.url);
  
  const {query,pathname} = url.parse(req.url,true);


  //Overviw page
  if(pathname==='/' || pathname==='/overview')
  {
    res.writeHead(200, {
        'Content-type':'text/html'
    });

    const cardHtml = dataObj.map(el=> replaceTemplate(tempCard,el)).join('');
     //join('') cobines all the elements inthe cardHtml into a string
    
    const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardHtml);

     res.end(output);
  }
  //Product page
  else if(pathname==='/product')
  {
    console.log(query);
    const product=dataObj[query.id];
    const output=replaceTemplate(tempProduct, product);
     res.end(output);
  }

  //api
  else if(pathname==='/api')
  {
    
        // console.log(productData);
        //we need to tell the browser what data we are sending like here 
        //it is JSON
        // 200 is the status code , where 200 means ok 
        res.writeHead(200, {
            'Content-type':'application/json'
        });
        res.end(data);
    
    
  }

  //not found
  else
  {
    res.writeHead(404,{
        'Content-type': 'text/html' 
    });
    //the headers in writeHeaD after 404 is always done before the res.end
    res.end('<h1>Page not found!</h1>');
  }
    // res.end('Hello from the server!');

});


server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening to requests on port 8000')
});