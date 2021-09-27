import mongoose from 'mongoose';
import props from './properties';
module.exports = function(){
    mongoose.connect(props.DB).then(()=>{
        console.log("Connection Established");
    }).catch(err=>{
        console.log(err);
    })
}