//收藏功能
function collection(c) {
    var message_id = $(c).next().val();
    var user_id = $(c).next().next().val();
    var add=1;
    var status = $(c).html();
    var yan = $(c).next().css("color");
    if(user_id==0){
        //用户未登录
        popup({type:'error',msg:"收藏失败，请先登陆！",delay:2000,bg:true,clickDomCancel:true});
    }else{
        //用户已登录
        if($(c).css("color") != yan) {
            add = 0;
            $(c).css("color",yan);
            $(c).html("收藏");
        }
        else {
            $(c).css("color", "coral");
            $(c).html("已收藏");
        }
        $.ajax({
            type : "POST",  //请求方式
            url : "collectionAction",  //请求路径
            data : {
                'message_id' : message_id,
                'user_id' : user_id,
                'add' : add
            },
            async:true,
            success : function(data) {  //异步请求成功执行的回调函数

            },//ajax引擎一般用不到；状态信息；抛出的异常信息
            error : function() {
                alert("失败了")
            }
        });
    }
};
function deleteComment(c,that) {
    $.ajax({
        type : "POST",  //请求方式
        url : "deletecommentAction",  //请求路径
        data : {
            commentid:c
        },
        async:true,
        success : function(data) {  //异步请求成功执行的回调函数
            popup({type:'success',msg:"删除评论成功",delay:1000,callBack:function(){;}});
            $(that).parent().parent().slideUp();
            var h=$(that).parent().parent().parent().prev().children().eq(2).children().eq(0).html();
            var j="评价" + (parseInt(h.substring(2)) - 1);
            $(that).parent().parent().parent().prev().children().eq(2).children().eq(0).html(j);
            $(that).parent().parent().remove();
        },//ajax引擎一般用不到；状态信息；抛出的异常信息
        error : function() {
            popup({type:'error',msg:"删除评论失败！",delay:2000,bg:true,clickDomCancel:true});
        }

    });
}
//点赞功能
function agree(c) {
    var message_id = $(c).next().val();
    var user_id = $(c).next().next().val();
    var add = 1;
    var number = $(c).html();
    var yan = $(c).next().css("color");
    if(user_id==0){
        //用户还没有登录
        popup({type:'error',msg:"点赞失败，请先登陆！",delay:2000,bg:true,clickDomCancel:true});
    }else{
        if ($(c).css("color") != yan) {
            add = 0;
            $(c).css("color", yan);
            $(c).html((parseInt(number) - 1));
        }
        else {
            $(c).css("color", "coral");
            $(c).html((parseInt(number) + 1));
        }

        $.ajax({
            type: "POST",  //请求方式
            url: "agreeAction",  //请求路径
            data: {
                'message_id': message_id,
                'user_id': user_id,
                'add': add
            },
            async: true,
            success: function (data) {  //异步请求成功执行的回调函数

            },//ajax引擎一般用不到；状态信息；抛出的异常信息
            error: function () {
                popup({type:'error',msg:"点赞失败了！",delay:2000,bg:true,clickDomCancel:true});
            }
        });
    }
}

// 评价功能
function comment(c) {
    var parentdiv=$(c).parent().parent();
    var messageid=$(c).next().val();
    commentdiv=parentdiv.next();
    commentdiv.slideToggle();
    var messid1=$(c).next().val();
    var elementnum=commentdiv.children().length;//第一次点击评论时,评论框里的元素只有2,执行下面函数后增加了评论,评论框的孩子元素>2,用此判断是否第一次点击
    if(commentdiv.is(":visible")==true && elementnum==2){//当评论框是可见的且是第一次点击
        $.ajax({
            type : "POST",  //请求方式
            url : "commentAction",  //请求路径
            data : {
                'messid' :messid1
            },
            async:true,
            success : function(data) {  //异步请求成功执行的回调函数
                var i,j;
                for( i=0;i<data.length;i++){
                    if(i>=5){
                        break;
                    }
                    var deleteinfo="";
                    var sessionid=$("#sessionuserid").val();
                    if(sessionid==data[i][4]){
                        deleteinfo="<a href='javascript:void(0)' class='pull-right' style='font-size: 13' onclick='deleteComment("+data[i][5]+",this)'>删除</a>";
                    }
                    var com="<div class=\"row clearfix\" style=\"border-bottom: 1px solid #ddd;margin: 5px;\">\n" +
                        "                                    <div class=\"col-md-1 column\">\n" +
                        "                                       <a href=\"toUser?userid="+data[i][4]+"\"><img src=\""+data[i][1]+"\" width=\"30px;\"></a>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"col-md-11 column\">\n" +
                        "                                        <a href=\"toUser?userid="+data[i][4]+"\"><span>"+data[i][0]+"</span></a>\n" +
                        "                                        <span>"+data[i][3]+"</span>\n" +deleteinfo+
                        "                                        <h6 style=\"margin-top: 1px;\">"+data[i][2]+"分钟前"+"</h6>\n" +
                        "                                    </div>\n" +
                        "                                </div>";
                    commentdiv.append(com);
                }
                if(i==5){
                    var com="<div style='text-align: center'><a href='toMessage?messageID="+messageid+"'>查看更多</a></div>";
                    commentdiv.append(com);
                }
            },//ajax引擎一般用不到；状态信息；抛出的异常信息
            error : function() {
                alert("message.js【comment】失败")
            }
        });
    }
};

function pinlun(c) {
    if ($(c).html() == "评论") {
        var commentinfo = $(c).parent().prev().children().val();
        var userid = $(c).next().next().val();
        var messid = $(c).next().val();
        var nikename = $(c).next().next().next().val();
        var commentid;
        if(userid==0){
            //用户未登录
            popup({type:'error',msg:"评论失败，请先登陆！",delay:2000,bg:true,clickDomCancel:true});
        }
        else{
            $.ajax({
                type: "POST",  //请求方式
                url: "addcommentAction",  //请求路径
                data: {
                    'messid': messid,
                    'userid': userid,
                    'commentinfo': commentinfo
                },
                async: true,
                success: function (data) {
                    //得到评论的id
                    popup({type:'success',msg:"评论成功",delay:1000,callBack:function(){;}});
                    commentid=data;
                    var div = $(c).parent().parent().parent().parent();
                    //得到当前登录用户的sessionid;
                    var deleteinfo="";
                    var sessionid=$("#sessionuserid").val();
                    if(sessionid==userid){
                        deleteinfo="<a href='javascript:void(0)' class='pull-right' style='font-size: 13' onclick='deleteComment("+commentid+",this)'>删除</a>";
                    }
                    var mycom = "<div class=\"row clearfix\" style=\"border-bottom: 1px solid #ddd;margin: 5px;\">\n" +
                        "                                    <div class=\"col-md-1 column\">\n" +
                        "                                       <a href=\"toUser?userid=" + userid + "\"><img src=\""+$("#touxiang").html()+"\" width=\"30px;\"></a>\n" +
                        "                                    </div>\n" +
                        "                                    <div class=\"col-md-11 column\">\n" +
                        "                                        <a href=\"toUser?userid=" + userid + "\"><span>" + nikename + "</span></a>\n" +
                        "                                        <span>" + commentinfo + "</span>\n" +deleteinfo+
                        "                                        <h6 style=\"margin-top: 1px;\">" + "10秒钟前" + "</h6>\n" +
                        "                                    </div>\n" +
                        "                                </div>";
                    div.after(mycom);
                    $(c).parent().prev().children().val("");
                    var commentdiv = $(c).parent().parent().parent().parent().parent().prev().children("div").eq(2).children("span").html();
                    commentdiv = "评价" + (parseInt(commentdiv.substring(2)) + 1);
                    $(c).parent().parent().parent().parent().parent().prev().children("div").eq(2).children("span").html(commentdiv);
                },
                error: function () {
                    alert("发布评论失败了")
                }
            });
        }
    }
};

//转发功能
var str;
var present;
function transponds(c) {
    var parentdiv=$(c).parent().parent().prev().children().eq(0).children().eq(1);
    $("#transpond_info").text(parentdiv.children().eq(2).text());
    $("#transpond_username").text(parentdiv.children().eq(0).text());
    $("#messID").val($(c).parent().next().next().children("#MessageId").val());
    str="转发"+(parseInt($(c).text().substring(2)) + 1);
    present=$(c);
};

//转发的模态框显示在界面上
$(function () {
        // 执行一些动作..
        $("#transpondweibo").click(function () {
            if($("#sessionuserid").val()==0){
                //用户没有登录
                $('#TransPondModal').hide();
                $(".modal-backdrop").remove();
                $('#TransPondModal').modal('hide');
                popup({type:'error',msg:"转发失败，请先登陆！",delay:2000,bg:true,clickDomCancel:true});
            }else{
                $.ajax({
                    type:'Post',
                    url:'transMessage',
                    data:{
                        'messageInfo':$("#transpond_info").text(),
                        'messagrReason':$("#transpond_reason").val(),
                        'messageID':$("#messID").val(),
                        'message_username':$("#transpond_username").text()
                    },
                    dataType: 'json',
                    async:true,
                    success:function(data){
                        //消除模态框
                        $('#TransPondModal').hide();
                        $(".modal-backdrop").remove();
                        $('#TransPondModal').modal('hide');
                        popup({type:'success',msg:"转发成功",delay:1000,callBack:function(){;}});
                        var info=$("#transpond_info").text();
                        var reason=$("#transpond_reason").val();
                        var name=$("#transpond_username").text();
                        var userid=$("#sessionuserid").val();
                        var username=$("#sessionusername").val();
                        var messageid = data.messid;
                        var myweibo="<div style=\"background-color: white;margin: 5px;\">\n" +
                            "    <!--上层div-->\n" +
                            "    <div class=\"row clearfix\" style=\"padding-bottom: 1.5rem;\">\n" +
                            "        <div class=\"col-md-12 column\">\n" +
                            "            <div class=\"col-md-2 column\" style=\"padding-left: 25px;padding-top: 10px;\">\n" +
                            "                <!--点击头像 进入用户空间-->\n" +
                            "                <a href='toUser?userid="+userid+"'>"+
                            "<img src=\""+$("#touxiang").html()+"\" class=\"img-circle\" width=\"60px;\"></a>\n" +
                            "            </div>\n" +
                            "            <div class=\"col-md-10 column\">\n" +
                            "                <h4 style=\"font-weight: bold;\">"+username+"</h4>\n" +
                            "                <h6>0分钟前 来自miniweibo.com</h6>\n" +" <p style=\"display: none\">"+reason+"</p>"+ reason;
                        var count=data.list.length;
                        if(count!=0){
                            //微博不为原创
                            myweibo=myweibo+"<a href='#'><b>@"+data.nikename+":</b></a>"+data.weiboInfo;
                            for(var k in data.list){
                                if(data.list[parseInt(k)].message.messageType=="Transpond"){
                                    //如果该微博是转发后的微博
                                    myweibo=myweibo+"<a href='#' ><b>@"+
                                        data.list[parseInt(k)].user.name+":</b></a>"+ data.list[parseInt(k)].message.info;
                                }
                            }
                            //微博bu为原创
                            myweibo=myweibo+"</div></div>";
                            myweibo=myweibo+"<div class=\"col-md-12\" style=\"max-height: 500px;padding-top: 1rem;\">\n" +"<div class=\"col-sm-12\" style='background-color:#eee;'>"+
                                "                <div class=\"col-md-10 column pull-right\" style='padding-left: 0px;'>\n" +
                                "                    <a href='#'>" +
                                "                        <b>@"+
                                data.list[count-1].user.name+":</b></a>\n" +
                                "                        <p>"+
                                data.list[count-1].message.info+"</p>\n" +
                                "                        <br>\n" +
                                "                        <div>\n" +
                                "                            <h6 class=\"pull-left\">"+data.list[count-1].message.messageTime+"</h6>\n" +
                                "                            <h6 class=\"pull-right\"><span class=\"glyphicon glyphicon-link\">"+data.list[count-1].message.messageTranspondnum+"</span>&nbsp;\n" +
                                "                                <span class=\"glyphicon glyphicon-edit\">"+data.list[count-1].message.messageCollectnum+"</span>&nbsp;\n" +
                                "                                <span class=\"glyphicon glyphicon-thumbs-up\">"+data.list[count-1].message.messageAgreenum+"</span>\n" +
                                "                            </h6>\n" +
                                "                        </div>\n" +
                                "                    </div>" +
                                "                </div>"+"</div>"+"</div>"+
                                "<div class=\"row\" style=\"border-top: 1px solid #ddd;border-bottom: 1px solid #ddd;\">\n" +
                                "    <div class=\"col-md-3 column\" style=\"text-align: center;padding: 10px;border-right: 1px solid #ddd;\">\n" +
                                "        <span class=\"glyphicon glyphicon-link\" onclick=\"transponds(this)\" data-toggle=\"modal\" data-target=\"#TransPondModal\">转发0</span>\n" +
                                "    </div>\n" +
                                "    <div class=\"col-md-3 column\" style=\"text-align: center;padding: 10px;border-right: 1px solid #ddd;\">\n" +
                                "        <!--得到微博的收藏状态和收藏的次数-->\n" +
                                "        <span class=\"glyphicon glyphicon-star-empty\" onclick=\"collection(this)\">收藏</span>\n" +
                                "       <input value=\""+messageid+"\" style=\"display: none\">\n" +
                                "       <input value=\""+userid+"\" style=\"display: none;\">"+
                                "</div>\n"+
                                "<div class=\"col-md-3 column\" style=\"text-align: center;padding: 10px;border-right: 1px solid #ddd;\">\n" +
                                "    <span id=\"showcomment\" class=\"glyphicon glyphicon-edit\" onclick=\"comment(this)\">评价0</span>\n" +
                                "<input id=\"MessageId\" value=\""+messageid+"\" style=\"display: none\">"+
                                "</div>\n" +
                                "<div class=\"col-md-3 column\" style=\"text-align: center;padding: 10px;\">\n" +
                                "    <!--得到微博的赞同状态和赞同次数-->\n" +
                                "    <span class=\"glyphicon glyphicon-thumbs-up\" onclick=\"agree(this)\">0</span>\n" +
                                "       <input value=\""+messageid+"\" style=\"display: none\">\n" +
                                "       <input value=\""+userid+"\" style=\"display: none;\">"+
                                "</div>\n" +
                                "</div>" +"            <!--点击评价显示出来的div-->\n" +
                                "            <div id=\"comment\" style=\"padding-left: 25px;background-color: #eee;display: none\">\n" +
                                "                <!--分割线-->\n" +
                                "                <hr>\n" +
                                "                <div class=\"row clearfix\">\n" +
                                "                    <div class=\"col-md-1 column\">\n" +
                                "                        <!--点击头像 进入用户空间-->\n" +
                                "                        <img src=\""+$("#touxiang").html()+"\" width=\"35px;\">\n" +
                                "                    </div>\n" +
                                "                    <div class=\"col-md-11 column\" style=\"padding-right: 35px;\">\n" +
                                "                        <form role=\"form\" onsubmit='return false'>\n" +
                                "                            <div class=\"form-group\">\n" +
                                "                                <input type=\"text\" class=\"form-control\" style=\"height: 30px;\">\n" +
                                "                            </div>\n" +
                                "                            <div class=\"form-group\">\n" +
                                "                                <span class=\"face\"></span>\n" +
                                "                                <span class=\"pic\"></span>\n" +
                                "                                <button type=\"submit\" class=\"btn btn-default pull-right\" style=\"background-color: orange;height: 30px;\" onclick=\"pinlun(this)\">评论</button>\n" +
                                "                                <input value=\""+messageid+"\" style=\"display: none\">\n" +
                                "                                <input id=\"sessionuserid\" value=\""+userid+"\" style=\"display: none\">\n" +
                                "                                <input id=\"sessionusername\" value=\""+username+"\" style=\"display: none\">\n" +
                                "                            </div>\n" +
                                "                        </form>\n" +
                                "                        <!--分割线-->\n" +
                                "                        <hr>\n" +
                                "                    </div>\n" +
                                "                    <!--评论-->\n" +
                                "                    <!--自己发布的评论显示在这里-->\n" +
                                "                    <div>\n" +
                                "\n" +
                                "\n" +
                                "                    </div>\n" +
                                "\n" +
                                "\n" +
                                "                </div>\n" +
                                "            </div>"+
                                "</div>";
                        }else{
                            //微博为原创
                            myweibo=myweibo+"</div></div>";
                            myweibo=myweibo+"<div class=\"col-md-12\" style=\"max-height: 500px;padding-top: 1rem;\">\n" +"<div class=\"col-sm-12\" style='background-color:#eee;'>"+
                                "                <div class=\"col-md-10 column pull-right\" style='padding-left: 0px;'>\n" +
                                "                    <a href='#'>" +
                                "                        <b>@"+
                                data.nikename+":</b></a>\n" +
                                "                        <p>"+
                                data.weiboInfo+"</p>\n" +
                                "                        <br>\n" +
                                "                        <div>\n" +
                                "                            <h6 class=\"pull-left\">"+data.timestamp+"</h6>\n" +
                                "                            <h6 class=\"pull-right\"><span class=\"glyphicon glyphicon-link\">"+data.transpond+"</span>&nbsp;\n" +
                                "                                <span class=\"glyphicon glyphicon-edit\">"+data.comment+"</span>&nbsp;\n" +
                                "                                <span class=\"glyphicon glyphicon-thumbs-up\">"+data.agree+"</span>\n" +
                                "                            </h6>\n" +
                                "                        </div>\n" +
                                "                    </div>" +
                                "                </div>"+"</div>"+"</div>"+
                                "<div class=\"row\" style=\"border-top: 1px solid #ddd;border-bottom: 1px solid #ddd;\">\n" +
                                "    <div class=\"col-md-3 column\" style=\"text-align: center;padding: 10px;border-right: 1px solid #ddd;\">\n" +
                                "        <span class=\"glyphicon glyphicon-link\" onclick=\"transponds(this)\" data-toggle=\"modal\" data-target=\"#TransPondModal\">转发0</span>\n" +
                                "    </div>\n" +
                                "    <div class=\"col-md-3 column\" style=\"text-align: center;padding: 10px;border-right: 1px solid #ddd;\">\n" +
                                "        <!--得到微博的收藏状态和收藏的次数-->\n" +
                                "        <span class=\"glyphicon glyphicon-star-empty\" onclick=\"collection(this)\">收藏</span>\n" +
                                "       <input value=\""+messageid+"\" style=\"display: none\">\n" +
                                "       <input value=\""+userid+"\" style=\"display: none;\">"+
                                "</div>\n" +
                                "<div class=\"col-md-3 column\" style=\"text-align: center;padding: 10px;border-right: 1px solid #ddd;\">\n" +
                                "    <span id=\"showcomment\" class=\"glyphicon glyphicon-edit\" onclick=\"comment(this)\">评价0</span>\n" +
                                "<input id=\"MessageId\" value=\""+messageid+"\" style=\"display: none\">"+
                                "</div>\n" +
                                "<div class=\"col-md-3 column\" style=\"text-align: center;padding: 10px;\">\n" +
                                "    <!--得到微博的赞同状态和赞同次数-->\n" +
                                "    <span class=\"glyphicon glyphicon-thumbs-up\" onclick=\"agree(this)\">0</span>\n" +
                                "       <input value=\""+messageid+"\" style=\"display: none\">\n" +
                                "       <input value=\""+userid+"\" style=\"display: none;\">"+
                                "</div>\n" +
                                "</div>" +"            <!--点击评价显示出来的div-->\n" +
                                "            <div id=\"comment\" style=\"padding-left: 25px;background-color: #eee;display: none\">\n" +
                                "                <!--分割线-->\n" +
                                "                <hr>\n" +
                                "                <div class=\"row clearfix\">\n" +
                                "                    <div class=\"col-md-1 column\">\n" +
                                "                        <!--点击头像 进入用户空间-->\n" +
                                "                        <img src=\""+$("#touxiang").html()+"\" width=\"35px;\">\n" +
                                "                    </div>\n" +
                                "                    <div class=\"col-md-11 column\" style=\"padding-right: 35px;\">\n" +
                                "                        <form role=\"form\" onsubmit='return false'>\n" +
                                "                            <div class=\"form-group\">\n" +
                                "                                <input type=\"text\" class=\"form-control\" style=\"height: 30px;\">\n" +
                                "                            </div>\n" +
                                "                            <div class=\"form-group\">\n" +
                                "                                <span class=\"face\"></span>\n" +
                                "                                <span class=\"pic\"></span>\n" +
                                "                                <button type=\"submit\" class=\"btn btn-default pull-right\" style=\"background-color: orange;height: 30px;\" onclick=\"pinlun(this)\">评论</button>\n" +
                                "                                <input value=\""+messageid+"\" style=\"display: none\">\n" +
                                "                                <input id=\"sessionuserid\" value=\""+userid+"\" style=\"display: none\">\n" +
                                "                                <input id=\"sessionusername\" value=\""+username+"\" style=\"display: none\">\n" +
                                "                            </div>\n" +
                                "                        </form>\n" +
                                "                        <!--分割线-->\n" +
                                "                        <hr>\n" +
                                "                    </div>\n" +
                                "                    <!--评论-->\n" +
                                "                    <!--自己发布的评论显示在这里-->\n" +
                                "                    <div>\n" +
                                "\n" +
                                "\n" +
                                "                    </div>\n" +
                                "\n" +
                                "\n" +
                                "                </div>\n" +
                                "            </div>"+
                                "</div>";
                        }
                        $('#transpond_reason').val("");
                        $("#myWeibo").prepend(myweibo);
                        //转发成功 原创微博数目加1
                        present.text(str);
                        $("#mymessagenum").text((parseInt($("#mymessagenum").text())+1));
                        location.href="#";
                        $("#myWeibo").slideDown();
                    },
                    error:function (err) {
                        //成功发布微博
                        alert("转发微博失败!");
                    }
                });
            }
        })
})
