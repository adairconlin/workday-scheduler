let tasks = {};

let saveTask = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

$(".row").on("click", ".description", function() {
    let task = $(this).text().trim();
    let taskInput = $("<textarea>").addClass("col-9 pt-3 description").val(task);
    $(this).replaceWith(taskInput);
    taskInput.trigger("focus");
});

$(".saveBtn").on("click", function() {
    let task= $(this).closest(".row").find(".description");
    let taskInput = $(this).closest(".row").find(".description").val();
    let taskDiv = $("<div>").addClass("col-9 pt-3 description").text(taskInput);
    $(task).replaceWith(taskDiv);

    let index = $(this).closest(".row").find(".taskTime").text();
    tasks[index] = taskInput

    saveTask();
});

let createTasks = function(key) {
    let timeDiv = $(".row").find(".taskTime");

    for(let i = 0; i < timeDiv.length; i++) {
        let taskTime = timeDiv[i];
        if(taskTime.innerHTML === key) {
            let taskDiv = $(taskTime).closest(".row").find(".description");
            $(taskDiv).text(tasks[key]);
        }
    }
};

let loadTasks = function() {
    tasks = JSON.parse(localStorage.getItem("tasks"));

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

    for(key in tasks) {
        createTasks(key);
    }
};

loadTasks()

// display current day
$("#currentDay").text(moment().format("dddd, MMMM Do, HH:MM:ss"));
