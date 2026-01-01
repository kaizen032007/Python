import sys
import os
from PyQt5.QtWidgets import (QMainWindow, QApplication, QPushButton, QLabel, QVBoxLayout, QLineEdit,
                             QHBoxLayout, QFrame, QMessageBox)
from PyQt5.QtGui import QFont, QPixmap
from PyQt5.QtCore import Qt

def resource_path(relative_path):
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    
    return os.path.join(base_path, relative_path)

class HomePage(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("HOMEPAGE")
        self.setFixedSize(1000, 550)
        
        self.balance = 0.0
        
        layout_background = QLabel(self)
        background = QPixmap(resource_path("homepagebg.jpg"))
        layout_background.setPixmap(background.scaled(self.width(), self.height(), Qt.KeepAspectRatioByExpanding, Qt.SmoothTransformation))
        layout_background.setGeometry(0, 0, self.width(), self.height())
        layout_background.lower()
        
        balance_box = QFrame(layout_background)
        balance_box.setGeometry(110, 100, 800, 150)
        balance_box.setStyleSheet("""
            QFrame {
                background-color: #2c3789;
                border-radius: 10px;
                border: 2px solid #3c48a1;
            }                            
                                  """)
        
        Balance_label = QLabel("ACCOUNT BALANCE:", layout_background)
        Balance_label.setFont(QFont("Arial", 30))
        Balance_label.setGeometry(120, 120, 500, 30)
        Balance_label.setStyleSheet("font-weight: bold; color: white;")
        
        self.balance_box = QLabel(self.show_balance(), layout_background)
        self.balance_box.setGeometry(120, 160, 500, 80)
        self.balance_box.setFont(QFont("Arial", 40))
        self.balance_box.setStyleSheet("""
              QLabel {
                  color: white;
                  background-color: #2c3789e;
                  border: 2px solid #e7e7e7;
              }                         
                                       """)
        
        self.withdraw_button = QPushButton("Withdraw", layout_background)
        self.withdraw_button.setGeometry(75, 390, 270, 100)
        self.withdraw_button.setFont(QFont("Arial", 25))
        self.withdraw_button.setStyleSheet("""
                QPushButton {
                    background-color: #2c3789;
                    color: white;
                    border: 2px solid #2c3789;
                    border-radius: 10px;
                }
                QPushButton:focus {
                    background-color: #293abb;
                }
                               """)

        self.input_withdraw = QLineEdit(layout_background)
        self.input_withdraw.setGeometry(60, 320, 300, 50)
        self.input_withdraw.setFont(QFont("Arial", 30))
        self.input_withdraw.setStyleSheet("""
                QLineEdit {
                    background-color: #7485cf; 
                    border-radius: 10px;
                    padding: 8px 12px;
                }
                                          """)
        self.withdraw_button.clicked.connect(self.withdraw)
        
        self.deposit_button = QPushButton("Deposit", layout_background)
        self.deposit_button.setGeometry(425, 390, 270, 100)
        self.deposit_button.setFont(QFont("Arial", 25))
        self.deposit_button.setStyleSheet("""
                QPushButton {
                    background-color: #2c3789;
                    color: white;
                    border: 2px solid #2c3789;
                    border-radius: 10px;
                }
                QPushButton:focus {
                    background-color: #293abb;
                }
                               """)

        self.input_deposit = QLineEdit(layout_background)
        self.input_deposit.setGeometry(410, 320, 300, 50)
        self.input_deposit.setFont(QFont("Arial", 30))
        self.input_deposit.setStyleSheet("""
                QLineEdit {
                    background-color: #7485cf; 
                    border-radius: 10px;
                    padding: 8px 12px;
                }
                                          """)
        self.deposit_button.clicked.connect(self.deposit)
        
        self.logout_button = QPushButton("Logout", layout_background)
        self.logout_button.setGeometry(750, 390, 200, 100)
        self.logout_button.setFont(QFont("Arial", 25))
        self.logout_button.setStyleSheet("""
            QPushButton {
                background-color: #d9534f;
                color: white;
                border: 2px solid #b52b27;
                border-radius: 10px;
            }
            QPushButton:focus {
                background-color: #c9302c;
            }
            """)
        self.logout_button.clicked.connect(self.logout)

    def show_balance(self):
        return f"PHP {self.balance:,.2f}"
    
    def deposit(self):
        try: 
            amount = float(self.input_deposit.text())
            if amount <= 0:
                raise ValueError 
              
            self.balance += amount
            self.balance_box.setText(self.show_balance())
            self.input_deposit.clear()
        except ValueError: 
            QMessageBox.warning(self, "Invalid Input", "Please enter a valid number.")
                           
            
    def withdraw(self):
        try:
            amount = float(self.input_withdraw.text())
            if amount <= 0:
                raise ValueError

            if self.balance >= amount:
                self.balance -= amount
                self.balance_box.setText(self.show_balance())
                self.input_withdraw.clear()
            else:
                QMessageBox.warning(self, "Insufficient Funds", "Not enough balance.")
        except ValueError:
            QMessageBox.warning(self, "Invalid Input", "Please enter a valid number.")
    
    def logout(self):
        self.close()
    
            
def main():
    app = QApplication(sys.argv)
    window = HomePage()
    window.show()
    sys.exit(app.exec())

if __name__ == "__main__":
    main()