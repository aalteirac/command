
var main = function(){
    var value='S*';
	var sheet="/sheet/1ff88551-9c4d-41e0-b790-37f4c11d3df8/state/analysis";
	var initiated=false;
	function setApps(){
		$.post( "main",{doclist:true,userid:$("#userid").val()}, function(data) {
			if(!initiated){
				var options = '';
				for (var i = 0; i < data.length; i++) {
					var sel=i==0?"selected":"";
					options += '<option value="' + data[i].qDocId + '"'+sel+'>' + data[i].qDocName + '</option>';
				}
				$("#appid").html(options);
				initiated=true;
			}
			$.post( "main",{fieldlist:true,userid:$("#userid").val(),appid:$("#appid").val()}, function(data) {
				var options = '';
				for (var i = 0; i < data.length; i++) {
					var sel=i==0?"selected":"";
					options += '<option value="' + data[i].qName + '"'+sel+'>' + data[i].qName + '</option>';
				}
				$("#field").html(options);
				var dt={
                appid:$("#appid").val(),
                userid:$("#userid").val(),
                clear:true
				};
				post(dt);
				$("#appf").attr("src","http://"+location.hostname+"/sense/app/"+$("#appid").val()+sheet);
			})
		})
	}
    function init(){
        $("#value").attr("value",value);
		$("#connect").click(function(){
			setApps();
        });
        $("#go").click(function(){
            var dt={
                appid:$("#appid").val(),
                userid:$("#userid").val(),
                field:$("#field").val(),
                value:$("#value").val()
            };
            post(dt);
        });
		$("#clear").click(function(){
            var dt={
                appid:$("#appid").val(),
                userid:$("#userid").val(),
                clear:true
            };
            post(dt);
        });
    }

    function post(dt){
        $.post( "main",dt, function(data) {
			$("#url").show();
			$("#url").attr("href","http://"+location.hostname+"/sense/app/"+data.appid+sheet);
			$("#appf").show();
			$(".conn").show();
        })
            .fail(function(e) {
                alert( JSON.stringify(e) );
            })
    }

    return{
        post: function(){
            return post();
        },
        init:function(){
            return init();
        }
    }


}().init();

