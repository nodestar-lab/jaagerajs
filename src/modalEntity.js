const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1/test');
var conn = mongoose.connection;

class modalEntity{

    constructor(enty){
        this.entity = enty;
        console.log("entity is setup for : ",this.entity);
        this.collection_name = enty.collection_name;
        this.fields = enty.fields;
        this.schema = mongoose.Schema(this.fields);
        this.modal = conn.model(this.collection_name,this.schema);
    }

    // var User = conn.model('User', userSchema);

    getInstanceofModel(data){
        return new this.modal(data);
    }

    save(data){
        var inst = this.getInstanceofModel(data)
        // var isvalid = _vaidator(inst);
        inst.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("saved successfully");
            }
        });
    }

    delete(){

    }

    findOne(){

    }

    findMany(){

    }

    aggregateQuery(){

    }

}

module.exports = modalEntity;