from flask import Blueprint, render_template, request, flash, redirect, url_for
from ..models.models import User, Progress
from werkzeug.security import generate_password_hash, check_password_hash
from .. import db, login_manager
from flask_login import LoginManager, login_user, login_required, logout_user, current_user


auth = Blueprint('auth', __name__)




@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()
        if len(email) == 0:
            flash("Email can not be empty", category='error')
        elif user:
            if check_password_hash(user.password, password):
                flash('Logged in successfully!', category='success')
                login_user(user, remember=True)
                return redirect(url_for('views.home'))
            else:
               flash("Incorrect password", category='error')
        else:
            flash("Email does not exist", category='error')
    return render_template("login.html", user=current_user)

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        password2 = request.form.get('password2')
        user = User.query.filter_by(email=email).first()

        if user:
            flash("User already exists", category='error')
        elif len(username) == 0:
            flash("Username can not be empty", category='error')
        elif len(username) < 4:
            flash("Username must be greater than 4 characters", category='error')
        elif len(email) == 0:
            flash("Email can not be empty", category='error')
        elif len(password) < 8:
            flash("Password too short. Must be atleast 8 characters", category='error')
        elif password2 != password:
            flash("Passwords do not match", category='error')
        else:
            new_user = User(email=email, username=username, password=generate_password_hash(password, method="scrypt", salt_length=16))
            db.session.add(new_user)
            db.session.commit()
            flash("Account created succesfully", category='success')
            return redirect(url_for('views.home'))
    return render_template("signup.html", user=current_user)

@auth.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == 'POST':
        data = request.get_json()
        
        user_id = current_user.id
        percentage = data.get('percentage')
        score = data.get('score')

        if percentage:
            new_progress = Progress(percentage=percentage, score=score, user_id=user_id)
            db.session.add(new_progress)
            db.session.commit()
            flash("Progress saved successfully!", category='success')

    # Get the latest progress
    latest_progress = Progress.query.filter_by(user_id=current_user.id).order_by(Progress.id.desc()).first()
    return render_template("profile.html", current_user=current_user, progress=latest_progress)
