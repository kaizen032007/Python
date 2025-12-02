import pandas as pd
import sys
import time

#THIS IS MY PROJECT ABOUT DATA LISTING USING PANDAS 

employee_data = {
    'Name': ["Jaemark", "Kaeleen", "Justine", "Angel"],
    'Age': ["18", "18", "18", "25"],
    'Place': ["Manila", "Cavite", "Manila", "Dubai"]
}
df = pd.DataFrame(employee_data)
df.index.name = 'ID'
df['ID'] = range(1, len(df) + 1)
df = df[['ID', 'Name', 'Age', 'Place']]


def exitTime(message, delay=3):
    """Displays a countdown and then exits the program."""
    print(f"\n{message}")
    
    for i in range(delay, 0, -1):
        print(f"Exiting in {i} seconds...", end='\r', flush=True)
        time.sleep(1)
    
    print("Exited successfully.         ")
    sys.exit()

def optionsUser():
    """Displays the main menu options."""
    print("="*15)
    print("  DATA PORTAL")
    print("="*15)
    options = ["1. Employee Names", "2. Developer Options", "3. Exit"]
    for x in options:
        print(x)
    print("-" * 15)

def employeeNames():
    """Displays employee data and handles sub-menu."""
    global df
    print("\n--- Welcome To Employee Data ---")
    
    print(df.to_markdown(index=False))

    while True:
        Choice = ["\n1. Go Back", "2. Exit"]
        for y in Choice:
            print(y)
            
        userChoice = input("Enter: ")
        if userChoice == "1":
            break 
        elif userChoice == "2":
            exitTime("Data Portal Closing Down") 
        else:
            print("Invalid Input")

def devOptions():
    """Validation and Entry point for developer access."""
    print("WARNING!!! DEVELOPER ONLY")

    print("Welcome To Developer Options")
    
    while True:
        devValidation = input("Are you developer? (y/n): ")
        if devValidation.lower() == "n":
            break
        elif devValidation.lower() == "y":
            if userValidation():
                developerMenu()
            break
        else:
            print("Invalid Input")

def userValidation():
    """Handles username and password check."""
    username = input("Please Enter Your Username: ")
    password = input("Please Enter Your Password: ")

    if username == "admin" and password == "admin123":
        print("Access Granted!")
        return True
    else:
        print("Access Denied")
        exitTime("Must be a developer to enter")
        return False
    
def addEmployee():
    """Prompts for new employee data and adds the row."""
    global df
    print("\n--- ADD NEW EMPLOYEE ---")
    
    try:
        new_name = input("Enter Name: ")
        new_age = input("Enter Age: ")
        new_place = input("Enter Place: ")
        
        next_id = df['ID'].max() + 1 if not df.empty else 1
        
        new_employee_data = {
            'ID': [next_id],
            'Name': [new_name],
            'Age': [new_age],
            'Place': [new_place]
        }
        df_new_row = pd.DataFrame(new_employee_data)
        
        df = pd.concat([df, df_new_row], ignore_index=True)
        df['ID'] = range(1, len(df) + 1)
        print(f"Successfully added {new_name}.")

    except Exception as e:
        print(f"An error occurred: {e}")

def deleteEmployee():
    """Deletes an employee based on their ID."""
    global df
    if df.empty:
        print("The employee list is empty.")
        return

    print("\n--- DELETE EMPLOYEE ---")
    print(df[['ID', 'Name']].to_markdown(index=False))
    
    try:
        del_id = int(input("Enter ID of employee to delete: "))
        
        if del_id in df['ID'].values:
            index_to_drop = df[df['ID'] == del_id].index
            
            df = df.drop(index_to_drop)
            df = df.reset_index(drop=True)
            df['ID'] = range(1, len(df) + 1)
            
            print(f"Successfully deleted employee with ID {del_id}.")
        else:
            print(f"ID {del_id} not found.")
    
    except ValueError:
        print("Invalid input. Please enter a number for the ID.")

def searchEmployee():
    """Searches employee data by name."""
    global df
    print("\n--- SEARCH EMPLOYEE ---")
    search_term = input("Enter name to search: ").strip()
    
    results = df[df['Name'].str.contains(search_term, case=False, na=False)]
    
    if not results.empty:
        print(f"\n--- Search Results for '{search_term}' ---")
        print(results.to_markdown(index=False))
    else:
        print(f"No employees found matching '{search_term}'.")


def developerMenu():
    """The main loop for developer operations."""
    global df
    while True:
        print("\n--- DEVELOPER MENU ---")
        print(df.to_markdown(index=False)) 
        
        dev_options = [
            "1. Add Employee", 
            "2. Delete Employee (by ID)", 
            "3. Search Employee (by Name)",
            "4. Go Back"
        ]
        for opt in dev_options:
             print(opt)
        
        dev_choice = input("Enter option: ")
        
        if dev_choice == "1":
            addEmployee()
        elif dev_choice == "2":
            deleteEmployee()
        elif dev_choice == "3":
            searchEmployee()
        elif dev_choice == "4":
            print("Returning to Main Menu.")
            break 
        else:
            print("Invalid option.")

optionsUser()

while True:
    userOptions = input("Enter: ")
    if userOptions == "1":
        employeeNames()
        optionsUser()
    elif userOptions == "2":
        devOptions()
        optionsUser()
    elif userOptions == "3":
        exitTime("The system will be closing.")
    else:
        print("Invalid Input")
