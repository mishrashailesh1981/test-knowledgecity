// endpoint end point
// params if data or null
// methods GET, PUT, POST 

function service(endpoint, params, method){

  


    return new Promise((resolve, reject) => {
        //asynchronous code goes here

        var ajaxCall= {
            url: baseUrl + endpoint,
            type: method,
            dataType: 'JSON',
            ContentType:"application/json",
            data:params == null?'':JSON.stringify(params),
            success: function(data) {
                if (data && data.status == 0)
                resolve(data)
                else
                reject(data.message)
            },
            error: function(err) {
                reject(err);
            },
        }
        
        if(token){
                ajaxCall.headers={
                    'Authorization':token
                }
        }



        $.ajax(ajaxCall);
      });
}