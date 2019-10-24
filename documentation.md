// prototype service setup 
services = (require("/service"));
for(var s in services){
    service = new s(jr,log);
}
module.export = service;