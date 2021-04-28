

const base_url = 'https://fancy-todo-but-minimalis.herokuapp.com'

$('document').ready(()=>{
    checkLocalStorage()

    $('#btn-submit').on('click', (e)=>{
        e.preventDefault()
        login()
    })

    $('#btn-logout').on('click',()=>{
        //below for standard login
        logout()

        //below for google
        signOut()
    })

    $('#btn-add-Todo').on('click', (e)=>{
        e.preventDefault()
        $('#login-page').hide()
        $('#all-todos').hide()
        $('#form-add-todo').show()
    })

    $('.add-todo').on('click',(e)=>{
        e.preventDefault()
        addTodo()
    })

    $('.edit-todo').on('click', (e)=>{
        e.preventDefault()
        doEditTodo()
    })

    $('.cancel').on('click', (e)=>{
        e.preventDefault()
        checkLocalStorage()
    })

    $('#register').on('click', (e)=>{
        e.preventDefault()
        $('#login-page').hide()
        $('#all-todos').hide()
        $('#form-add-todo').hide()
        $('#form-edit-todo').hide()
        $('.api-card-container').hide()
        $('#form-register').show()
    })

    $('.register-new').on('click', (e)=>{
        e.preventDefault()
        doRegister()
    })

    $('.cancel-register').on('click', (e)=>{
        e.preventDefault()
        checkLocalStorage()
    })
})

function doRegister(){
    // console.log("register");
    $.ajax({
        url : base_url + "/register",
        method : "POST",
        data : {
            email : $('#register-email').val(),
            password : $('#register-password').val()
        }
    })
    .done((data)=>{
        console.log(data);
        checkLocalStorage()
    })
    .fail(err=>{
        // $('#form-register').show()
        console.log(err.responseText);
    })
    .always(()=>{
        $('#register-email').val(''),
        $('#register-password').val('')
    })
    
}

function onSignIn(googleUser) {
    console.log(googleUser.getAuthResponse().id_token);

    $.ajax({
        url : base_url + '/loginGoogle',
        method : 'POST',
        data : {
            googleToken : googleUser.getAuthResponse().id_token
        }
    })
    .done(response=>{
        console.log(response,'<<<<<<<<<<<<<<<');
        localStorage.setItem('access_token', response.access_token)
        checkLocalStorage()
    })
    .fail(err=>{
        console.log(err);
    })

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }



function login(){
    const email = $('#email').val()
    const password = $('#password').val()

    console.log(email, password);

    $.ajax({
        url : base_url+"/login",
        method : "POST",
        data : {
            email : email,
            password : password
        }
    })
    .done(response=>{
        // di save di localstorage
        // param pertama localStorage itu adalah key yg akan dibuat di localStorage
        console.log(response);
        localStorage.setItem("access_token",response.access_token)
        checkLocalStorage()
    })
    .fail(err=>{
        console.log(err.responseText);
    })
    .always(()=>{
        $('#email').val("")
        $('#password').val("")
    })

}

function checkLocalStorage(){
    if(localStorage.access_token){
        $('#login-page').hide()
        $('#all-todos').show()
        $('#form-add-todo').hide()
        $('#form-edit-todo').hide()
        $('.api-card-container').hide()
        $('#form-register').hide()
        fetchTodos()
    }
    else{
        $('#login-page').show()
        $('#all-todos').hide()
        $('#form-add-todo').hide()
        $('#form-edit-todo').hide()
        $('.api-card-container').hide()
        $('#form-register').hide()
    }
}

function logout(){
    localStorage.removeItem('access_token')
    checkLocalStorage()
}

function fetchTodos(){
    $('#todos').empty()
    
    $.ajax({
        url : base_url+"/todos",
        method : "GET",
        headers : {
            access_token : localStorage.access_token
        }
    })
    .done(response=>{
        console.log(response);
        if(response.length === 0 ){
            console.log("no data");
            $('#no-todos').empty()
            $('#no-todos').append(
                `          
                <img class="shrug-image" src="https://i.dlpng.com/static/png/7166501_preview.png" alt="shrug image">
                <h1>You currently have no Todo yet, start adding by clicking add Todo button on the top left side.</h1>
                
                `
            )
        }
        else {
            $('#no-todos').empty()
            response.forEach(element => {
                
                $('#todos').append(
                `
                  <div class="card-grid-space">
                    <a class="card"
                      style="--bg-img: url(https://us.123rf.com/450wm/fastfun23/fastfun231602/fastfun23160200214/52521007-luxury-background-blur-bokeh-black-background.jpg?ver=6)">
                      <div>
                        <h1>${element.title}</h1>
                        <p>${element.description}</p>
                        <p id="status-${element.id}">Status : ${element.status ? "finished" : "unfinished" }</p>
                        <div class="date">Due Date ${(element.due_date).split('T')[0]}</div>
                        <div class="tags">
                          <button onclick="finishStatus(${element.id})"  class="tag">Set Status</button>
                        </div>
                          <button onclick="deleteTodo(${element.id})">Delete</button>
                          <button onclick="showEditTodo(${element.id})">Edit Todo</button>
                        </div>
                    </a>
                  </div>
                `)
            });
        }

    })
    .fail(err=>{
        console.log(err);
    })
}

function deleteTodo(id){
    console.log(id);
    $.ajax({
        url : base_url+`/todos/${id}`,
        method : "delete",
        headers : {
            access_token : localStorage.access_token
        }
    })
    .done(()=>{
        fetchTodos()
    })
    .fail(err=>{
        console.log(err);
    })
}

function addTodo(){
    
    $.ajax({
        url : base_url+'/todos',
        method : "POST",
        headers : {
            access_token : localStorage.access_token
        },
        data : {
            title : $('#input-title').val(),
            description : $('#input-description').val(),
            due_date : $('#input-due_date').val()
        }
    })
    .done((response)=>{
        console.log(response.data, response.dataApiCurrency);
        console.log(response.dataApiCurrency.base_currency, response.dataApiCurrency.rate_IDR, response.dataApiCurrency.time_updated);
        // checkLocalStorage()
        
        $('#base-currency').text(`Base Currency : ${response.dataApiCurrency.base_currency}`)
        $('#rate-IDR').text(`IDR Rate : ${response.dataApiCurrency.rate_IDR}`)
        $('#time-updated').text(`Time Updated : ${response.dataApiCurrency.time_updated}`)
        
        $('#form-edit-todo').hide()
        $('#login-page').hide()
        $('#all-todos').hide()
        $('#form-add-todo').hide()
        $('.api-card-container').show()


    })
    .fail(err=>{
        console.log(err);
    })
    .always(()=>{
        $('#input-title').val(''),
        $('#input-description').val(''),
        $('#input-due_date').val('')
    })
}


function showEditTodo(id){
    $.ajax({
        //GET /todos/:id
        url : base_url + "/todos/" +id,
        method : "GET",
        headers : {
            access_token : localStorage.access_token
        }
    })
    .done(response=>{
        $('#edit-title').val(response.title)
        $('#edit-description').val(response.description)
        $('#edit-due_date').val((response.due_date).split('T')[0])
        //kirim idnya todo pake dummy id
        $('#edit-id').val(id)
        console.log(response.title,response.description, (response.due_date).split('T')[0]);
        $('#form-edit-todo').show()
        $('#login-page').hide()
        $('#all-todos').hide()
        $('#form-add-todo').hide()
    })
    .fail(err=>{
        console.log(err);
    })
}

function doEditTodo(){
    const id = $('#edit-id').val();
    $.ajax({
        url : base_url + "/todos/" + id,
        method : "PUT",
        headers : {
            access_token : localStorage.access_token
        },
        data : {
            title : $('#edit-title').val(),
            description :  $('#edit-description').val(),
            due_date : $('#edit-due_date').val()
        }
    })
    .done(()=>{
        checkLocalStorage()
    })
    .fail(err=>{
        console.log(err);
    })
}

function finishStatus(id){
    
    console.log($(`#status-${id}`).text(), 'di mainjs');
    if($(`#status-${id}`).text() === 'Status : finished'){
        
        $.ajax({
            url : base_url + "/todos/" + id,
            method : "PATCH",
            headers : {
                access_token : localStorage.access_token
            },
            data : {
                status : false
            }
        })
        .done(()=>{
            
            checkLocalStorage()
        })
        .fail(err=>{
            console.log(err);
        })
    }
    else{
        
        $.ajax({
            url : base_url + "/todos/" + id,
            method : "PATCH",
            headers : {
                access_token : localStorage.access_token
            },
            data : {
                status : true
            }
        })
        .done(()=>{
            checkLocalStorage()
        })
        .fail(err=>{
            console.log(err);
        })

    }
}