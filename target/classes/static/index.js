//Список ролей
function listRoles(user) {
    let rolesList = document.createElement('ul');

    for (let i = 0; i < user.roles.length; i++) {
        let role = document.createElement('li');
        role.textContent = user.roles[i].authority + " ";
        rolesList.appendChild(role);
    }

    return rolesList;
}

//Статусбар пользователя
showHeader();

function showHeader() {
    fetch('http://localhost:8080/api/user')
        .then(response => response.json())
        .then(user => {

            document.getElementById("header_email").innerHTML = user.username;

            let rolesList = document.createElement('ul');
            for (let i = 0; i < user.roles.length; i++) {
                let role = document.createElement('li');
                role.textContent = user.roles[i].authority + " ";
                rolesList.appendChild(role);
            }
            document.getElementById("header_roles").innerHTML = 'with roles: ' + rolesList.textContent;
        });
}
//Инфа пользователя
showUserInfo();

function showUserInfo(user) {
    fetch('http://localhost:8080/api/user')
        .then(response => response.json())
        .then(user => {
            let tBody = document.getElementById("user_info");
            tBody.innerHTML = "";

            var row = tBody.insertRow(0);
            var cell0 = row.insertCell(0);
            cell0.innerHTML = user.id;
            var cell1 = row.insertCell(1);
            cell1.innerHTML = user.username;
            var cell2 = row.insertCell(2);
            cell2.innerHTML = user.password;
            var cell3 = row.insertCell(3);
            cell3.innerHTML = user.email;
            var cell4 = row.insertCell(4);
            cell4.innerHTML = listRoles(user).textContent;
        });

}

//Список всех пользователей
showAllUsers();

function showAllUsers() {
    let tBody = document.getElementById("tBody");
    tBody.innerHTML = "";
    fetch('http://localhost:8080/api/users')
        .then(response => response.json())
        .then(users => {
            users.forEach(function (user) {
                var row = tBody.insertRow();
                row.setAttribute("id", user.id);
                var cell0 = row.insertCell();
                cell0.innerHTML = user.id;
                var cell1 = row.insertCell();
                cell1.innerHTML = user.username;
                var cell2 = row.insertCell();
                cell2.innerHTML = user.password;
                var cell3 = row.insertCell();
                cell3.innerHTML = user.email;
                var cell4 = row.insertCell();
                cell4.innerHTML = listRoles(user).textContent;

                var cell5 = row.insertCell();
                cell5.innerHTML =
                    '<button type="button" onclick="getModalEdit(' + user.id + ')" class="btn btn-primary btn-sm">Edit</button>';

                var cell6 = row.insertCell();
                cell6.innerHTML =
                    '<button type="button" onclick="getModalDelete(' + user.id + ')" class="btn btn-danger btn-sm">Delete</button>';
            })
        });
}

//новый пользователь
function newUser() {
    let form = window.formNewUser.newRoles;
    let new_Roles = [];
    let rolesList = document.createElement('ul');

    for (var i = 0; i < form.length; i++) {
        var option = form.options[i];
        let roleJS = {};
        let role = document.createElement('li');
        if (option.selected) {
            if(option.value == "ADMIN") {
                roleJS = {id: 1, role_name: "ADMIN"};
            } else {
                roleJS = {id: 2, role_name: "USER"};
            }
            new_Roles.push(roleJS);
            role.textContent = option.value + " ";
            rolesList.appendChild(role);
        }
    }

    fetch('http://localhost:8080/api/users', {
        method: 'POST',
        body: JSON.stringify({
            username: window.formNewUser.newUsername.value,
            email: window.formNewUser.newEmail.value,
            password: window.formNewUser.newPassword.value,
            roles: new_Roles
        }),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
        .then(response => response.json())
        .then(user => {
            $('#tBody tr:last').after('<tr id=' + user.id + '>' +
                '<td>' + user.id + '</td>' +
                '<td>' + window.formNewUser.newUsername.value + '</td>' +
                '<td>' + window.formNewUser.newPassword.value + '</td>' +
                '<td>' + window.formNewUser.newEmail.value + '</td>' +
                '<td>' + rolesList.textContent + '</td>' +
                '<td> <button type="button" onclick="getModalEdit(' + user.id + ')" class="btn btn-primary btn-sm">Edit</button> </td>' +
                '<td> <button type="button" onclick="getModalDelete(' + user.id + ')" class="btn btn-danger btn-sm">Delete</button> </td>' +
                '</tr>');

            window.formNewUser.newUsername.value = "";
            window.formNewUser.newEmail.value = "";
            window.formNewUser.newPassword.value = "";
            window.formNewUser.newRoles.value = "";

            $('#NewUserCreated').modal();
        });
}

//edit модалка
function getModalEdit(id) {

    fetch('http://localhost:8080/api/users/' + id)
        .then(response => response.json())
        .then(user => {

            let adminSelect = "";
            let userSelect = "";

            for (let i = 0; i < user.roles.length; i++) {
                if (user.roles[i].roleName == "ADMIN") {
                    adminSelect = "selected";
                }
                if (user.roles[i].roleName == "USER") {
                    userSelect = "selected";
                }
            }

            let modal = document.getElementById('modalWindow');

            modal.innerHTML =
                '<div id="modalEdit"' +
                '     class="modal fade" tabindex="-1" role="dialog"' +
                '     aria-labelledby="TitleModalLabel" aria-hidden="true"' +
                '     data-backdrop="static" data-keyboard="false">' +
                '    <div class="modal-dialog modal-dialog-scrollable">' +
                '        <div class="modal-content">' +
                '            <div class="modal-header">' +
                '                <h5 class="modal-title" id="TitleModalLabel">Edit user</h5>' +
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '                    <span aria-hidden="true">&times;</span>' +
                '                </button>' +
                '            </div>' +
                '            <div class="modal-body bg-white">' +
                '                <form id="formEditUser" style="width: 200px;"' +
                '                       class="form-signin mx-auto font-weight-bold text-center">' +
                '                    <p>' +
                '                        <label>ID</label>' +
                '                        <input class="form-control form-control-sm" type="text"' +
                '                               id="editID" name="id" value="' + user.id + '" readonly>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Username</label>' +
                '                        <input class="form-control form-control-sm" type="text"' +
                '                               id="editUsername" value="' + user.username + '"' +
                '                               placeholder="First name" required>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Email</label>' +
                '                        <input class="form-control form-control-sm" type="email"' +
                '                               id="editEmail" value="' + user.email + '"' +
                '                               placeholder="Email" required>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Password</label>' +
                '                        <input class="form-control form-control-sm" type="text"' +
                '                               id="editPassword" value="' + user.password + '"' +
                '                               placeholder="Password" required>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Role</label>' +
                '                        <select id="editRoles" name="roles" multiple size="2" required ' +
                '                               class="form-control form-control-sm">' +
                '                            <option value="ADMIN"' + adminSelect + '>ADMIN</option>' +
                '                            <option value="USER"' + userSelect + '>USER</option>' +
                '                        </select>' +
                '                    </p>' +
                '                </form>' +
                '            </div>' +
                '            <div class="modal-footer">' +
                '                <button type="button" class="btn btn-secondary"' +
                '                        data-dismiss="modal">Close</button>' +
                '                <button class="btn btn-primary" data-dismiss="modal"' +
                '                        onclick="editUser()">Edit</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>';

            $("#modalEdit").modal();

        });
}

//delete модалка
function getModalDelete(id) {

    fetch('http://localhost:8080/api/users/' + id)
        .then(response => response.json())
        .then(user => {

            let adminSelect = "";
            let userSelect = "";

            for (let i = 0; i < user.roles.length; i++) {
                if (user.roles[i].roleName == "ADMIN") {
                    adminSelect = "selected";
                }
                if (user.roles[i].roleName == "USER") {
                    userSelect = "selected";
                }
            }

            let modal = document.getElementById('modalWindow');

            modal.innerHTML =
                '<div id="modalDelete" ' +
                '     class="modal fade" tabindex="-1" role="dialog"' +
                '     aria-labelledby="TitleModalLabel" aria-hidden="true" ' +
                '     data-backdrop="static" data-keyboard="false">' +
                '    <div class="modal-dialog modal-dialog-scrollable">' +
                '        <div class="modal-content">' +
                '            <div class="modal-header">' +
                '                <h5 class="modal-title" id="TitleModalLabel">Delete user</h5>' +
                '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '                    <span aria-hidden="true">&times;</span>' +
                '                </button>' +
                '            </div>' +
                '            <div class="modal-body bg-white">' +
                '                <form id="formEditUser" style="width: 200px;" ' +
                '                       class="form-signin mx-auto font-weight-bold text-center">' +
                '                    <p>' +
                '                        <label>ID</label>' +
                '                        <input class="form-control form-control-sm" type="text"' +
                '                               name="id" value="' + user.id + '" readonly>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Username</label>' +
                '                        <input class="form-control form-control-sm" type="text"' +
                '                               value="' + user.username + '" readonly>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Email</label>' +
                '                        <input class="form-control form-control-sm" type="email"' +
                '                               value="' + user.email + '" readonly>' +
                '                    </p>' +
                '                    <p>' +
                '                        <label>Role</label>' +
                '                        <select class="form-control form-control-sm" multiple size="2" readonly>' +
                '                            <option value="ADMIN"' + adminSelect + ' >ADMIN</option>' +
                '                            <option value="USER"' + userSelect + '>USER</option>' +
                '                        </select>' +
                '                    </p>' +
                '                </form>' +
                '            </div>' +
                '            <div class="modal-footer">' +
                '                <button type="button" class="btn btn-secondary"' +
                '                        data-dismiss="modal">Close</button>' +
                '                <button class="btn btn-danger" data-dismiss="modal"' +
                '                        onclick="deleteUser(' + user.id + ')">Delete</button>' +
                '            </div>' +
                '        </div>' +
                '    </div>' +
                '</div>';

            $("#modalDelete").modal();

        });
}

//редактирование пользователя
function editUser() {

    let form = window.formEditUser.editRoles;
    let new_Roles = [];

    let rolesList = document.createElement('ul');

    for (var i = 0; i < form.length; i++) {
        var option = form.options[i];
        let role = document.createElement('li');
        let roleJS = {};
        if (option.selected) {
            if(option.value == "ADMIN") {
                roleJS = {id: 1, role_name: "ADMIN"};
            } else {
                roleJS = {id: 2, role_name: "USER"};
            }
            role.textContent = option.value + " ";
            rolesList.appendChild(role);
            new_Roles.push(roleJS);
        }
    }
    let id = window.formEditUser.editID.value;

    fetch('http://localhost:8080/api/users', {
        method: 'PUT',
        body: JSON.stringify({
            id: window.formEditUser.editID.value,
            username: window.formEditUser.editUsername.value,
            email: window.formEditUser.editEmail.value,
            password: window.formEditUser.editPassword.value,
            roles: new_Roles
        }),
        headers: {"Content-type": "application/json;"}
    })
        .then(response => {
            $('#' + id).replaceWith('<tr id=' + id + '>' +
                '<td>' + id + '</td>' +
                '<td>' + window.formEditUser.editUsername.value + '</td>' +
                '<td>' + window.formEditUser.editPassword.value + '</td>' +
                '<td>' + window.formEditUser.editEmail.value + '</td>' +
                '<td>' + rolesList.textContent + '</td>' +
                '<td> <button type="button" onclick="getModalEdit(' + id + ')" class="btn btn-primary btn-sm">Edit</button> </td>' +
                '<td> <button type="button" onclick="getModalDelete(' + id + ')" class="btn btn-danger btn-sm">Delete</button> </td>' +
                '</tr>');
        });
}

//удаление пользователя
function deleteUser(id) {
    fetch('http://localhost:8080/api/users/' + id, {
        method: 'DELETE',
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
        .then(response => {
            $('#' + id).remove();
        });
}
