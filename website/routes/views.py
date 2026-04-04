from flask import Blueprint, render_template
from flask_login import current_user, login_required

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template("home.html", current_user=current_user)

@views.route('/start-test')
@login_required
def start_test():
    return render_template("start.html", current_user=current_user)

@views.route('/practice-mode')
def practice():
    return render_template("practice.html", current_user=current_user)

@views.route('/practice-mode/flashcards')
def flashcard():
    return render_template("flashcard.html", current_user=current_user)

@views.route('/practice-mode/answersheet')
def answersheet():
    return render_template("answersheet.html", current_user=current_user
                           )
@views.route('/practice-mode/quiz')
def quiz():
    return render_template("quiz.html", current_user=current_user)