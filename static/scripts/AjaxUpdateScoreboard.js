function saveToScoreboard(score_time) {
    let name = prompt("Please enter name for scoreboard");
    if (name == null || name === "") { return }
    let csrfToken = $('meta[name="csrf-token"]').attr('content');

    $.ajax({
        url: "/HarrisMclennan/save_to_scoreboard/",  // URL to send data to
        type: "POST",
        data: {
            'player_name': name,
            'score_time': score_time,
            'csrfmiddlewaretoken': csrfToken
        },
        success: function (response) {
            alert(response.message);
        },
        error: function (xhr, status, error) {
            console.error("Error: " + error);
        }
    });
}