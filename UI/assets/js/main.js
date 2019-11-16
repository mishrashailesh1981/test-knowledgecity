//define api Base url
var baseUrl = "https://www.xyz.com/restapi/api/";
var token=undefined;

// Get all users
// Authorize token required
function getUsers(pageNumber) {
	// checking localstorage to validate api with userdetais and token
    if (localStorage.getItem('userData') != null) {
        var userDetail = JSON.parse(localStorage.getItem('userData'));
        token= userDetail.jwt;
        var endPoint = "users?page="+pageNumber;
       
        service(endPoint, null, 'GET').then(function( data) {
			
            // called when api gets success
            paging(data);
			// clearing old user list data
            $("#usersArray").empty();
			
			// creating new users data
            $.each(data.Response, function(index, items) {

                var li = "<li><div class='row user-row'><div class='col-md-2 col-sm-2 col-xs-2 text-right'>" +
                    "<i class='fa fa-check-circle userchecked' aria-hidden='true'></i>" +
                    "</div>" +
                    "<div class='col-md-6 col-sm-6 col-xs-6'>" +
                    "    <p class='user-name'>" + items.firstname + items.lastname+ "</p>" +
                    "    <p class='user-data'>" + items.firstname + " " + items.lastname + "</p>" +
                    "</div>" +
                    "<div class='col-md-4 col-sm-4 col-xs-4'>" +
                    "        <i class='fa fa-ellipsis-h more-detail' aria-hidden='true'></i>" +
                    "        <p class='mb-0'>" + items.email + "</p>" +
                    "</div>" +
                    "</div>" +
                    " </li>";

				// Append each user in list
                $("#usersArray").append(li);
            });
        },function(err){
            // if token expired or any issue in response
            if (err) {
                if (err.status === 401) {
                    alert(err.statusText)
                }
                location.href = "login.html";
                return false;
            }
        })
    } else {
        location.href = "login.html";
    }
}





// Login for user  
function Login() {

    token=undefined;
    var param = {
        email: $('#name').val(),
        password: $('#password').val()
    };
	
	 // Login Api 
     service('auth', param, 'POST').then(function(data) { // login success
            rememberMe(param);
            saveData(data);
            location.href = "usersList.html";
    },function(err){
        clear();
        if (err) {
            $("#errorMessage").empty();
            $("#errorMessage").append(err.responseJSON.message)
        } else {
           location.href = "login.html";
        }
    });
}

function saveData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
}

function clear() {
    localStorage.removeItem('userData');
}

function rememberMe(param){
	
 if ($('#rememberMe').is(':checked')) {
			// save username and password
			localStorage.username = param.email;
			localStorage.password = param.password;
			localStorage.checkbox = $('#rememberMe').val();
		} else {
			localStorage.username = '';
			localStorage.password = '';
			localStorage.checkbox = '';
		}	
	
}

function initFileds(){
    if (localStorage.checkbox && localStorage.checkbox != '') {
        $('#rememberMe').attr('checked', 'checked');
        $('#name').val(localStorage.username);
        $('#password').val(localStorage.password);
    } else {
        $('#rememberMe').removeAttr('checked');
        $('#name').val('');
        $('#password').val('');
    }
}

// paging for user list
function paging(data) {
    $("#footerlist").empty();

    var li = "";

    for (index = 0; index < data.Pagecount; index++) {
        var isActive = data.startpage-1 == index ? 'active' : '';

        if (isActive != "") {
            li = li + "<li><a href='#' class=" + isActive + ">" + Number(index + 1) + "</a></li>";
        } else {
            li = li + "<li><a href='#' onClick='getUsers(" + Number(index + 1)+ ")'>" + Number(index + 1) + "</a></li>";
        }

    }
    if (data.startpage < data.Pagecount - 1) {
        li = li + "<li><a href='#' onClick='getUsers(" + Number(data.startpage + 1) + ")'>Next <i class='fa fa-angle-double-right' aria-hidden='true'></i></a></li>";
    } else {
        li = li + "<li><a href='#' >Next <i class='fa fa-angle-double-right' aria-hidden='true'></i></a></li>";
    }

    $("#footerlist").append(li);

}

function logout() {

    if (localStorage.getItem('userData') != null) {
        var userDetail = JSON.parse(localStorage.getItem('userData'));
        token: userDetail.tokenid
        var param = {
            "userid":userDetail.id
        };
        service('logout', param, 'GET').then(function( data) {
                clear();
                location.href = "login.html";
        },function (err){
            clear();
            location.href = "login.html";
        });

    }
}

