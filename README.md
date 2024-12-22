# Student Saver

Student Saver is a financial budgeting application designed to help students streamline their budgeting process. It provides a seamless alternative to traditional tools like Excel by offering real-time visual representations of data without requiring sensitive personal information, such as SSNs or bank account details.

---

## Features

- **User-Friendly Interface**: Simple and intuitive design tailored for students.
- **Real-Time Data Visualization**: See your budgeting data come to life with interactive charts and graphs.
- **Privacy-Focused**: No personal information like Social Security Numbers or bank details is collected.
- **Seamless Experience**: Easily track expenses, income, and savings all in one place.
- **Accessible Anywhere**: Cloud-based functionality to access your budget from any device.

---

## Technologies Used

- **Backend**: Python with Django
- **Frontend**: HTML, CSS, and JavaScript
- **Data Visualization**: Google Charts API

---

## Getting Started

### Prerequisites

- Python installed on your local machine
- Django framework set up

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KanishkS1ngh/Capstone_Project.git
   ```
2. Navigate to the project directory:
   ```bash
   cd student-saver
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     SECRET_KEY=your_django_secret_key
     DEBUG=True
     DATABASE_URL=your_database_url
     ```
5. Run database migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

---

## Usage

1. Open the application in your browser (default: `http://127.0.0.1:8000`).
2. Create an account or log in.
3. Add your income, expenses, and savings data.
4. View and analyze your budget using real-time visualizations.

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Thanks to all contributors and users who provide feedback to improve this application.

---
