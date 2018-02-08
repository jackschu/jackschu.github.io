//jquery
$(document).ready(function(){
	Game.init();
	Game.animate();
	$(".closeModal").click( function(){
			$(".modal").css("opacity", "0");
			$(".modal").hide();
		}
	);
	$("#helpBox").click(function(){
		var newWidth = $("#helpBox").width() == 100 ? '400px' : '100px';
		$("#helpBox").width(newWidth);
		$(".content").slideToggle(500);
	});
		
});

function reload(){
	location.reload();
}

