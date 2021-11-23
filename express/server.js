const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const randomString = require("random-string");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { query } = require("express");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PROJECT_WEB_PORT;

const jwt_secret = process.env.PROJECT_JWT_SECRET;

const connection = mysql.createConnection({
  host: process.env.PROJECT_DB_HOST,
  user: process.env.PROJECT_DB_USERNAME,
  password: process.env.PROJECT_DB_PASSWORD,
  database: process.env.PROJECT_DB_DATABASE,
  port: process.env.PROJECT_DB_PORT,
  multipleStatements: true,
});

connection.connect();

app.get("/", (req, res) => res.send("Server ready"));

app.get("/reset", (req, res) => {
  connection.query("DROP TABLES attendance", (error, results, fields) => {
    if (error) console.error(error);
  });
  connection.query("DROP TABLES lectures", (error, results, fields) => {
    if (error) console.error(error);
  });
  connection.query("DROP TABLES subjects", (error, results, fields) => {
    if (error) console.error(error);
  });
  connection.query("DROP TABLES teachers", (error, results, fields) => {
    if (error) console.error(error);
  });
  connection.query("DROP TABLES students", (error, results, fields) => {
    if (error) console.error(error);
  });
  connection.query("DROP TABLES classes", (error, results, fields) => {
    if (error) console.error(error);
  });
  connection.query(
    "DROP TRIGGER student_attendance_insert_trigger",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TABLE classes (class_id INT PRIMARY KEY AUTO_INCREMENT,class_name VARCHAR(20))",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TABLE students (student_id INT PRIMARY KEY AUTO_INCREMENT,student_name VARCHAR(30),student_roll VARCHAR(20) UNIQUE,student_password VARCHAR(8),class_id INT,FOREIGN KEY (class_id) REFERENCES classes(class_id))",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TABLE teachers (teacher_id INT PRIMARY KEY AUTO_INCREMENT,teacher_name VARCHAR(30),teacher_username VARCHAR(15) UNIQUE,teacher_password VARCHAR(8))",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TABLE subjects (subject_id INT PRIMARY KEY AUTO_INCREMENT,subject_name VARCHAR(15),teacher_id INT,class_id INT,FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),FOREIGN KEY (class_id) REFERENCES classes(class_id))",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TABLE lectures (lecture_id INT PRIMARY KEY AUTO_INCREMENT,lecture_name VARCHAR(30),lecture_code VARCHAR(5) UNIQUE,lecture_start DATETIME,subject_id INT,attendees INT DEFAULT 0,FOREIGN KEY (subject_id) REFERENCES subjects(subject_id))",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TABLE attendance (attendance_id INT PRIMARY KEY AUTO_INCREMENT,student_id INT,lecture_id INT,FOREIGN KEY (student_id) REFERENCES students(student_id),FOREIGN KEY (lecture_id) REFERENCES lectures(lecture_id))",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TRIGGER student_attendance_insert_trigger AFTER INSERT ON attendance FOR EACH ROW BEGIN UPDATE lectures SET attendees = attendees + 1 WHERE lecture_id=NEW.lecture_id; END;",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  res.status(200).send();
});

app.post("/class", (req, res) => {
  connection.query(
    `INSERT INTO classes(class_name) VALUES ('${req.body.class.name}')`,
    (error, results, fields) => {
      if (error) {
        res.status(500).send();
        return;
      }
      res.status(201).send();
    }
  );
  res.status(201).send();
});

app.get("/class", (req, res) => {
  connection.query(`SELECT * FROM classes`, (error, results, fields) => {
    if (error) {
      res.status(500).send();
      return;
    }
    res.send(results);
    return;
  });
});

app.post("/student", (req, res) => {
  connection.query(
    `INSERT INTO students(student_name, student_roll, class_id, student_password) VALUES ('${req.body.student.name}', '${req.body.student.roll}', ${req.body.student.class}, '${req.body.student.password}')`,
    (error, results, fields) => {
      if (error) {
        res.status(500).send();
        return;
      }
      res.status(201).send();
    }
  );
  res.status(201).send();
});

app.get("/student", (req, res) => {
  connection.query(`SELECT * FROM students`, (error, results, fields) => {
    if (error) {
      res.status(500).send();
      return;
    }
    res.send(results);
    return;
  });
});

app.post("/teacher", (req, res) => {
  connection.query(
    `INSERT INTO teachers(teacher_name, teacher_username, teacher_password) VALUES ('${req.body.teacher.name}', '${req.body.teacher.username}', '${req.body.teacher.password}')`,
    (error, results, fields) => {
      if (error) {
        res.status(500).send();
        return;
      }
      res.status(201).send();
    }
  );
  res.status(201).send();
});

app.get("/teacher", (req, res) => {
  connection.query(`SELECT * FROM teachers`, (error, results, fields) => {
    if (error) {
      res.status(500).send();
      return;
    }
    res.send(results);
    return;
  });
});

app.post("/subject", (req, res) => {
  connection.query(
    `INSERT INTO subjects(subject_name, teacher_id, class_id) VALUES ('${req.body.subject.name}', ${req.body.subject.teacher}, ${req.body.subject.class})`,
    (error, results, fields) => {
      if (error) {
        res.status(500).send();
        return;
      }
      res.status(201).send();
    }
  );
});

app.get("/subject", (req, res) => {
  connection.query(`SELECT * FROM subjects`, (error, results, fields) => {
    if (error) {
      res.status(500).send();
      return;
    }
    res.send(results);
    return;
  });
});

app.post("/lecture", (req, res) => {
  if (
    req.header("Authorization") === undefined ||
    !jwt.verify(req.header("Authorization").substring(7), jwt_secret)
  )
    res.status(401).send();

  teacher_id = jwt.decode(req.header("Authorization").substring(7)).id;
  const lecture_code = randomString({ length: 5 });
  connection.query(
    `SELECT teacher_id FROM subjects WHERE subject_id=${req.body.lecture.subject}`,
    (error, results, fields) => {
      if (error) res.status(500).send();
      if (results[0].teacher_id === teacher_id) {
        connection.query(
          `INSERT INTO lectures(lecture_name, lecture_code, lecture_start, subject_id) VALUES ('${req.body.lecture.name}', '${lecture_code}', '${req.body.lecture.start}', ${req.body.lecture.subject})`,
          (error, results, fields) => {
            if (error) {
              res.status(500).send();
              return;
            }
            res.status(201).send(lecture_code);
            return;
          }
        );
      } else res.status(401).send();
    }
  );
});

app.get("/lecture", (req, res) => {
  connection.query(`SELECT * FROM lectures`, (error, results, fields) => {
    if (error) {
      res.status(500).send();
      return;
    }
    res.send(results);
    return;
  });
});

app.post("/attendance", (req, res) => {
  if (
    req.header("Authorization") === undefined ||
    !jwt.verify(req.header("Authorization").substring(7), jwt_secret)
  )
    res.status(401).send();
  student_id = jwt.decode(req.header("Authorization").substring(7)).id;

  connection.query(
    `SELECT stud.class_id AS stud_class, sub.class_id AS sub_class FROM students stud, subjects sub INNER JOIN lectures lec ON lec.subject_id=sub.subject_id WHERE stud.student_id=${student_id} AND lec.lecture_code='${req.body.attendance.lecture}';`,
    (error, results, fields) => {
      if (error) {
        res.status(401).send();
        return;
      }
      if (results[0].stud_class !== results[0].sub_class) {
        res.status(400).send("Student does not belong to this class");
        return;
      } else {
        connection.query(
          `SELECT * FROM attendance WHERE student_id=${student_id} AND lecture_id=(SELECT lecture_id FROM lectures WHERE lecture_code='${req.body.attendance.lecture}')`,
          (error, results, fields) => {
            if (results.length > 0) {
              if (error) {
                res.status(401).send();
                return;
              }
              res.status(200).send();
              return;
            } else {
              connection.query(
                `INSERT INTO attendance(student_id, lecture_id) VALUES (${student_id}, (SELECT lecture_id FROM lectures WHERE lecture_code='${req.body.attendance.lecture}'))`,
                (error, results, fields) => {
                  if (error) res.status(401).send();
                  return;
                }
              );
              res.status(201).send();
            }
          }
        );
      }
    }
  );
});

app.get("/attendance", (req, res) => {
  connection.query(`SELECT * FROM attendance`, (error, results, fields) => {
    if (error) {
      res.status(500).send();
      return;
    }
    res.send(results);
    return;
  });
});

app.post("/student/login", (req, res) => {
  const roll = req.body.student.roll;
  const password = req.body.student.password;
  connection.query(
    `SELECT * FROM students WHERE student_roll='${roll}'`,
    (error, results, fields) => {
      if (error) res.status(500).send();
      if (results.length > 0 && results[0].student_password === password) {
        res.status(200).send({
          jwt:
            "Bearer " +
            jwt.sign(
              {
                id: results[0].student_id,
                name: results[0].student_name,
                roll: results[0].student_roll,
              },
              jwt_secret
            ),
        });
      } else res.status(401).send();
    }
  );
});

app.post("/teacher/login", (req, res) => {
  const username = req.body.teacher.username;
  const password = req.body.teacher.password;
  connection.query(
    `SELECT * FROM teachers WHERE teacher_username='${username}'`,
    (error, results, fields) => {
      if (error) res.status(500).send();
      if (results.length > 0 && results[0].teacher_password === password)
        res.status(200).send({
          jwt:
            "Bearer " +
            jwt.sign(
              {
                id: results[0].teacher_id,
                name: results[0].teacher_name,
                username: results[0].teacher_username,
              },
              jwt_secret
            ),
        });
      else res.status(401).send();
    }
  );
});

app.get("/student/status", (req, res) => {
  if (
    req.header("Authorization") === undefined ||
    !jwt.verify(req.header("Authorization").substring(7), jwt_secret)
  )
    res.status(401).send();
  student_id = jwt.decode(req.header("Authorization").substring(7)).id;
  connection.query(
    `SELECT 
    subj.subject, COUNT(atte.lecture_id) AS attended, COUNT(subj.lecture_id) AS total, concat(round((COUNT(atte.lecture_id)/COUNT(subj.lecture_id))*100, 1), '%') as percentage
    FROM
    (SELECT
    sub.subject_id, sub.subject_name AS subject, lec.lecture_id
    FROM
    subjects sub
    INNER JOIN lectures lec
    ON
    sub.subject_id=lec.subject_id
    WHERE
    sub.class_id=(SELECT class_id FROM students WHERE student_id=${student_id})) AS subj
    LEFT JOIN
    (SELECT sub.subject_id, sub.subject_name AS subject, att.lecture_id FROM attendance att
    INNER JOIN lectures lec
    ON
    att.lecture_id=lec.lecture_id
    INNER JOIN subjects sub
    ON
    sub.subject_id=lec.subject_id WHERE student_id=${student_id}) AS atte
    ON atte.subject_id=subj.subject_id
    GROUP BY subj.subject_id;`,
    (error, results, fields) => {
      if (error) res.status(500).send();
      else res.status(200).send(results);
    }
  );
});

app.get("/teacher/lectures", (req, res) => {
  if (
    req.header("Authorization") === undefined ||
    !jwt.verify(req.header("Authorization").substring(7), jwt_secret)
  )
    res.status(401).send();
  let teacher_id = jwt.decode(req.header("Authorization").substring(7)).id;
  let subjects = [];
  connection.query(
    `SELECT sub.subject_id AS subject_id, sub.subject_name AS subject, cls.class_name as class FROM subjects sub INNER JOIN classes cls ON sub.class_id=cls.class_id WHERE sub.teacher_id=${teacher_id}`,
    (error, results, fields) => {
      if (error) res.status(500).send();
      else {
        subjects = results.map((sub) => {
          return {
            subject_id: sub.subject_id,
            subject: `${sub.class} | ${sub.subject}`,
          };
        });
        connection.query(
          `SELECT
          lec.lecture_id, sub.subject_id AS subject_id, sub.subject_name AS subject, cls.class_name AS class, lec.lecture_name AS lecture, lec.lecture_start AS start, lec.lecture_code AS code
          FROM
          subjects sub
          INNER JOIN lectures lec
          ON
          sub.subject_id=lec.subject_id
          INNER JOIN classes cls
          ON
          sub.class_id=cls.class_id
          WHERE
          sub.teacher_id=${teacher_id}
          ORDER BY
          lec.lecture_start DESC`,
          (error, results, fields) => {
            if (error) res.status(500).send();
            else
              res.status(200).send({ subjects: subjects, lectures: results });
          }
        );
      }
    }
  );
});

app.put("/student", (req, res) => {
  if (
    req.header("Authorization") === undefined ||
    !jwt.verify(req.header("Authorization").substring(7), jwt_secret)
  )
    res.status(401).send();
  student_id = jwt.decode(req.header("Authorization").substring(7)).id;
  connection.query(
    `SELECT student_password FROM students WHERE student_id=${student_id}`,
    (error, results, fields) => {
      if (error) res.status(500).send();
      if (results[0].student_password === req.body.student.old)
        connection.query(
          `UPDATE students SET student_password=${req.body.student.new} WHERE student_id=${student_id}`,
          (error, results, fields) => {
            if (error) res.status(500).send();
            else res.status(200).send();
          }
        );
      else res.status(401).send();
    }
  );
});

app.put("/teacher", (req, res) => {
  if (
    req.header("Authorization") === undefined ||
    !jwt.verify(req.header("Authorization").substring(7), jwt_secret)
  )
    res.status(401).send();
  teacher_id = jwt.decode(req.header("Authorization").substring(7)).id;
  connection.query(
    `SELECT teacher_password FROM teachers WHERE teacher_id=${teacher_id}`,
    (error, results, fields) => {
      if (error) res.status(500).send();
      if (results[0].teacher_password === req.body.teacher.old)
        connection.query(
          `UPDATE teachers SET teacher_password=${req.body.teacher.new} WHERE teacher_id=${teacher_id}`,
          (error, results, fields) => {
            if (error) res.status(500).send();
            else res.status(200).send();
          }
        );
      else res.status(401).send();
    }
  );
});

app.get("/teacher/lectures/:id", (req, res) => {
  if (
    req.header("Authorization") === undefined ||
    !jwt.verify(req.header("Authorization").substring(7), jwt_secret)
  )
    res.status(401).send();
  var attendance = [];
  connection.query(
    `SELECT
    stud.student_id AS id, stud.student_name AS name, stud.student_roll AS roll
    FROM
    lectures lec
    INNER JOIN attendance att
    ON
    lec.lecture_id=att.lecture_id
    INNER JOIN students stud
    ON
    att.student_id=stud.student_id
    WHERE
    lec.lecture_id=${req.params.id}`,
    (error, results, fields) => {
      if (error) res.status(500).send();
      else attendance = results;
    }
  );
  connection.query(
    `SELECT sub.subject_name AS subject, lec.lecture_name AS lecture, lec.lecture_start AS start, lec.lecture_code AS code, lec.attendees AS attendees FROM lectures lec INNER JOIN subjects sub ON sub.subject_id=lec.subject_id WHERE lec.lecture_id=${req.params.id}`,
    (error, results, fields) => {
      if (error) res.status(500).send();
      else
        res.status(200).send({ lecture: results[0], attendance: attendance });
    }
  );
});

app.delete("/lecture/:id", (req, res) => {
  if (
    req.header("Authorization") === undefined ||
    !jwt.verify(req.header("Authorization").substring(7), jwt_secret)
  )
    res.status(401).send();
  connection.query(
    `DELETE FROM attendance WHERE lecture_id=${req.params.id}`,
    (error, results, fields) => {
      if (error) res.status(500).send();
    }
  );
  connection.query(
    `DELETE FROM lectures WHERE lecture_id=${req.params.id}`,
    (error, results, fields) => {
      if (error) res.status(500).send();
    }
  );
  res.status(200).send();
});

app.delete("/teacher/lectures/:id/:student", (req, res) => {
  if (
    req.header("Authorization") === undefined ||
    !jwt.verify(req.header("Authorization").substring(7), jwt_secret)
  )
    res.status(401).send();
  connection.query(
    `DELETE FROM attendance WHERE lecture_id=${req.params.id} AND student_id=${req.params.student}`,
    (error, results, fields) => {
      if (error) res.status(500).send();
    }
  );
  res.status(200).send();
});

app.listen(port, () => {
  connection.query("DROP TABLES attendance", (error, results, fields) => {
    if (error) console.error(error);
  });
  connection.query("DROP TABLES lectures", (error, results, fields) => {
    if (error) console.error(error);
  });
  connection.query("DROP TABLES subjects", (error, results, fields) => {
    if (error) console.error(error);
  });
  connection.query("DROP TABLES teachers", (error, results, fields) => {
    if (error) console.error(error);
  });
  connection.query("DROP TABLES students", (error, results, fields) => {
    if (error) console.error(error);
  });
  connection.query("DROP TABLES classes", (error, results, fields) => {
    if (error) console.error(error);
  });
  connection.query(
    "DROP TRIGGER student_attendance_insert_trigger",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TABLE classes (class_id INT PRIMARY KEY AUTO_INCREMENT,class_name VARCHAR(20))",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TABLE students (student_id INT PRIMARY KEY AUTO_INCREMENT,student_name VARCHAR(30),student_roll VARCHAR(20) UNIQUE,student_password VARCHAR(8),class_id INT,FOREIGN KEY (class_id) REFERENCES classes(class_id))",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TABLE teachers (teacher_id INT PRIMARY KEY AUTO_INCREMENT,teacher_name VARCHAR(30),teacher_username VARCHAR(15) UNIQUE,teacher_password VARCHAR(8))",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TABLE subjects (subject_id INT PRIMARY KEY AUTO_INCREMENT,subject_name VARCHAR(15),teacher_id INT,class_id INT,FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),FOREIGN KEY (class_id) REFERENCES classes(class_id))",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TABLE lectures (lecture_id INT PRIMARY KEY AUTO_INCREMENT,lecture_name VARCHAR(30),lecture_code VARCHAR(5) UNIQUE,lecture_start DATETIME,subject_id INT,attendees INT DEFAULT 0,,FOREIGN KEY (subject_id) REFERENCES subjects(subject_id))",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TABLE attendance (attendance_id INT PRIMARY KEY AUTO_INCREMENT,student_id INT,lecture_id INT,FOREIGN KEY (student_id) REFERENCES students(student_id),FOREIGN KEY (lecture_id) REFERENCES lectures(lecture_id))",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  connection.query(
    "CREATE TRIGGER student_attendance_insert_trigger AFTER INSERT ON attendance FOR EACH ROW BEGIN UPDATE lectures SET attendees = attendees + 1 WHERE lecture_id=NEW.lecture_id; END;",
    (error, results, fields) => {
      if (error) console.error(error);
    }
  );
  console.log(`Listening on port : ${port}`);
});
