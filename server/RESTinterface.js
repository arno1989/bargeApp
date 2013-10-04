if (Meteor.isServer) {
  Meteor.startup(function () {

    // All values listed below are default
    collectionApi = new CollectionAPI({
      authToken: '9900aa',              // Require this string to be passed in on each request
      apiPath: 'collectionapi',          // API path prefix
      standAlone: false,                 // Run as a stand-alone HTTP(S) server
      sslEnabled: false,                 // Disable/Enable SSL (stand-alone only)
      listenPort: 3005,                  // Port to listen to (stand-alone only)
      listenHost: undefined,             // Host to bind to (stand-alone only)
      privateKeyFile: 'privatekey.pem',  // SSL private key file (only used if SSL is enabled)
      certificateFile: 'certificate.pem' // SSL certificate key file (only used if SSL is enabled)
    });

    // Add the collection bargeUsers to the API path
    collectionApi.addCollection(bargeUsers, 'bargeusers', {
      // All values listed below are default
      authToken: undefined,                   // Require this string to be passed in on each request
      methods: ['POST','GET','PUT','DELETE'],  // Allow creating, reading, updating, and deleting
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection. If the function returns false the action will be canceled, if you return true the action will take place.
        POST: undefined,  // function(obj) {return true/false;},
        GET: undefined,  // function(collectionID, objs) {return true/false;},
        PUT: undefined,  //function(collectionID, obj, newValues) {return true/false;},
        DELETE: undefined,  //function(collectionID, obj) {return true/false;}
      }
    });

    // Add the collection onlineBargeUsers to the API path
    collectionApi.addCollection(onlineBargeUsers, 'onlinebargeusers', {
      // All values listed below are default
      authToken: undefined,                   // Require this string to be passed in on each request
      methods: ['POST','GET','PUT','DELETE'],  // Allow creating, reading, updating, and deleting
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection. If the function returns false the action will be canceled, if you return true the action will take place.
        POST: undefined,  // function(obj) {return true/false;},
        GET: undefined,  // function(collectionID, objs) {return true/false;},
        PUT: undefined,  //function(collectionID, obj, newValues) {return true/false;},
        DELETE: undefined,  //function(collectionID, obj) {return true/false;}
      }
    });

    // Add the collection callInformation to the API path
    collectionApi.addCollection(callCollection, 'calls', {
      // All values listed below are default
      authToken: undefined,                   // Require this string to be passed in on each request
      methods: ['POST','GET','PUT','DELETE'],  // Allow creating, reading, updating, and deleting
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection. If the function returns false the action will be canceled, if you return true the action will take place.
        POST: function(obj) {
          var operator = obj.operator;
          if(operator) {
            console.log('Operator: ' + operator + ' is inserting calls');
            // Remove all existing calls of the operator in the collection
            callCollection.remove({callowner: operator});
            // Check for calls
            if(obj.calls.length) {
              console.log('TOTAL CALLS: ' + obj.calls.length);
              // Insert all individual calls into the collection
              for(var i=0;i<obj.calls.length;i++) {
                callCollection.insert(obj.calls[i]);
                // If the call does not exists insert into the activityCollection
                if(activityCollection.find({callreference: obj.calls[i].callreference}).count() == 0) {
                  console.log('activity-call does not existst and is not edited, INSERT');
                  activityCollection.insert(obj.calls[i]);
                  // add done field
                  activityCollection.update({callreference: obj.calls[i].callreference},{$set: {"done": false}});
                } else if(activityCollection.find({callreference: obj.calls[i].callreference, done: false}).count() > 0) {
                  // If the call does exists and is not edited
                  console.log('activity-call does existst and is not edited, UPDATE');
                  // Remove the old object
                  activityCollection.remove({callreference: obj.calls[i].callreference});
                  // insert the new object
                  activityCollection.insert(obj.calls[i]);
                  // add done field
                  activityCollection.update({callreference: obj.calls[i].callreference},{$set: {"done": false}});
                }
              }
            }
          }
          // Dont return true; Otherwise it will insert the the full batch in addition.
          return false;
        },
        GET: undefined,  // function(collectionID, objs) {return true/false;},
        PUT: undefined,  //function(collectionID, obj, newValues) {return true/false;},
        DELETE: undefined,  //function(collectionID, obj) {return true/false;}
      }
    });

  // Add the collection locationsCollection to the API path
    collectionApi.addCollection(locationsCollection, 'locations', {
      // All values listed below are default
      authToken: undefined,                   // Require this string to be passed in on each request
      methods: ['POST','GET','PUT','DELETE'],  // Allow creating, reading, updating, and deleting
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection. If the function returns false the action will be canceled, if you return true the action will take place.
        POST: function(obj) {
          console.log('INSERTION INTO locationsCollection!');
          // Remove all terminals in the collection
          locationsCollection.remove({});
          // Insert all individual calls into the collection
          console.log(obj.length);
          for(var i=0;i<obj.length;i++) {
            locationsCollection.insert(obj[i]);
          }
          // Dont return true; Otherwise it will insert the the full batch in addition.
          return false;
          //return true;
        },
        GET: undefined,  // function(collectionID, objs) {return true/false;},
        PUT: undefined,  //function(collectionID, obj, newValues) {return true/false;},
        DELETE: undefined,  //function(collectionID, obj) {return true/false;}
      }
    });

    // Add the collection activity to the API path
    collectionApi.addCollection(activityCollection, 'activitylog', {
      // All values listed below are default
      authToken: undefined,                   // Require this string to be passed in on each request
      methods: ['POST','GET','PUT','DELETE'],  // Allow creating, reading, updating, and deleting
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection. If the function returns false the action will be canceled, if you return true the action will take place.
        POST: undefined,  // function(obj) {return true/false;},
        GET: undefined,  // function(collectionID, objs) {return true/false;},
        PUT: undefined,  //function(collectionID, obj, newValues) {return true/false;},
        DELETE: undefined,  //function(collectionID, obj) {return true/false;}
      }
    });

    // Add the collection ChatCollection to the API path
    collectionApi.addCollection(chatCollection, 'chat', {
      // All values listed below are default
      authToken: undefined,                   // Require this string to be passed in on each request
      methods: ['POST','GET','PUT','DELETE'],  // Allow creating, reading, updating, and deleting
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection. If the function returns false the action will be canceled, if you return true the action will take place.
        POST: undefined,  // function(obj) {return true/false;},
        GET: undefined,  // function(collectionID, objs) {return true/false;},
        PUT: undefined,  //function(collectionID, obj, newValues) {return true/false;},
        DELETE: undefined,  //function(collectionID, obj) {return true/false;}
      }
    });

    // Add the Positionlog collection to the API path
    collectionApi.addCollection(positionLog, 'positionlog', {
      // All values listed below are default
      authToken: undefined,                   // Require this string to be passed in on each request
      methods: ['POST','GET','PUT','DELETE'],  // Allow creating, reading, updating, and deleting
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection. If the function returns false the action will be canceled, if you return true the action will take place.
        POST: undefined,  // function(obj) {return true/false;},
        GET: undefined,  // function(collectionID, objs) {return true/false;},
        PUT: undefined,  //function(collectionID, obj, newValues) {return true/false;},
        DELETE: undefined,  //function(collectionID, obj) {return true/false;}
      }
    });

    // Add the featureCollection to the API path
    collectionApi.addCollection(featureCollection, 'features', {
      // All values listed below are default
      authToken: undefined,                   // Require this string to be passed in on each request
      methods: ['POST','GET','PUT','DELETE'],  // Allow creating, reading, updating, and deleting
      before: {  // This methods, if defined, will be called before the POST/GET/PUT/DELETE actions are performed on the collection. If the function returns false the action will be canceled, if you return true the action will take place.
        POST: undefined,  // function(obj) {return true/false;},
        GET: undefined,  // function(collectionID, objs) {return true/false;},
        PUT: undefined,  //function(collectionID, obj, newValues) {return true/false;},
        DELETE: undefined,  //function(collectionID, obj) {return true/false;}
      }
    });

    // Starts the API server
    collectionApi.start();
  });
}