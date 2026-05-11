document.getElementById('send-infor').addEventListener('click', () => {
    var name = document.getElementById('name');
    var tel = document.getElementById('tel');
    var telRegex = /^\d{10}$/;
    var email = document.getElementById('email');
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var check = true;

    if(name.value.length == 0) {
        check = false;
        name.parentNode.classList.add('error');
        name.parentNode.parentNode.querySelector('.mess-error').innerText = 'Vui lòng nhập họ tên';
    } else {
        name.parentNode.classList.remove('error');
        name.parentNode.parentNode.querySelector('.mess-error').innerText = '';
    }

    if(tel.value.length == 0) {
        check = false;
        tel.parentNode.classList.add('error');
        tel.parentNode.parentNode.querySelector('.mess-error').innerText = 'Vui lòng nhập số điện thoại';
    } else if(!telRegex.test(tel.value)){
        check = false;
        tel.parentNode.classList.add('error');
        tel.parentNode.parentNode.querySelector('.mess-error').innerText = 'Số điện thoại không hợp lệ';
    } else {
        tel.parentNode.classList.remove('error');
        tel.parentNode.parentNode.querySelector('.mess-error').innerText = '';
    }

    if(email.value.length == 0) {
        check = false;
        email.parentNode.classList.add('error');
        email.parentNode.parentNode.querySelector('.mess-error').innerText = 'Vui lòng nhập địa chỉ email';
    } else if(!emailRegex.test(email.value)){
        check = false;
        email.parentNode.classList.add('error');
        email.parentNode.parentNode.querySelector('.mess-error').innerText = 'Email không hợp lệ';
    } else {
        email.parentNode.classList.remove('error');
        email.parentNode.parentNode.querySelector('.mess-error').innerText = '';
    }


    if(check){
        location.reload();
        alert('Gửi thông tin thành công, chúng tôi sẽ liên hệ tới bạn sau!!!');
    }

})

document.getElementById('clear-infor').addEventListener('click', () => {
    var name = document.getElementById('name');
    var tel = document.getElementById('tel');
    var email = document.getElementById('email');

    name.parentNode.classList.remove('error');
    name.parentNode.parentNode.querySelector('.mess-error').innerText = '';

    tel.parentNode.classList.remove('error');
    tel.parentNode.parentNode.querySelector('.mess-error').innerText = '';
    
    email.parentNode.classList.remove('error');
    email.parentNode.parentNode.querySelector('.mess-error').innerText = '';
})