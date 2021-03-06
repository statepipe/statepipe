import utils from "./utils";
import handleTrigger from "./handleTrigger";

export default (blob) => {
    if (utils.validateState(blob)
    && blob.type === utils.TRIGGER_STORE 
    && utils.validateNode(blob.node)
    ){
        blob.reducers = blob.reducers.map(schema => {
            
          const actionAndHandler = schema.fn.split("@");
            const action = actionAndHandler[0];
            
            let eventHandler = actionAndHandler[1];

            if (utils.validateProp(action) && utils.validateProp(eventHandler)) {
          
              const matches = eventHandler
                .match(/^(documentElement|document|body|window)(\.)(.+)/);
          
              //test special cases
              if (matches
              && matches.length === 4 
              && utils.validateProp(matches[1])
              && utils.validateProp(matches[3])
              ){
                eventHandler = matches[3];
                let target;
                switch(matches[1]){
                  case "document":
                    target = document;
                  break;
                  case "documentElement":
                    target = document.documentElement;
                  break;
                  case "body":
                    target = document.body;
                  break;
                  case "window":
                    target = window;
                  break;
                }
                if (target && typeof target.addEventListener === "function"){
                  utils.log(`:statepipe ${blob.wrapper}: ${blob.type}/ ${blob.node.nodeName} (${schema.index}) bind ${matches[1]} "${eventHandler}" to action: ${action}`);
                  target.addEventListener(eventHandler, handleTrigger(blob, action));
                }
              }
              else {
                utils.log(`:statepipe ${blob.wrapper}: ${blob.type}/ ${blob.node.nodeName} (${schema.index}) bind "${eventHandler}" to action: ${action}`);
                blob.node.addEventListener(eventHandler, handleTrigger(blob, action));
              }
              return null;
            }
            return schema;
        })
        .filter(schema => schema);
    }
    return blob;
};
