import sys
import json
import os
from homepage import HomePage
from PyQt5.QtWidgets import QApplication, QMainWindow, QLabel, QLineEdit, QAction, QComboBox, QPushButton, QMessageBox
from PyQt5.QtGui import QIcon, QFont, QIntValidator
from PyQt5.QtCore import Qt

def resource_path(relative_path):
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    
    return os.path.join(base_path, relative_path)

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("UNBANK")
        self.setFixedSize(700, 700)
        self.setWindowIcon(QIcon(resource_path("background1.png")))

        label = QLabel("Welcome! NU BANK GROUP - ACCOUNT", self)
        label.setFont(QFont("Arial", 20))
        label.setGeometry(0, 0, 700, 80)
        label.setStyleSheet("color: blue; font-weight: bold;")
        label.setAlignment(Qt.AlignCenter)
        
        registration_name = QLabel("Please Register Your Account Here!", self)
        registration_name.setFont(QFont("Arial", 15))
        registration_name.setGeometry(196, 80, 500, 20)
        registration_name.setStyleSheet("color: blue; font-weight; bold; font-style: italic;")

        self.first_name_label = QLabel("First Name:", self)
        self.first_name_label.setFont(QFont("Arial", 15))
        self.first_name_label.setGeometry(150, 130, 120, 30)

        self.first_name_input = QLineEdit(self)
        self.first_name_input.setGeometry(260, 125, 300, 40)
        self.first_name_input.setPlaceholderText("Enter your first name")
        self.first_name_input.setStyleSheet("""
            QLineEdit {
                border: 2px solid #0078d7;
                border-radius: 20px;      
                padding: 8px 15px;
                background-color: white;
                font-size: 14px;
            }
            QLineEdit:focus {
                border: 2px solid #005a9e;
                background-color: #f0f8ff;
            }
        """)
        username_warning = QLabel("Note: Make sure to put letters only", self)
        username_warning.setGeometry(260, 170, 300, 20)  # Move below the input
        username_warning.setFont(QFont("arial", 8))
        username_warning.setStyleSheet("color: red; font-weight: bold; font-style: italic")
        
        lastname = QLabel("Last Name:", self)
        lastname.setGeometry(150, 200, 300, 40)
        lastname.setFont(QFont("arial", 15))
        
        self.lastname_input = QLineEdit(self)
        self.lastname_input.setGeometry(260, 200, 300, 40)
        self.lastname_input.setPlaceholderText("Enter your Last Name")
        self.lastname_input.setStyleSheet("""
           QLineEdit {
               border: 2px solid #0078d7;
               border-radius: 20px;
               padding: 8px 15px;
               background-color: white;
               font-size: 14px;
            }   
            QLineEdit:focus {
                border: 2px solid #005a9e;
                background-color: #f0f8ff;
            }                       
                                     """)
        lastname_warning = QLabel("Note: Make sure to put letters only", self)
        lastname_warning.setGeometry(260, 245, 300, 20)  # Move below the input
        lastname_warning.setFont(QFont("arial", 8))
        lastname_warning.setStyleSheet("color: red; font-weight: bold; font-style: italic;")
        
        age = QLabel("Age:", self)
        age.setGeometry(210, 270, 200, 40)
        age.setFont(QFont('arial', 15))
        
        self.age_input = QLineEdit(self)
        self.age_input.setGeometry(263, 270, 140, 40)
        self.age_input.setPlaceholderText("Enter Your Age")
        self.age_input.setValidator(QIntValidator(1, 120))
        self.age_input.setStyleSheet("""
           QLineEdit {
               border: 2px solid #0078d7;
               border-radius: 20px;
               padding: 8px 15px;
               background-color: white;
               font-size: 14px;
           }
           QLineEdit:focus {
               border: 2px solid #005a9e;
               background-color: #f0f8ff;
           }
        """)

        password_name = QLabel("Password:", self)
        password_name.setGeometry(159, 330, 300, 50)
        password_name.setFont(QFont("arial", 15))
        
        self.password_input = QLineEdit(self)
        self.password_input.setGeometry(263, 330, 300, 50)
        self.password_input.setPlaceholderText("Enter your Password")
        self.password_input.setEchoMode(QLineEdit.Password)
        self.password_input.setStyleSheet("""
            QLineEdit {
                border: 2px solid #0078d7;
                border-radius: 20px;
                padding: 4px 10px;
                background-color: white;
                font-size: 14px;
            }
            QLineEdit:focus {
                border: 2px solid #005a9e;
                background-color: #f0f8ff;
            }
        """)
        
        self.show_password_action = QAction(QIcon(resource_path("eye.jpg")), "Show/Hide", self)
        self.show_password_action.triggered.connect(self.toggle_password)
        self.password_input.addAction(self.show_password_action, QLineEdit.TrailingPosition)

        phone_label = QLabel("Phone Number:", self)
        phone_label.setGeometry(117, 395, 200, 50)
        phone_label.setFont(QFont("Arial", 15))
        
        self.phone_input = QLineEdit(self)
        self.phone_input.setGeometry(265, 395, 300, 50)
        self.phone_input.setPlaceholderText("Enter your Phone Number ex: 9123456789")
        self.phone_input.setValidator(QIntValidator(1, 1000000000))
        self.phone_input.setStyleSheet("""
            QLineEdit {
                border: 2px solid #0078d7;
                border-radius: 20px;
                padding: 4px 10px;
                background-color: white;
                font-size: 14px;
            }                     
            QLineEdit:focus {
                border: 2px solid #0078d7;
                background-color: #f0f8ff;
            }                      
                                  """)
        
        country_label = QLabel("Country:", self)
        country_label.setGeometry(178, 460, 300, 50)
        country_label.setFont(QFont("arial", 15))
        
        self.country_input = QComboBox(self)
        self.country_input.setGeometry(265, 465, 150, 40)
        self.country_input.setStyleSheet("""
             QComboBox {
                 border: 2px solid #0078d7;
                 border-radius: 15px;
                 padding: 5px 10px;
                 background-color: white;
                 font-size: 14px;
             }                            
              QComboBox:focus {
                border: 2px solid #005a9e;
                background-color: #f0f8ff;
             }               
              QComboBox::drop-down {
                border: 0px;
             }
              QComboBox::down-arrow {
                image: none;
                width: 0px;
                height: 0px;
             }
              QComboBox QAbstractItemView {
                 border: 2px solid #0078d7;
                 border-radius: 15px;   
                 selection-background-color: yellow;
                 selection-color: black;
                 padding: 5px;
                 background: white;
             }                          
                 """)
        
        countries = [ "Select Country", "Philippines", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi","Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo, Democratic Republic of the", "Congo, Republic of the", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
            "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy","Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg","Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
            "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway","Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Poland", "Portugal","Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
            "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
            "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
            "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe" ]
        
        self.country_input.addItems(countries)
        self.country_input.setCurrentIndex(0)

        self.register_button = QPushButton("Register", self)
        self.register_button.setGeometry(210, 550, 300, 50)
        self.register_button.setFont(QFont("arial", 20))
        self.register_button.setStyleSheet("""
           QPushButton {
               border: 2px solid #0078d7;
               border-radius: 15px; 
               padding: 5px 10px;
               background-color: white;
               font-weight: bold;
           }                                
           QPushButton:focus {
               border: 2px solid #005a9e;
               background-color: #f0f8ff; 
           }                             
             """)
        self.register_button.clicked.connect(self.register_user)  # <-- Add this line
        
    def toggle_password(self):
         if self.password_input.echoMode() == QLineEdit.Password:
            self.password_input.setEchoMode(QLineEdit.Normal)  
         else:
            self.password_input.setEchoMode(QLineEdit.Password)  
            
    def register_user(self):
        first_name = self.first_name_input.text().strip()
        last_name = self.lastname_input.text().strip()
        age = self.age_input.text().strip()
        password = self.password_input.text().strip()
        phone = self.phone_input.text().strip()
        country = self.country_input.currentText()

        # --- Validation ---
        if not first_name or not last_name or not age or not password or not phone or country == "Select Country":
            QMessageBox.warning(self, "Error", "Please fill all fields correctly!")
            return

        # --- Save to JSON ---
        user_data = {
            "first_name": first_name,
            "last_name": last_name,
            "age": age,
            "password": password,
            "phone": phone,
            "country": country
        }

        file_path = resource_path("users.json")

        # If file exists, read data, else start with empty list
        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                try:
                    data = json.load(file)
                except:
                    data = []
        else:
            data = []

        # Append new user
        data.append(user_data)

        # Save updated data
        with open(file_path, "w") as file:
            json.dump(data, file, indent=4)

        QMessageBox.information(self, "Success", f"Account Registered for {first_name} {last_name}!")

        # Clear inputs
        self.first_name_input.clear()
        self.lastname_input.clear()
        self.age_input.clear()
        self.password_input.clear()
        self.phone_input.clear()
        self.country_input.setCurrentIndex(0)   
        
        self.homepage = HomePage()
        self.homepage.show()
        self.close()
        
def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()
