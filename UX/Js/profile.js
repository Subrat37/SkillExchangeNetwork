
// ==========================================
// SKILLS
// ==========================================

let teachSkills = [];
let learnSkills = [];


// Add Skill
function addSkill(type) {

    let input;
    let skillArray;
    let container;

    if (type === "teach") {

        input = document.getElementById("teachSkillInput");
        skillArray = teachSkills;
        container = document.getElementById("teachSkillContainer");

    } else {

        input = document.getElementById("learnSkillInput");
        skillArray = learnSkills;
        container = document.getElementById("learnSkillContainer");

    }


    const skill = input.value.trim();


    // Don't add empty skill
    if (skill === "") {
        alert("Please enter a skill.");
        return;
    }


    // Don't allow duplicate skill
    if (skillArray.some(
        existingSkill =>
            existingSkill.toLowerCase() === skill.toLowerCase()
    )) {

        alert("This skill has already been added.");
        return;

    }


    skillArray.push(skill);


    input.value = "";


    displaySkills(type);

    updateCompletion();

}



// Display Skills
function displaySkills(type) {

    let skills;
    let container;

    if (type === "teach") {

        skills = teachSkills;
        container = document.getElementById("teachSkillContainer");

    } else {

        skills = learnSkills;
        container = document.getElementById("learnSkillContainer");

    }


    container.innerHTML = "";


    skills.forEach((skill, index) => {

        const skillTag = document.createElement("div");

        skillTag.className = "skill-tag";


        skillTag.innerHTML = `
            <span>${skill}</span>

            <span
                class="remove-skill"
                onclick="removeSkill('${type}', ${index})"
            >
                ×
            </span>
        `;


        container.appendChild(skillTag);

    });

}



// Remove Skill
function removeSkill(type, index) {

    if (type === "teach") {

        teachSkills.splice(index, 1);

        displaySkills("teach");

    } else {

        learnSkills.splice(index, 1);

        displaySkills("learn");

    }


    updateCompletion();

}



// ==========================================
// ENTER KEY FOR ADDING SKILL
// ==========================================

document
    .getElementById("teachSkillInput")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            addSkill("teach");

        }

    });


document
    .getElementById("learnSkillInput")
    .addEventListener("keypress", function(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            addSkill("learn");

        }

    });



// ==========================================
// PROFILE IMAGE
// ==========================================

document
    .getElementById("profileImage")
    .addEventListener("change", function(event) {

        const file = event.target.files[0];


        if (!file) {
            return;
        }


        // Check image type
        if (!file.type.startsWith("image/")) {

            alert("Please select an image file.");

            return;

        }


        // Check image size
        if (file.size > 2 * 1024 * 1024) {

            alert("Image size must be less than 2MB.");

            return;

        }


        const reader = new FileReader();


        reader.onload = function(e) {

            const profilePicture =
                document.getElementById("profilePicture");


            profilePicture.innerHTML = `
                <img src="${e.target.result}" alt="Profile Picture">
            `;

        };


        reader.readAsDataURL(file);

        updateCompletion();

    });



// ==========================================
// PROFILE INITIAL
// ==========================================

document
    .getElementById("fullName")
    .addEventListener("input", function() {

        const name = this.value.trim();

        const initial =
            document.getElementById("profileInitial");


        if (name.length > 0) {

            initial.textContent =
                name.charAt(0).toUpperCase();

        } else {

            initial.textContent = "U";

        }


        updateCompletion();

    });



// ==========================================
// PROFILE COMPLETION
// ==========================================

const fieldsToCheck = [

    "fullName",
    "username",
    "email",
    "phone",
    "location",
    "dob",
    "bio",
    "qualification",
    "course",
    "college",
    "graduationYear",
    "experienceLevel",
    "experienceYears",
    "currentRole",
    "startTime",
    "endTime",
    "github",
    "linkedin",
    "portfolio"

];


fieldsToCheck.forEach(function(fieldId) {

    const field = document.getElementById(fieldId);


    if (field) {

        field.addEventListener("input", updateCompletion);

        field.addEventListener("change", updateCompletion);

    }

});



function updateCompletion() {

    let completed = 0;


    fieldsToCheck.forEach(function(fieldId) {

        const field =
            document.getElementById(fieldId);


        if (field && field.value.trim() !== "") {

            completed++;

        }

    });


    // Skills count
    if (teachSkills.length > 0) {

        completed++;

    }


    if (learnSkills.length > 0) {

        completed++;

    }


    // Calculate percentage
    const total =
        fieldsToCheck.length + 2;


    const percentage =
        Math.round((completed / total) * 100);


    document
        .getElementById("completionPercentage")
        .textContent = percentage + "%";


    document
        .getElementById("completionText")
        .textContent =
        percentage + "% Complete";


    document
        .getElementById("progressFill")
        .style.width =
        percentage + "%";

}



// ==========================================
// SAVE PROFILE
// ==========================================

function saveProfile() {

    const profile = {

        personal: {

            fullName:
                document.getElementById("fullName").value,

            username:
                document.getElementById("username").value,

            email:
                document.getElementById("email").value,

            phone:
                document.getElementById("phone").value,

            location:
                document.getElementById("location").value,

            dob:
                document.getElementById("dob").value,

            bio:
                document.getElementById("bio").value

        },


        skills: {

            teach: teachSkills,

            learn: learnSkills

        },


        education: {

            qualification:
                document.getElementById("qualification").value,

            course:
                document.getElementById("course").value,

            college:
                document.getElementById("college").value,

            graduationYear:
                document.getElementById("graduationYear").value

        },


        experience: {

            level:
                document.getElementById("experienceLevel").value,

            years:
                document.getElementById("experienceYears").value,

            currentRole:
                document.getElementById("currentRole").value

        },


        availability: {

            startTime:
                document.getElementById("startTime").value,

            endTime:
                document.getElementById("endTime").value

        },


        professional: {

            github:
                document.getElementById("github").value,

            linkedin:
                document.getElementById("linkedin").value,

            portfolio:
                document.getElementById("portfolio").value

        }

    };


    // Save temporarily in browser
    localStorage.setItem(
        "skillExchangeProfile",
        JSON.stringify(profile)
    );


    showToast();

}



// ==========================================
// TOAST MESSAGE
// ==========================================

function showToast() {

    const toast =
        document.getElementById("toast");


    toast.classList.add("show");


    setTimeout(function() {

        toast.classList.remove("show");

    }, 3000);

}



// ==========================================
// LOAD SAVED PROFILE
// ==========================================

window.addEventListener("DOMContentLoaded", function() {

    const savedProfile =
        localStorage.getItem("skillExchangeProfile");


    if (!savedProfile) {

        updateCompletion();

        return;

    }


    const profile =
        JSON.parse(savedProfile);


    // Personal information

    document.getElementById("fullName").value =
        profile.personal.fullName || "";

    document.getElementById("username").value =
        profile.personal.username || "";

    document.getElementById("email").value =
        profile.personal.email || "";

    document.getElementById("phone").value =
        profile.personal.phone || "";

    document.getElementById("location").value =
        profile.personal.location || "";

    document.getElementById("dob").value =
        profile.personal.dob || "";

    document.getElementById("bio").value =
        profile.personal.bio || "";


    // Education

    document.getElementById("qualification").value =
        profile.education.qualification || "";

    document.getElementById("course").value =
        profile.education.course || "";

    document.getElementById("college").value =
        profile.education.college || "";

    document.getElementById("graduationYear").value =
        profile.education.graduationYear || "";


    // Experience

    document.getElementById("experienceLevel").value =
        profile.experience.level || "";

    document.getElementById("experienceYears").value =
        profile.experience.years || "";

    document.getElementById("currentRole").value =
        profile.experience.currentRole || "";


    // Availability

    document.getElementById("startTime").value =
        profile.availability.startTime || "";

    document.getElementById("endTime").value =
        profile.availability.endTime || "";


    // Professional links

    document.getElementById("github").value =
        profile.professional.github || "";

    document.getElementById("linkedin").value =
        profile.professional.linkedin || "";

    document.getElementById("portfolio").value =
        profile.professional.portfolio || "";


    // Skills

    teachSkills =
        profile.skills.teach || [];

    learnSkills =
        profile.skills.learn || [];


    displaySkills("teach");

    displaySkills("learn");


    // Initial

    const name =
        profile.personal.fullName;


    if (name) {

        document.getElementById("profileInitial")
            .textContent =
            name.charAt(0).toUpperCase();

    }


    updateCompletion();

});

