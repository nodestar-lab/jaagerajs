const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://127.0.0.1/test');
var conn = mongoose.connection;

class modalEntity {

    constructor(enty) {
        this.entity = enty;
        logger.info(`[e-${this.entity.collection_name}]`);
        this.collection_name = enty.collection_name;
        this.fields = enty.fields;
        this.schema = mongoose.Schema(this.fields);
        this.modal = conn.model(this.collection_name, this.schema);
        this.createIndexes(this.entity.indexFields)
    }

    // var User = conn.model('User', userSchema);
    createIndexes(indexes) {
        for (let inx of indexes) {
            this.modal.createIndexes({
                [inx.key]: inx.value
            })
        }
    }


    getInstanceofModel(data) {
        return new this.modal(data);
    }

    async save(data) {
        var inst = this.getInstanceofModel(data)
        // var isvalid = _vaidator(inst);
        return new Promise(function (resolve, reject) {
            inst.save().then(res => {
                resolve(res);
            }).catch(err => {
                console.log("error while saving data ", err);
                reject(err);
            });
        });
    }


    removeOne(query) {
        return this.modal.deleteOne(query).then(res => {
            console.log("delete one : ", query);
            return res;
        }).catch(err => {
            console.log("inside the deleteOne function ", err);
        });
    }

    removeMany(query) {
        return this.modal.deleteMany(query).then(res => {
            return res;
        }).catch(err => {
            console.log("inside the deleteMany function ", err);
        });
    }

    findOne(query) {
        return this.modal.findOne(query).then(res => {
            return res;
        }).catch(e => {
            console.log("error occur while finding one record")
        });
    }

    async findById(id) {
        return await this.modal.findById(id).then(res => {
            return res;
        }).catch(e => {
            logger.error("findById  ", e);
        })
    }

    find(query) {
        return this.modal.find(query).then(res => {
            return res;
        }).catch(e => {
            console.log("error occure while performing action ")
        });
    }

    findByIdAndUpdate(id, updateObj) {
        return this.modal.findByIdAndUpdate(id, update).then(res => {
            return res;
        }).catch(e => {
            logger.error("findbyIdandUpdate: ", e);
        })
    }

    async updateOne(query, obj) {
        return this.modal.updateOne(query, obj).then((res) => {
            return res;
        }).catch(e => {
            console.log("inside updateOne : ", e);
        })
    }


    aggregateQuery() {

    }

}

module.exports = modalEntity;