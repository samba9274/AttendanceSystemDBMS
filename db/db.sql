-- CREATE DATABASE project;
-- CREATE USER 'dbms'@'localhost' IDENTIFIED BY 'dbms';
-- GRANT ALL PRIVILEGES ON project.* TO 'dbms'@'localhost'ALTER USER 'dbms'@'localhost' IDENTIFIED WITH mysql_native_password BY 'dbms';
-- USE project;
DROP TABLES classes, students, teachers, subjects, lectures, attendance;
DROP TRIGGER student_attendance_insert_trigger;
CREATE TABLE classes (
    class_id INT PRIMARY KEY AUTO_INCREMENT,
    class_name VARCHAR(20)
);
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    student_name VARCHAR(30),
    student_roll VARCHAR(20) UNIQUE,
    student_password VARCHAR(8),
    class_id INT,
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);
CREATE TABLE teachers (
    teacher_id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_name VARCHAR(30),
    teacher_username VARCHAR(15) UNIQUE,
    teacher_password VARCHAR(8)
);
CREATE TABLE subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(15),
    teacher_id INT,
    class_id INT,
    FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);
CREATE TABLE lectures (
    lecture_id INT PRIMARY KEY AUTO_INCREMENT,
    lecture_name VARCHAR(30),
    lecture_code VARCHAR(5) UNIQUE,
    lecture_start DATETIME,
    subject_id INT,
    attendees INT DEFAULT 0,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);
CREATE TABLE attendance (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,lecture_id INT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (lecture_id) REFERENCES lectures(lecture_id)
);
CREATE OR REPLACE TRIGGER student_attendance_insert_trigger
AFTER INSERT ON attendance FOR EACH ROW
BEGIN
    UPDATE lectures SET attendees = attendees + 1 WHERE lecture_id=NEW.lecture_id;
END;