$(function(){
    var vCode='';
    $('.btn-register').on('tap',function(){
        var check =true;    
        mui(".mui-input-group input").each(function() {
            //若当前input为空，则alert提醒 
            if(!this.value || this.value.trim() == "") {
                var label = this.previousElementSibling;
                mui.alert(label.innerText + "不允许为空");
                check = false;
                //只是return当前函数 , 只是不用再继续遍历了, 在遍历后面的代码是会正常执行的
                return false;
            }
            }); //校验通过，继续执行业务逻辑 
            if(check){
                     var phone = $('.phone').val();
                    if(!(/^1[345789]\d{9}$/.test(phone))){ 
                        mui.alert("手机号码不合法!");
                        return false; 
                }
                var username = $('.username').val();
                if(username.length>10){
                    mui.alert("你的名字太长了,要小于10位");
                    return false;
                }
                var password1 = $('.password1').val();
                var password1 = $('.password1').val();
                if(password1!=password2){
                    mui.alert("两次密码不一致!");
                    return false;
                }
                var vcode=$('.vcode').val();
                if(vCode!=vcode){
                    mui.alert("验证码输入有误!");
                    return false;
                } 
                $.ajax({
                    url:'/user/register',
                    type:'post',
                    data:{username:username,password:password1,mobile:phone,vCode:vCode},
                    success:function(data){
                        if(data.success){
                            mui.toast("注册成功!");
                            location=href;
                        }else{
                            mui.toast(data.message);
                        }
                    }
                })

            }
    });
//    获取验证码功能
    $('.btn-get-vcode').on('tap',function(){
        $.ajax({
            url:'/user/vCode',
            success:function(data){
                console.log(data);
                vCode = mui.alert(data.vCode);
                // vCode = data.vCode;
            }
        })
    });
})