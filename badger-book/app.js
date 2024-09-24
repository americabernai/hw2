fetch("https://cs571api.cs.wisc.edu/rest/f24/hw2/students", {
	headers: {
		"X-CS571-ID": CS571.getBadgerId()
	}
})
.then(res => {return res.json()})
.then(data => {
	console.log(data);
	studentData = data;
	buildStudents(data);
})
.catch(error => {console.error(error)})


function buildStudents(studs) {
	const numStuds = document.getElementById("num-results");
	numStuds.innerText = studs.length;

	const studentContainer = document.getElementById("students");

	studentContainer.innerHTML = ''; 

	studs.forEach(stud => {
		const student = document.createElement("div");
		student.className = "col-12 col-md-6 col-lg-4 col-xl-3 student-card";

		// name
		const studentName = document.createElement("h2");
		studentName.textContent = `${stud.name.first} ${stud.name.last}`;
		student.appendChild(studentName);

		// major
		const studentMajor = document.createElement("h6");
		studentMajor.textContent = `${stud.major}`
		student.appendChild(studentMajor);

		// credits and wisconsin status
		const studentCredWis = document.createElement("p");
		studentCredWis.textContent = `${stud.name.first} ${stud.fromWisconsin ? "is" :
										"is not"} from Wisconsin and is taking
										${stud.numCredits} credits this semester.`
		student.appendChild(studentCredWis);

		// interests
		const studentNumInt = document.createElement("p");
		studentNumInt.textContent = `They have ${stud.interests.length} interests including...`;
		student.appendChild(studentNumInt);

		const studentIntList = document.createElement("ul");
		stud.interests.forEach(interest => {
			const interestItem = document.createElement("li");
			interestItem.textContent = interest;
			interestItem.style.cursor = 'pointer'; // cursor to pointer to indicate clickability

			interestItem.addEventListener("click", (e) => {
				const selectedText = e.target.innerText;
				document.getElementById("search-name").value = '';
				document.getElementById("search-major").value = '';
				document.getElementById("search-interest").value = selectedText;
				handleSearch();
			});

			studentIntList.appendChild(interestItem);
		});
		student.appendChild(studentIntList);

		studentContainer.appendChild(student);
	});
}

function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!

	const nameInput = document.getElementById("search-name").value;
    const majorInput = document.getElementById("search-major").value;
    const interestInput = document.getElementById("search-interest").value;
	
	let filteredStudents = studentData;

	if (nameInput.trim()) {
        filteredStudents = filteredStudents.filter(stud => {
            return `${stud.name.first.toLowerCase()} ${stud.name.last.toLowerCase()}`.includes(nameInput.toLowerCase().trim());
        });
    }
    if (majorInput.trim()) {
        filteredStudents = filteredStudents.filter(stud => {
            return stud.major.toLowerCase().includes(majorInput.toLowerCase().trim());
        });
    }
    if (interestInput.trim()) {
        filteredStudents = filteredStudents.filter(stud => {
            return stud.interests.some(interest => 
				interest.toLowerCase().includes(interestInput.toLowerCase().trim()));
        });
    }

	buildStudents(filteredStudents);
}

document.getElementById("search-btn").addEventListener("click", handleSearch);