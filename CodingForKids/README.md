# Educational Coding Game

This is a web-based educational game designed to teach beginner programming concepts using a block-based interface. Built for classroom use, it introduces variables, conditionals, loops, and functions through fun, structured lessons and quizzes.

## Live Version
You can access the hosted version of the game at:  
https://marcgallacher.pythonanywhere.com

## Features
- Blockly drag-and-drop coding environment
- Curriculum-aligned lessons for beginner developers (P6-S2 level)
- Python code dual view along with block tasks
- Account system with progress tracking
- Quiz mode to test understanding
- Hint and solution support
- Free Play mode for experimentation

---

## Running Locally

### Requirements
- Python 3.9 or later
- pip (Python package installer)
- PostgreSQL installed (if connecting to a local database)

### 1. Create a Virtual Environment (Optional but Recommended)
```bash
python -m venv venv
source venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
Ensure `config.py` is set up for your local environment. The app uses PostgreSQL for local development. You may need to create a `.env` or modify the database URI inside `config.py`. Also, if using outside of the university network (eduroam), FortiClient VPN will have to be used to access the PostgreSQL database. 

### 4. Run the Application
```bash
python run.py
```

Then open:  
http://127.0.0.1:5000

---

## Developer Notes


### Database Migrations (Flask-Migrate)
If you make changes to `models.py`, you can apply them with:
```bash
flask db migrate -m "Your message"
flask db upgrade
```

### Folder Structure
- `run.py` - Entry point
- `app.py` - App factory setup
- `models.py` - SQLAlchemy models
- `routes.py` - All route logic
- `templates/` - HTML templates
- `static/` - JavaScript, CSS, Blockly files

---

## Login Info
You can register a new user using the "Create Account" option when the app launches. Login is required to access game features.

---

## Support
For any issues running the project locally or accessing features, please contact:  
marc.gallacher.2021@uni.strath.ac.uk