let tasks = {};

// Save task object to localStorage.
let saveTask = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Change targeted div to a `<textarea>` element on click.
$(".row").on("click", ".description", function() {
    let task = $(this).text().trim();
    // Save current text when the div is replaced with new element.
    let taskInput = $("<textarea>").addClass("col-9 pt-3 description").val(task);
    $(this).replaceWith(taskInput);
    taskInput.trigger("focus");
});

// Change focused `<textarea>` element to a div on click of the save button.
$(".saveBtn").on("click", function() {
    let task= $(this).closest(".row").find(".description");
    let taskInput = $(this).closest(".row").find(".description").val();
    console.log(taskInput);
    let taskDiv = $("<div>").addClass("col-9 pt-3 description").text(taskInput);
    $(task).replaceWith(taskDiv);

    // Add text value to the corresponding key value in tasks object.
    let index = $(this).closest(".row").find(".taskTime").text();
    tasks[index] = taskInput

    // Save any new inputs on click.
    saveTask();
    // Adds corresponding classes when elements change.
    loadColors();
});

// Load tasks on to page from localStorage.
let createTasks = function(key) {
    // Finds the div that is closest to the wanted row.
    let timeDiv = $(".row").find(".taskTime");

    // Loop through every div and assign text based on the matching key value.
    for(let i = 0; i < timeDiv.length; i++) {
        let taskTime = timeDiv[i];
        if(taskTime.innerHTML === key) {
            let taskDiv = $(taskTime).closest(".row").find(".description");
            $(taskDiv).text(tasks[key]);
        }
    }
};

// Load tasks from localStorage.
let loadTasks = function() {
    tasks = JSON.parse(localStorage.getItem("tasks"));

    // If there are no tasks, the page will create an
    // empty object to store user data doing forward.
    if(!tasks) {
        tasks = {
            "9AM": [],
            "10AM": [],
            "11AM": [],
            "12PM": [],
            "1PM": [],
            "2PM": [],
            "3PM": [],
            "4PM": [],
            "5PM": [],
        }
    };

    // Execute createTasks for every key in tasks.
    for(key in tasks) {
        createTasks(key);
    }
};

// Convert to military time so that Moment.js can compare its value.
let convertTime = function(time) {
    time = parseInt(time);
    if(time < 6) {
        time = time + 12;
    } else {
        time = time;
    }
    return time;
};

// Color-code every div based on the current time.
let loadColors = function() {
    // Finds every div that contains the rows corresponding hour value.
    let timeDiv = $(".row").find(".taskTime");

    // Loop through each div and color-code each one accordingly.
    for(let i = 0; i < timeDiv.length; i++) {
        // Assign the corresponding time from each div to the variable divTime.
        let divTime = timeDiv[i].innerHTML;
        // Assign the current time to the variable currentTime.
        let currentTime = moment();
        let time;
        
        // Remove unecessary characters from the innerHTML.
        if(divTime.length > 3) {
            time = divTime.slice(0, 2);
            convertTime(time);
        } else {
            time = divTime.slice(0, 1);
            convertTime(time);
        }

        let hour = convertTime(time);

        // Use Moment.js to convert each div's time to a Moment object.
        let formatHour = moment().set("hour", hour);
        // Format all Moment objects similarly so they can be comparable by the hour.
        formatHour = formatHour.set("second", 0);
        currentTime = currentTime.set("second", 0);
        
        let currentDiv = $(timeDiv[i]).closest(".row").find(".description");
        // Compare the current time to the div's corresponding 
        // time and style them accordingly.
        if(currentTime.isSame(formatHour)) {
            $(currentDiv).addClass("present");
        } else if(currentTime.isAfter(formatHour)) {
            $(currentDiv).addClass("past");
        } else if(currentTime.isBefore(formatHour)) {
            $(currentDiv).addClass("future");
        }
    }

    // Run this function every minute to check for a new hour.
    setInterval(function() {
        loadColors();
    }, 1000 * 60);
};

// Start functions on load.
loadTasks();
loadColors();
// Display current day.
$("#currentDay").text(moment().format("dddd, MMMM Do, HH:MM:ss"));
