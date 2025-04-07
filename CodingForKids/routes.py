from flask import Blueprint, render_template, request, jsonify, session, redirect, url_for
from flask_login import login_required, login_user, logout_user, current_user
from models import db, bcrypt, User, Progress

# Create a Blueprint for routes
main = Blueprint("main", __name__)

# MAIN PAGES

@main.route("/")
@main.route("/lobby")
def lobby():
    """The main or 'lobby' page."""
    return render_template("lobby.html")

@main.route('/gameLobby')
@login_required
def game_lobby():
    """Ensure only logged-in users can access gameLobby."""
    if not current_user.is_authenticated:
        print("Unauthorized access attempt! Redirecting to login.")
        return redirect(url_for("main.lobby"))
    return render_template("gameLobby.html")

@main.route('/quizLobby')
@login_required
def quiz_lobby():
    """Ensure only logged-in users can access gameLobby."""
    if not current_user.is_authenticated:
        print("Unauthorized access attempt! Redirecting to login.")
        return redirect(url_for("main.lobby"))
    return render_template("quizLobby.html")

@main.route('/quiz')
@login_required
def quiz():
    if not current_user.is_authenticated:
        print("Unauthorized access attempt! Redirecting to login.")
        return redirect(url_for("main.lobby"))
    quiz_id = request.args.get("quiz", "quiz_1")
    return render_template("quiz.html", quiz=quiz_id)


@main.route('/game')
@login_required
def game():
    """Ensure only logged-in users can access the game."""
    if not current_user.is_authenticated:
        print("Unauthorized access attempt! Redirecting to login.")
        return redirect(url_for("main.lobby"))
    level = request.args.get("level", "tutorial")  # default to tutorial
    return render_template("game.html", level=level)

# AUTHENTICATION ROUTES

@main.route('/check_session')
def check_session():
    """Checks if the user is logged in."""
    if current_user.is_authenticated:
        return jsonify({"logged_in": True})
    else:
        return jsonify({"logged_in": False}), 401


@main.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    year_of_school = data.get("year_of_school")

    if not username or not email or not password or not year_of_school:
        return jsonify({"error": "All fields are required"}), 400

    # Check for existing username/email
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username is already in use"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email is already in use"}), 400

    # Hash the password, create a new user
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(username=username, email=email, password=hashed_password, year_of_school=year_of_school)
    db.session.add(new_user)
    db.session.commit()

    # Create initial progress record
    new_progress = Progress(
        user_id=new_user.id,
        tutorial=False,
        level_1=False,
        level_2=False,
        level_3=False,
        level_4=False
    )
    db.session.add(new_progress)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201

@main.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)

        # Ensure the user has a progress record
        progress = Progress.query.filter_by(user_id=user.id).first()
        if not progress:
            progress = Progress(user_id=user.id)
            db.session.add(progress)
            db.session.commit()

        return jsonify({
            "message": "Login successful",
            "progress": {
                "tutorial": progress.tutorial,
                "level_1": progress.level_1,
                "level_2": progress.level_2,
                "level_3": progress.level_3,
                "level_4": progress.level_4
            }
        }), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@main.route("/logout", methods=["GET"])
@login_required
def logout():
    logout_user()
    session.clear()
    return redirect(url_for("main.lobby"))

# PROGRESS ROUTES

@main.route("/get-progress", methods=["GET"])
@login_required
def get_progress():
    progress = Progress.query.filter_by(user_id=current_user.id).first()
    if not progress:
        return jsonify({"error": "Progress not found"}), 404

    return jsonify({
        "progress": {
            "tutorial": progress.tutorial,

            "level_1": progress.level_1,
            "level_1_score": progress.level_1_score,
            
            "level_2": progress.level_2,
            "level_2_score": progress.level_2_score,

            "level_3": progress.level_3,
            "level_3_score": progress.level_3_score,
            
            "level_4": progress.level_4,
            "level_4_score": progress.level_4_score,

            "quiz_1_score": progress.quiz_1_score,
            "quiz_2_score": progress.quiz_2_score,
            "quiz_3_score": progress.quiz_3_score,
            "quiz_4_score": progress.quiz_4_score
        }
    })


@main.route("/update-progress", methods=["POST"])
@login_required
def update_progress():
    data = request.json
    level = data.get("level")
    score = data.get("score")  

    progress = Progress.query.filter_by(user_id=current_user.id).first()
    if not progress:
        return jsonify({"error": "Progress record not found"}), 404
    # Level Logic
    if level == "tutorial":
        progress.tutorial = True
    elif level == "level_1":
        progress.level_1 = True
        if score is not None and (progress.level_1_score is None or score > progress.level_1_score):
            progress.level_1_score = score
    elif level == "level_2":
        progress.level_2 = True
        if score is not None and (progress.level_2_score is None or score > progress.level_2_score):
            progress.level_2_score = score
    elif level == "level_3":
        progress.level_3 = True
        if score is not None and (progress.level_3_score is None or score > progress.level_3_score):
            progress.level_3_score = score
    elif level == "level_4":
        progress.level_4 = True
        if score is not None and (progress.level_4_score is None or score > progress.level_4_score):
            progress.level_4_score = score
    # Quiz logic
    elif level == "quiz_1":
        if score is not None and (progress.quiz_1_score is None or score > progress.quiz_1_score):
            progress.quiz_1_score = score
    elif level == "quiz_2":
        if score is not None and (progress.quiz_2_score is None or score > progress.quiz_2_score):
            progress.quiz_2_score = score
    elif level == "quiz_3":
        if score is not None and (progress.quiz_3_score is None or score > progress.quiz_3_score):
            progress.quiz_3_score = score
    elif level == "quiz_4":
        if score is not None and (progress.quiz_4_score is None or score > progress.quiz_4_score):
            progress.quiz_4_score = score

    db.session.commit()

    print(f"Updated Progress for User {current_user.id}: {progress}")

    return jsonify({
        "message": f"{level} completed!",
        "progress": {
            "tutorial": progress.tutorial,
            "level_1": progress.level_1,
            "level_1_score": progress.level_1_score,

            "level_2": progress.level_2,
            "level_2_score": progress.level_2_score,

            "level_3": progress.level_3,
            "level_3_score": progress.level_3_score,

            "level_4": progress.level_4,
            "level_4_score": progress.level_4_score,
            
            "quiz_1_score": progress.quiz_1_score,
            "quiz_2_score": progress.quiz_2_score,
            "quiz_3_score": progress.quiz_3_score,
            "quiz_4_score": progress.quiz_4_score
        }
    })
