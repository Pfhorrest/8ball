//Because you can never trust anything from the internet...
function sanitize(input) {
	return input.replace(/[^\w. ]/gi, function (c) {
		return '&#' + c.charCodeAt(0) + ';';
	});
};

//The main function to ask the Magic 8-Ball
function askEightBall() {
	//	Declaring all the requisite variables and their default values
	let questionOld = document.getElementById("question-old").innerHTML;
	let result = document.getElementById("result").innerHTML;
	let questionNew = document.getElementById("question-new").value;
	let questionNewClean = sanitize(questionNew);
	document.getElementById("question-new").value = "";
	//	Check if question is blank, and if so...
	if ( questionNew == "" || questionNew == "?") {
		questionOld = "...";
		result = "Yes? Do you have a question?";
		document.getElementById("question-old").innerHTML = questionOld;
		document.getElementById("result").innerHTML = result;
		document.getElementById("result").className = "Contrary";
	//	Check if question is actually a question...
	} else if ( questionNew.slice(-1) != "?" ) {
		//	And if not...
		questionOld = "<q>" + questionNewClean + "</q>?"
		result = "That's not even a question!"
		document.getElementById("question-old").innerHTML = questionOld;
		document.getElementById("result").innerHTML = result;
		document.getElementById("result").className = "Contrary";
	} else {
		//	But if so...
		document.getElementById("hero").className = "loading";
		let params = encodeURIComponent(questionNew);
		let uri = "https://8ball.delegator.com/magic/JSON/" + params;
		try {
			fetch(uri)
				.then(response => response.json())
				.then(json => {
				questionOld = sanitize(json.magic.question);
				result = sanitize(json.magic.answer);
				document.getElementById("question-old").innerHTML = questionOld;
				document.getElementById("result").innerHTML = result;
				document.getElementById("result").className = sanitize(json.magic.type);
				document.getElementById("hero").className = "";
			});
		}
		catch(err) {
			questionOld = "Uh oh!";
			result = err;
			document.getElementById("question-old").innerHTML = questionOld;
			document.getElementById("result").innerHTML = result;
			document.getElementById("result").className = "Contrary";
			document.getElementById("hero").className = "";
		}
	}
}

//Do stuff when the page loads
window.addEventListener("load", function() {
	//Do the the askEightBall function when the Ask button is clicked
	document.getElementById("ask").addEventListener("click",askEightBall);

	//Make hitting Enter from the question input click the Ask button
	document.getElementById("question-new").addEventListener("keyup", function(e) {
		if (e.keyCode === 13) {
			e.preventDefault();
			document.getElementById("ask").click();
		}
	});
}); 
