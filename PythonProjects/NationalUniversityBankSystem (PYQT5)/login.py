import sys
import os
from registration import MainWindow
from PyQt5.QtWidgets import (
    QApplication, QWidget, QLabel, QLineEdit, QPushButton, QCheckBox,
    QHBoxLayout, QVBoxLayout, QFrame, QMessageBox, QAction
)
from PyQt5.QtGui import QFont, QIcon, QPixmap
from PyQt5.QtCore import Qt, QSize

def resource_path(relative_path):
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    
    return os.path.join(base_path, relative_path)

class LoginPage(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("NU Bank Center")
        self.setFixedSize(870, 600)
        self.setStyleSheet("background-color: white;")

        main_layout = QHBoxLayout(self)
        main_layout.setContentsMargins(0, 0, 0, 0)

        left_frame = QLabel()
        pixmap = QPixmap(resource_path("NU_BG.jpg"))
        left_frame.setPixmap(pixmap.scaled(1000, 600, Qt.KeepAspectRatioByExpanding, Qt.SmoothTransformation))
        left_frame.setStyleSheet("border: none;")
        left_frame.setFixedWidth(500)

        right_frame = QFrame()
        right_frame.setStyleSheet("""
            QFrame {
                background: white;
                border-top-left-radius: 25px;
                border-bottom-left-radius: 25px;
            }
        """)
        right_frame.setFixedWidth(360)
        right_layout = QVBoxLayout(right_frame)
        right_layout.setContentsMargins(50, 50, 50, 50)
        right_layout.setSpacing(15)

        title = QLabel("Log in", right_frame)
        title.setFont(QFont("Arial", 24, QFont.Bold))
        title.setStyleSheet("color: black;")
        right_layout.addWidget(title, alignment=Qt.AlignLeft)

        self.username_entry = QLineEdit()
        self.username_entry.setPlaceholderText("  Username")
        self.username_entry.setStyleSheet("""
            QLineEdit {
                border: 2px solid #e0e0e0;
                border-radius: 20px;
                padding: 10px;
                background-color: #f8f8f8;
                font-size: 14px;
            }
            QLineEdit:focus {
                border: 2px solid #1a73e8;
                background-color: white;
            }
        """)
        right_layout.addWidget(self.username_entry)

        self.password_entry = QLineEdit()
        self.password_entry.setPlaceholderText("  Password")
        self.password_entry.setEchoMode(QLineEdit.Password)
        self.password_entry.setStyleSheet("""
            QLineEdit {
                border: 2px solid #e0e0e0;
                border-radius: 20px;
                padding: 10px;
                background-color: #f8f8f8;
                font-size: 14px;
            }
            QLineEdit:focus {
                border: 2px solid #1a73e8;
                background-color: white;
            }
        """)
        right_layout.addWidget(self.password_entry)

        self.show_password_action = QAction(QIcon(resource_path("eye.jpg")), "Show/Hide", self)
        self.show_password_action.triggered.connect(self.toggle_password)
        self.password_entry.addAction(self.show_password_action, QLineEdit.TrailingPosition)
        
        options_layout = QHBoxLayout()
        self.remember_me = QCheckBox("Remember Me")
        forgot_pass = QLabel("<a href='#'>Forgot Password?</a>")
        forgot_pass.setOpenExternalLinks(False)
        forgot_pass.linkActivated.connect(self.forgot_password)
        forgot_pass.setStyleSheet("color: gray; font-size: 12px;")
        options_layout.addWidget(self.remember_me)
        options_layout.addStretch()
        options_layout.addWidget(forgot_pass)
        right_layout.addLayout(options_layout)

        login_btn = QPushButton("Log In")
        login_btn.setStyleSheet("""
            QPushButton {
                background-color: black;
                color: white;
                border-radius: 20px;
                padding: 12px;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #333333;
            }
        """)
        login_btn.clicked.connect(self.login)
        right_layout.addWidget(login_btn)

        sep = QLabel("──────────  Or  ──────────")
        sep.setStyleSheet("color: gray; font-size: 12px;")
        sep.setAlignment(Qt.AlignCenter)
        right_layout.addWidget(sep)

        signup_btn = QPushButton("Sign up")
        signup_btn.setStyleSheet("""
            QPushButton {
                border: 2px solid black;
                border-radius: 20px;
                padding: 10px;
                background-color: white;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #f0f0f0;
            }
        """)
        signup_btn.clicked.connect(self.signup)
        right_layout.addWidget(signup_btn)

        teams_btn = QPushButton("Continue with Teams")
        teams_btn.setIcon(QIcon(resource_path("teams.jpg")))
        teams_btn.clicked.connect(lambda: self.social_login("Teams"))
        google_btn = QPushButton("Continue with Google")
        google_btn.setIcon(QIcon(resource_path("google.jpg")))
        google_btn.clicked.connect(lambda: self.social_login("Google"))
        microsoft_btn = QPushButton("Continue with Microsoft")
        microsoft_btn.setIcon(QIcon(resource_path("microsoft.jpg")))
        microsoft_btn.clicked.connect(lambda: self.social_login("Microsoft"))

        for btn in [teams_btn, google_btn, microsoft_btn]:
            btn.setStyleSheet("""
                QPushButton {
                    background-color: #f1f1f1;
                    border-radius: 20px;
                    padding: 10px;
                    text-align: left;
                }
                QPushButton:hover {
                    background-color: #e6e6e6;
                }
            """)
            btn.setIconSize(QSize(20, 20))
            right_layout.addWidget(btn)

        main_layout.addWidget(left_frame)
        main_layout.addWidget(right_frame)

    def login(self):
            import json  
            username = self.username_entry.text().strip().lower()
            password = self.password_entry.text().strip()

            file_path = resource_path("users.json")

            if not os.path.exists(file_path):
                QMessageBox.warning(self, "Error", "No registered users found. Please sign up first.")
                return

            
            with open(file_path, "r") as file:
                try:
                    users = json.load(file)
                except json.JSONDecodeError:
                    users = []

       
            for user in users:
                first = user.get('first_name', '').strip().lower()
                last = user.get('last_name', '').strip().lower()
                phone = str(user.get('phone', '')).strip()
                pwd = str(user.get('password', '')).strip()

            if password == pwd and (username == f"{first} {last}" or username == first or username == phone):
                QMessageBox.information(self, "Success", f"Welcome {user.get('first_name')} {user.get('last_name')}!")
                return  # exit after successful login

        
            QMessageBox.warning(self, "Error", "Invalid username or password.")



    def signup(self):
         self.registration_window = MainWindow()  
         self.registration_window.show()         
         self.close() 

    def forgot_password(self):
        QMessageBox.information(self, "Forgot Password", "Password recovery instructions sent!")

    def social_login(self, platform):
        QMessageBox.information(self, f"{platform} Login", f"Logging in with {platform}...")
        
    def toggle_password(self):
        if self.password_entry.echoMode() == QLineEdit.Password:
            self.password_entry.setEchoMode(QLineEdit.Normal)
        else:
            self.password_entry.setEchoMode(QLineEdit.Password)

def main():
    app = QApplication(sys.argv)
    window = LoginPage()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
