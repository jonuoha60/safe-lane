from flask import Blueprint, render_template, jsonify
from flask_login import current_user

api = Blueprint('api', __name__)

@api.route("/questions")
def get_questions():
    return jsonify([
        {
            "id": 1,
            "question": "What does a red light mean?",
            "options": ["Stop", "Go", "Slow down", "Yield"],
            "answer": "Stop"
        }
    ])

@api.route("/questions-answers")
def get_questions_answers():
    return jsonify([
        {"id": 1, "question": "What does a red light mean?", "description": "", "answer": "Stop", "fakeAnswers": ["Go", "Slow down", "Yield", "Stop"]},
        {"id": 2, "question": "Running a red light", "description": "How many demerit points?", "answer": "3", "fakeAnswers": ["2", "4", "3", "6"]},
        {"id": 3, "question": "What does a stop sign require?", "description": "", "answer": "Complete stop", "fakeAnswers": ["Slow down only", "Yield", "Honk horn", "Complete stop"]},
        {"id": 4, "question": "Failing to stop at a stop sign", "description": "How many demerit points?", "answer": "3", "fakeAnswers": ["1", "2", "4", "3"]},
        {"id": 5, "question": "What does a yellow light mean?", "description": "", "answer": "Prepare to stop", "fakeAnswers": ["Speed up", "Turn left", "Stop only for trucks", "Prepare to stop"]},
        {"id": 6, "question": "Speeding 30-49 km/h over limit", "description": "How many demerit points?", "answer": "4", "fakeAnswers": ["2", "3", "6", "4"]},
        {"id": 7, "question": "What shape is a school zone sign?", "description": "", "answer": "Pentagon", "fakeAnswers": ["Triangle", "Circle", "Rectangle", "Pentagon"]},
        {"id": 8, "question": "Failing to stop for a school bus", "description": "How many demerit points?", "answer": "6", "fakeAnswers": ["3", "4", "5", "6"]},
        {"id": 9, "question": "What does a broken white line mean?", "description": "", "answer": "Lane change allowed", "fakeAnswers": ["No passing", "Stop ahead", "One-way road", "Lane change allowed"]},
        {"id": 10, "question": "Following too closely", "description": "How many demerit points?", "answer": "4", "fakeAnswers": ["2", "3", "5", "4"]},
        {"id": 11, "question": "What is the BAC limit for G1 drivers?", "description": "", "answer": "Zero", "fakeAnswers": ["0.05", "0.08", "0.1", "Zero"]},
        {"id": 12, "question": "Distracted driving (phone use)", "description": "How many demerit points?", "answer": "3", "fakeAnswers": ["1", "2", "4", "3"]},
        {"id": 13, "question": "What does a flashing red light mean?", "description": "", "answer": "Stop completely", "fakeAnswers": ["Proceed slowly", "Yield only", "Traffic light broken", "Stop completely"]},
        {"id": 14, "question": "Improper lane change", "description": "How many demerit points?", "answer": "2", "fakeAnswers": ["1", "3", "4", "2"]},
        {"id": 15, "question": "Default speed limit in city (if not posted)?", "description": "", "answer": "50 km/h", "fakeAnswers": ["40 km/h", "60 km/h", "80 km/h", "50 km/h"]},
        {"id": 16, "question": "Failing to yield right-of-way", "description": "How many demerit points?", "answer": "3", "fakeAnswers": ["2", "4", "6", "3"]},
        {"id": 17, "question": "When can you turn right on red?", "description": "", "answer": "After stopping and safe", "fakeAnswers": ["Immediately", "Only at night", "Never", "After stopping and safe"]},
        {"id": 18, "question": "Failing to signal", "description": "How many demerit points?", "answer": "2", "fakeAnswers": ["1", "3", "4", "2"]},
        {"id": 19, "question": "What does a double solid yellow line mean?", "description": "", "answer": "No passing", "fakeAnswers": ["Passing allowed", "Lane merge", "School zone", "No passing"]},
        {"id": 20, "question": "Speeding 50+ km/h over limit", "description": "How many demerit points?", "answer": "6", "fakeAnswers": ["3", "4", "5", "6"]},
        {"id": 21, "question": "When must headlights be on?", "description": "", "answer": "From dusk to dawn", "fakeAnswers": ["Only when raining", "Only at midnight", "Only on highways", "From dusk to dawn"]},
        {"id": 22, "question": "Driving without seatbelt", "description": "How many demerit points?", "answer": "2", "fakeAnswers": ["1", "3", "4", "2"]},
        {"id": 23, "question": "What does a yield sign mean?", "description": "", "answer": "Give right-of-way", "fakeAnswers": ["Come to full stop", "Turn left only", "No entry", "Give right-of-way"]},
        {"id": 24, "question": "Improper passing", "description": "How many demerit points?", "answer": "3", "fakeAnswers": ["1", "2", "4", "3"]},
        {"id": 25, "question": "What should you do at a railway crossing with lights flashing?", "description": "", "answer": "Stop and wait", "fakeAnswers": ["Speed up", "Honk horn", "Proceed slowly", "Stop and wait"]},
        {"id": 26, "question": "Failing to stop for pedestrian", "description": "How many demerit points?", "answer": "3", "fakeAnswers": ["2", "4", "5", "3"]},
        {"id": 27, "question": "What does a flashing green light mean in Ontario?", "description": "", "answer": "Advanced green", "fakeAnswers": ["Stop sign ahead", "Pedestrian crossing", "School zone", "Advanced green"]},
        {"id": 28, "question": "Driving wrong way on one-way street", "description": "How many demerit points?", "answer": "3", "fakeAnswers": ["1", "2", "4", "3"]},
        {"id": 29, "question": "What does a solid white line mean?", "description": "", "answer": "Lane change discouraged", "fakeAnswers": ["Lane ends", "No parking", "Stop completely", "Lane change discouraged"]},
        {"id": 30, "question": "Speeding 16-29 km/h over limit", "description": "How many demerit points?", "answer": "3", "fakeAnswers": ["1", "2", "4", "3"]},

        {"id": 31, "question": "What does this sign mean?", "answer": "Traffic signal ahead", "fakeAnswers": ["Stop ahead", "Yield ahead", "School crossing", "Traffic signal ahead"], "image": "traffic_signal_ahead.png"},
        {"id": 32, "question": "What does this sign mean?", "answer": "Yield ahead", "fakeAnswers": ["Stop ahead", "Merge lane", "Traffic light ahead", "Yield ahead"], "image": "yield_ahead.png"},
        {"id": 33, "question": "What does this sign mean?", "answer": "Stop ahead", "fakeAnswers": ["Yield ahead", "Railway crossing", "Dead end", "Stop ahead"], "image": "stop_ahead.png"},
        {"id": 34, "question": "What does this sign mean?", "answer": "Divided highway begins", "fakeAnswers": ["Road narrows", "Two-way traffic", "Median ends", "Divided highway begins"], "image": "divided_highway_begins.png"},
    ])

@api.route("/demerit-answers")
def get_demerit():
    return jsonify([
        {"id": 1, "question": "Running a red light", "description": "How many demerit points?", "answer": "3"},
        {"id": 2, "question": "Failing to stop at a stop sign", "description": "How many demerit points?", "answer": "3"},
        {"id": 3, "question": "Speeding 16-29 km/h over limit", "description": "How many demerit points?", "answer": "3"},
        {"id": 4, "question": "Speeding 30-49 km/h over limit", "description": "How many demerit points?", "answer": "4"},
        {"id": 5, "question": "Speeding 50+ km/h over limit (stunt driving)", "description": "How many demerit points?", "answer": "6"},
        {"id": 6, "question": "Failing to yield right-of-way", "description": "How many demerit points?", "answer": "3"},
        {"id": 7, "question": "Failing to stop for school bus", "description": "How many demerit points?", "answer": "6"},
        {"id": 8, "question": "Following too closely (tailgating)", "description": "How many demerit points?", "answer": "4"},
        {"id": 9, "question": "Improper lane change", "description": "How many demerit points?", "answer": "2"},
        {"id": 10, "question": "Failing to signal", "description": "How many demerit points?", "answer": "2"},
        {"id": 11, "question": "Driving without seatbelt", "description": "How many demerit points?", "answer": "2"},
        {"id": 12, "question": "Driving wrong way on one-way street", "description": "How many demerit points?", "answer": "3"},
        {"id": 13, "question": "Failing to stop for pedestrian at crosswalk", "description": "How many demerit points?", "answer": "3"},
        {"id": 14, "question": "Improper passing", "description": "How many demerit points?", "answer": "3"},
        {"id": 15, "question": "Driving with open door", "description": "How many demerit points?", "answer": "2"},
        {"id": 16, "question": "Unnecessary slow driving", "description": "How many demerit points?", "answer": "2"},
        {"id": 17, "question": "Improper turn", "description": "How many demerit points?", "answer": "2"},
        {"id": 18, "question": "Failing to obey traffic signal", "description": "How many demerit points?", "answer": "3"},
        {"id": 19, "question": "Driving without headlights at night", "description": "How many demerit points?", "answer": "2"},
        {"id": 20, "question": "Failing to stop at railway crossing", "description": "How many demerit points?", "answer": "3"},
        {"id": 21, "question": "Crowding driver's seat (too many passengers)", "description": "How many demerit points?", "answer": "2"},
        {"id": 22, "question": "Failing to obey police officer", "description": "How many demerit points?", "answer": "3"},
        {"id": 23, "question": "Driving on closed road", "description": "How many demerit points?", "answer": "3"},
        {"id": 24, "question": "Improper backing", "description": "How many demerit points?", "answer": "2"},
        {"id": 25, "question": "Driving without proper license", "description": "How many demerit points?", "answer": "0"},
        {"id": 26, "question": "Driving without insurance", "description": "How many demerit points?", "answer": "0"},
        {"id": 27, "question": "Distracted driving (phone use)", "description": "How many demerit points?", "answer": "3"},
        {"id": 28, "question": "Failing to share road with cyclist", "description": "How many demerit points?", "answer": "2"},
        {"id": 29, "question": "Unsafe lane driving", "description": "How many demerit points?", "answer": "2"},
        {"id": 30, "question": "Failing to stop before turning right on red", "description": "How many demerit points?", "answer": "3"}
    ])

@api.route("/questions-signs")
def get_sign_questions_answers():
    return jsonify([
        {"id": 1, "question": "What does this sign mean?", "description": "Left turn sign", "answer": "Left turn ahead", "image": "left_turn_ahead.png"},
        {"id": 2, "question": "What does this sign mean?", "description": "Traffic light sign", "answer": "Traffic signal ahead", "image": "traffic_signal_ahead.png"},
        {"id": 3, "question": "What does this sign mean?", "description": "Yield sign", "answer": "Yield ahead", "image": "yield_ahead.png"},
        {"id": 4, "question": "What does this sign mean?", "description": "Stop sign warning", "answer": "Stop ahead", "image": "stop_ahead.png"},
        {"id": 5, "question": "What does this sign mean?", "description": "Divided road sign", "answer": "Divided highway begins", "image": "divided_highway_begins.png"},
        {"id": 6, "question": "What does this sign mean?", "description": "School bus sign", "answer": "School bus stop ahead", "image": "school_bus_stop_ahead.png"},
        {"id": 7, "question": "What does this sign mean?", "description": "Roundabout sign", "answer": "Roundabout ahead", "image": "roundabout_ahead.png"},

        {"id": 8, "question": "What does this sign mean?", "description": "U-turn prohibition", "answer": "No U-turn", "image": "no_u_turn.png"},
        {"id": 9, "question": "What does this sign mean?", "description": "School crossing sign", "answer": "School crossing", "image": "school_crossing.png"},
        {"id": 10, "question": "What does this sign mean?", "description": "No straight movement", "answer": "No straight through", "image": "no_straight_through.png"},
        {"id": 11, "question": "What does this sign mean?", "description": "Directional arrows", "answer": "Turn left or right only", "image": "two_way_turn_options.png"},
        {"id": 12, "question": "What does this sign mean?", "description": "Do not enter sign", "answer": "Do not enter", "image": "do_not_enter.png"},
        {"id": 13, "question": "What does this sign mean?", "description": "No left turn sign", "answer": "No left turn", "image": "no_left_turn.png"},
        {"id": 14, "question": "What does this sign mean?", "description": "Parking restriction", "answer": "No parking", "image": "no_parking.png"},

        {"id": 15, "question": "What does this sign mean?", "description": "Right turn sign", "answer": "Right turn ahead", "image": "right_turn_ahead.png"},
        {"id": 16, "question": "What does this sign mean?", "description": "Bicycle sign", "answer": "Bicycle crossing", "image": "bicycle_crossing.png"},
        {"id": 17, "question": "What does this sign mean?", "description": "Clearance sign", "answer": "Low clearance 12 feet 6 inches", "image": "low_clearance_12ft_6in.png"},
        {"id": 18, "question": "What does this sign mean?", "description": "Bump sign", "answer": "Speed bump ahead", "image": "speed_bump_ahead.png"},
        {"id": 19, "question": "What does this sign mean?", "description": "Merge sign", "answer": "Merge from right", "image": "merge_from_right.png"},
        {"id": 20, "question": "What does this sign mean?", "description": "Skid warning", "answer": "Slippery when wet", "image": "slippery_when_wet.png"},
        {"id": 21, "question": "What does this sign mean?", "description": "Two-way traffic", "answer": "Two-way traffic", "image": "two_way_traffic.png"},

        {"id": 22, "question": "What does this sign mean?", "description": "Pedestrian restriction", "answer": "No pedestrians", "image": "no_pedestrians.png"},
        {"id": 23, "question": "What does this sign mean?", "description": "Passing restriction", "answer": "No passing", "image": "no_passing.png"},
        {"id": 24, "question": "What does this sign mean?", "description": "Bike route sign", "answer": "Bicycle route", "image": "bicycle_route.png"},
        {"id": 25, "question": "What does this sign mean?", "description": "Truck route sign", "answer": "Truck route", "image": "truck_route.png"},
        {"id": 26, "question": "What does this sign mean?", "description": "Construction sign", "answer": "Road work ahead", "image": "road_work_ahead.png"},
        {"id": 27, "question": "What does this sign mean?", "description": "Narrow bridge sign", "answer": "Narrow bridge", "image": "narrow_bridge.png"},
        {"id": 28, "question": "What does this sign mean?", "description": "Lane ends sign", "answer": "Right lane ends merge left", "image": "right_lane_ends_merge_left.png"}
    ])


